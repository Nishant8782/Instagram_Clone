import React, { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const Explore = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { suggestedUser } = useSelector(store => store.suggestedUser);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("https://instagram-clone-6.onrender.com/api/v1/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          setData(res.data.posts);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchAllPosts();
  }, []);

  const filteredData = suggestedUser.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-h-screen overflow-y-scroll py-16 md:py-4">
      
      {/* Search Box */}
      <div className="p-4 border-b sticky top-0 bg-white z-10 border-gray-200">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      {search.length > 0 ? (
        <div className="max-h-[calc(50vh-70px)] space-y-3 overflow-y-auto px-4 py-2">
          {filteredData.length > 0 ? (
            <>
              {filteredData.map((user) => (
                <div
                  className="flex space-x-2 h-14 p-2 rounded hover:bg-gray-100"
                  key={user._id}
                >
                  <img
                    src={user.profilePicture}
                    className="h-8 mt-1 w-8 rounded-full"
                    alt="user"
                  />
                  <p className="p-2 text-gray-800 font-semibold rounded-md cursor-pointer">
                    {user.username}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p className="p-2 text-gray-400">No result found</p>
          )}
        </div>
      ) : (
        // Posts Only When No Search
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {data.map((image) => (
            <div
              key={image._id}
              className="relative overflow-hidden rounded-xl group break-inside-avoid"
            >
              <img
                src={image.image}
                alt="post"
                className="w-full h-auto object-cover rounded-xl transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4 text-white">
                <Heart className="w-6 h-6" />
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
