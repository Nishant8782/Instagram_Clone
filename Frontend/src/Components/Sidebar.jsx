import { useState, useEffect, useRef } from "react"
import {
  Instagram,
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  User,
  LogOut,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import axios from "axios"
import { Link, useNavigate } from "react-router"
import { useSelector } from "react-redux"
import CreatePost from "./CreatePost"
import Notification from "./Notification"

function Sidebar() {
  const { suggestedUser } = useSelector(store => store.suggestedUser);
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");

  const notificationRef = useRef(null)
  const dropdownRef = useRef(null)

  const navigate = useNavigate()

  const { user } = useSelector((store) => store.auth)

  const LogOutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true })
      if (res.data.sucess === true) {
        navigate("/")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast(error.response?.data?.message)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredData = suggestedUser.filter((item) =>
    item.username.includes(search)
  );

  const toggleNotifications = (e) => {
    e.preventDefault()
    setShowNotifications(!showNotifications)
  }

  return (
    <div className="flex md:h-screen bg-white relative">
      <ToastContainer />

      {/* Sidebar - Only for large devices */}
      <div className="hidden md:flex w-[275px] border-r border-gray-200 p-5 flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-2 p-2 rounded-md bg-white cursor-pointer">
          <Instagram className="w-6 h-6 mr-2 text-[#E1306C]" />
          <span className="text-[#262626] text-2xl" style={{ fontFamily: "Lobster, cursive" }}>
            Instagram
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            <li>
              <Link to="/app" className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-6 h-6" />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li>
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors w-full"
                >
                  <Search className="w-6 h-6" />
                  <span className="font-medium">Search</span>
                </button>

                {/* Search Dropdown */}
                {showSearch && (
                  <div className="absolute top-14 left-0 w-[400px] min-h-[60vh] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="max-h-[calc(50vh-70px)] overflow-y-auto px-4 py-2">
                      {search.length > 0 && filteredData.length > 0 ? (
                        <>
                          {filteredData.map((user) => (
                            <div className="flex space-x-2 hover:bg-gray-100" key={user._id}>
                              <img src={user.profilePicture} className="h-8 mt-1 w-8 rounded-full" />
                              <p className="p-2 text-gray-800 font-semibold rounded-md cursor-pointer">
                                {user.username}
                              </p>
                            </div>
                          ))}
                        </>
                      ) : search.length > 0 ? (
                        <p className="p-2 text-gray-400">No result found</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </li>

            <li>
              <Link to="explore" className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors">
                <Compass className="w-6 h-6" />
                <span className="font-medium">Explore</span>
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors">
                <Film className="w-6 h-6" />
                <span className="font-medium">Reels</span>
              </a>
            </li>
            <li>
              <Link to="chat" className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">Messages</span>
              </Link>
            </li>
            <li>
              <div ref={notificationRef}>
                <a
                  href="#"
                  className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleNotifications}
                >
                  <Heart className="w-6 h-6" />
                  <span className="font-medium">Notifications</span>
                </a>

                {showNotifications && (
                  <Notification showNotifications={showNotifications} setShowNotifications={setShowNotifications} />
                )}
              </div>
            </li>
            <li>
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors w-full"
                >
                  <PlusSquare className="w-6 h-6" />
                  <span className="font-medium">Create</span>
                </button>

                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button className="flex items-center w-full gap-2 px-4 py-4 text-md font-semibold hover:bg-gray-100">
                      <Film className="w-6 h-6" />
                      Reel
                    </button>
                    <button
                      className="flex items-center w-full gap-2 px-4 py-4 text-md font-semibold hover:bg-gray-100"
                      onClick={() => setShowModal(true)}
                    >
                      <PlusSquare className="w-6 h-6" />
                      Post
                    </button>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link to="profile" className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors">
                {user?.profilePicture ? (
                  <img src={user.profilePicture || "/placeholder.svg"} className="h-6 w-6 rounded-full object-cover" alt="Profile" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <span className="font-medium">Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={LogOutHandler}
            className="flex items-center gap-4 p-3 text-base hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">LogOut</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="flex md:hidden w-full fixed top-0 z-50 h-16 bg-white justify-between items-center px-4 py-2 border-b">
        <Instagram className="w-6 h-6 text-pink-600" />
        <span className="text-[#262626] text-2xl" style={{ fontFamily: "Lobster, cursive" }}>
            Instagram
          </span>
        <div className="flex items-center gap-4" ref={notificationRef}>
          
          <Heart 
           onClick={toggleNotifications}
          className="w-6 h-6" />
          <Link to="/app/chat">
          <MessageCircle className="w-6 h-6" />
          </Link>
          
        </div>

        {showNotifications && (
                  <Notification showNotifications={showNotifications} setShowNotifications={setShowNotifications} />
                )}
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 z-50 right-0 bg-white border-t flex justify-around items-center py-2 md:hidden">
        <Link to="/app"><Home className="w-6 h-6" /></Link>
        <Link to="/app/explore" ><button><Search className="w-6 h-6 relative" /></button></Link>
        <button onClick={() => setShowModal(true)}><PlusSquare className="w-6 h-6" /></button>
        <Link to="/app/explore"><Compass className="w-6 h-6" /></Link>
        <Link to="/app/profile">
          {user?.profilePicture ? (
            <img src={user.profilePicture} className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}  
        </Link>

        
      </div>
       {/* Search Dropdown */}
      

      {/* Create Post Modal */}
      {showModal && <CreatePost onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default Sidebar
