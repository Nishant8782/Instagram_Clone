import React, { useEffect, useState } from 'react';
import { Settings, Grid3X3, Bookmark, User, Heart, MessageCircle, FileVolumeIcon, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const highlightData = [
  { id: 1, title: 'Travel', imageUrl: 'https://images.pexels.com/photos/2429277/pexels-photo-2429277.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 2, title: 'Design', imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const Profile = ({ profileId, setShowProfile }) => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [profileData, setProfileData] = useState([]);
  
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/user/${profileId}/profile`, {
        withCredentials: true
      });

      if (res.data.success) {
        setProfileData(res.data.user);
      }

      if (res.data.user._id === user._id) {
        setShowProfile(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (id) => {
    try {
      const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/user/followorunfollow/${id}`, {
        withCredentials: true
      });

      if (res.data.success) {
        fetchProfile();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="max-w-full min-h-[77vh] max-h-[77vh] overflow-y-scroll mx-auto p-2 md:p-8 bg-white rounded-md">
      
      <div className="w-full flex justify-end mb-2">
        <button onClick={() => setShowProfile(false)}>
          <X className="text-lg font-bold" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={profileData.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
            <h2 className="text-lg md:text-2xl font-semibold">{profileData.username}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <button 
                onClick={() => handleFollow(profileData?._id)}
                className="flex items-center gap-1 border border-gray-300 text-white bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded-md text-xs md:text-sm"
              >
                <FileVolumeIcon className="h-4 w-4" /> Follow
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 p-1.5 rounded-md">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-4 mb-4 text-xs md:text-sm">
            <div className="flex flex-col md:flex-row md:items-center md:gap-1">
              <span className="font-semibold">{profileData?.posts?.length || 0}</span>
              <span className="text-gray-500">posts</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-1">
              <span className="font-semibold">{profileData?.followers?.length || 0}</span>
              <span className="text-gray-500">followers</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-1">
              <span className="font-semibold">{profileData?.following?.length || 0}</span>
              <span className="text-gray-500">following</span>
            </div>
          </div>

          <div className="mt-1">
            <p className="font-semibold">{profileData.username}</p>
            <p className="text-xs md:text-sm">UI/UX Designer • Digital Creator</p>
            <p className="text-xs md:text-sm mt-1">{profileData.bio}</p>
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="flex gap-4 mt-4 pb-4 overflow-x-auto scrollbar-hide">
        {highlightData.map((highlight) => (
          <div key={highlight.id} className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img
                  src={highlight.imageUrl}
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-[10px] md:text-xs mt-1">{highlight.title}</p>
          </div>
        ))}
      </div>

      {/* Profile Tabs */}
      <div className="border-t mt-2">
        <div className="flex justify-around text-xs md:text-sm font-medium text-gray-500 sticky top-0 bg-white z-10">
          {['posts', 'saved', 'tagged'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 py-3 px-2 ${
                activeTab === tab ? 'text-black border-t border-black -mt-[1px]' : 'hover:text-gray-800'
              }`}
            >
              {tab === 'posts' && <Grid3X3 className="w-4 h-4" />}
              {tab === 'saved' && <Bookmark className="w-4 h-4" />}
              {tab === 'tagged' && <User className="w-4 h-4" />}
              <span className="hidden sm:inline">{tab.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4 mt-2">
        {profileData?.posts?.map((post) => (
          <div key={post._id} className="relative group aspect-square overflow-hidden">
            <img
              src={post.image}
              className="w-full h-full object-cover rounded"
              alt=""
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center text-white">
                <Heart className="w-5 h-5 mr-1 fill-white" />
                <span className="text-xs font-semibold">{post.likes.length}</span>
              </div>
              <div className="flex items-center text-white">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span className="text-xs font-semibold">{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;
