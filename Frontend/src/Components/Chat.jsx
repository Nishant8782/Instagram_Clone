"use client"

import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

export default function ChatPage() {
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [activeUser, setActiveUser] = useState(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [showUserList, setShowUserList] = useState(true)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const {user} = useSelector(store => store.auth);
  const {suggestedUser} = useSelector(store => store.suggestedUser); 
  const {onlineUsers} = useSelector(store => store.chat);
  console.log("ye online hain", onlineUsers);
  console.log("ye suggestedUser hain", suggestedUser);

  



  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://instagram-clone-6.onrender.com/api/v1/user/suggested", {
        withCredentials: true,
      })
      if (res.data.success) {
        setUsers(res.data.users || [])
        
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    }
  }
console.log("activeuserrrrrr", activeUser);

  // Fetch messages for a conversation
  const fetchMessages = async () => {


    setLoading(true)
    try {
      const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/message/all/${activeUser._id}`, {
        withCredentials: true,
      })

      console.log(res)

      if (res.data.success) {
        setMessages(res.data.message || [])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
     
    } finally {
      setLoading(false)
    }
  }

  // Send a message
// Send a message
const sendMessage = async () => {
  if (!newMessage.trim() || !activeUser?._id) return

  try {
    const res = await axios.post(
      `https://instagram-clone-6.onrender.com/api/v1/message/send/${activeUser._id}`,
      { message: newMessage },
      { withCredentials: true },
    )

    if (res.data.success) {
      setNewMessage("") 
      fetchMessages();  // <<===== Yeh line add kar de bhai
    }
  } catch (error) {
    console.error("Error sending message:", error)
    toast.error("Failed to send message")
  }
}

  

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowUserList(true)
      }
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch messages when active user changes
  useEffect(() => {
    if (user?._id) {
      fetchMessages()
    }
  }, [activeUser])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle selecting a user
  const handleSelectUser = (selectedUser) => {
    setActiveUser(selectedUser)

    if (isMobileView) {
      setShowUserList(false)
    }
  }

  // Handle back button in mobile view
  const handleBackToList = () => {
    setShowUserList(true)
  }

  return (
    <div className="flex h-screen bg-white py-10 pt-16 md:py-0 md:pt-0">
      {/* User List */}
      {(showUserList || !isMobileView) && (
        <div className="w-full md:w-[350px] border-r border-gray-200 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold">Messages</h1>
          </div>

          {/* Users */}
          <div className="flex-1 overflow-y-auto">
            {users.length > 0 ? (
              users.map((chatUser) => {
                const online = onlineUsers.includes(chatUser?._id)
             return (
                <>
                <div
                  key={chatUser._id}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                    activeUser?._id === chatUser._id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSelectUser(chatUser)}
                >
                  <div className="relative">
                    <img
                      src={chatUser.profilePicture || `/placeholder.svg?height=56&width=56`}
                      alt={chatUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <span className="font-semibold">{chatUser.username}</span>
                    <p
                    className={`${online ? "text-green-600 " : "text-red-600" } text-xs font-semibold`}
                    >{online ? "Online" : "Offline"}</p>
                  </div>
                </div>
               
                </>
             )
              }
              ))
             : (
              <div className="p-4 text-center text-gray-500">No users found</div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      {(!showUserList || !isMobileView) && activeUser && (
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b border-gray-200">
            {isMobileView && (
              <button className="mr-2" onClick={handleBackToList}>
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="relative">
              <img
                src={activeUser.profilePicture || `/placeholder.svg?height=40&width=40`}
                alt={activeUser.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="ml-3">
              <div className="font-semibold">{activeUser.username}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : messages?.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex mb-4 ${message.senderId === user._id ? "justify-end" : "justify-start"}`}
                >
                  {message.senderId !== user._id && (
                    <img
                      src={activeUser.profilePicture || `/placeholder.svg?height=32&width=32`}
                      alt={activeUser.username}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-3xl ${
                      message.senderId === user._id
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-100 text-black rounded-bl-md"
                    }`}
                  >
                    <p>{message.message}</p>
                    <div className={`text-xs mt-1 ${message.sender === user._id ? "text-blue-100" : "text-gray-500"}`}>
                      
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm">Start a conversation with {activeUser.username}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Message..."
                className="flex-1 bg-transparent border-none outline-none px-3 py-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage()
                  }
                }}
              />
              <button
                className={`p-2 rounded-full ${newMessage.trim() ? "text-blue-500" : "text-gray-400"}`}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no user is selected */}
      {(!showUserList || !isMobileView) && !activeUser && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        </div>
      )}
    </div>
  )
}
