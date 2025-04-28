import React, {useState, useRef, useEffect} from 'react'
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


function Notification({ showNotifications, setShowNotifications }) {
    const notifications = [
        {
          id: 1,
          user: {
            username: "johndoe",
            profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          type: "like",
          content: "liked your photo.",
          time: "2m",
          seen: false,
        },
        {
          id: 2,
          user: {
            username: "janedoe",
            profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          type: "follow",
          content: "started following you.",
          time: "1h",
          seen: false,
        },
        {
          id: 3,
          user: {
            username: "mike_smith",
            profilePicture: "https://randomuser.me/api/portraits/men/86.jpg",
          },
          type: "comment",
          content: 'commented on your post: "Great shot!"',
          time: "3h",
          seen: true,
        },
        {
          id: 4,
          user: {
            username: "sarah_j",
            profilePicture: "https://randomuser.me/api/portraits/women/67.jpg",
          },
          type: "mention",
          content: "mentioned you in a comment.",
          time: "5h",
          seen: true,
        },
        {
          id: 5,
          user: {
            username: "alex_design",
            profilePicture: "https://randomuser.me/api/portraits/men/42.jpg",
          },
          type: "like",
          content: "liked your comment.",
          time: "1d",
          seen: true,
        },
      ]
      
    const notificationRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleNotifications = (e) => {
    e.preventDefault()
    setShowNotifications(!showNotifications)
  }
  return (
    <div className="absolute md:left-16 md:top-0 top-14 md:min-h-screen min-h-[80vh] w-[90vw] md:w-[400px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                    </div>

                    <div className="min-h-full overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start p-4 hover:bg-gray-50 transition-colors ${!notification.seen ? "bg-blue-50" : ""}`}
                        >
                          <div className="relative mr-3">
                            <img
                              src={notification.user.profilePicture || "/placeholder.svg"}
                              alt={notification.user.username}
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                            {notification.type === "like" && (
                              <div className="absolute -right-1 -bottom-1 bg-red-500 p-1 rounded-full">
                                <Heart className="w-3 h-3 text-white" fill="white" />
                              </div>
                            )}
                            {notification.type === "follow" && (
                              <div className="absolute -right-1 -bottom-1 bg-blue-500 p-1 rounded-full">
                                <User className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {notification.type === "comment" && (
                              <div className="absolute -right-1 -bottom-1 bg-green-500 p-1 rounded-full">
                                <MessageCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-semibold">{notification.user.username}</span>{" "}
                                <span className="text-gray-600">{notification.content}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                {!notification.seen && <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-gray-200 flex justify-center">
                      <button className="text-blue-500 font-medium text-sm">See All</button>
                    </div>
                  </div>
  )
}

export default Notification
