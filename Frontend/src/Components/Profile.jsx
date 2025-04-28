import React, { useState } from 'react';
import { Settings, Grid3X3, Bookmark, User, Heart, MessageCircle, Edit2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import store from './redux/store';
import EditProfile from './EditProfile';

const highlightData = [
  { id: 1, title: 'Travel', imageUrl: 'https://images.pexels.com/photos/2429277/pexels-photo-2429277.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 2, title: 'Design', imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const Profile = () => {
  const { user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState('posts');
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit(true);
  };

  return (
    <div className="max-w-full max-h-[100vh] py-20 md:py-0 overflow-y-scroll mx-auto p-4 bg-white md:pt-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 pb-6">
        <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
            <h2 className="text-lg md:text-2xl font-semibold">{user.username}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <button 
                onClick={handleEdit}
                className="border flex border-gray-300 hover:bg-gray-50 transition-colors px-3 md:px-4 py-1 rounded-md text-xs md:text-sm font-medium"
              >
                <Edit2 className="h-4 w-4 m-1 mr-2" /> Edit
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 transition-colors p-1.5 rounded-md">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-6 mb-4 text-xs md:text-sm">
            <div className="flex flex-col md:flex-row md:items-center md:gap-1">
              <span className="font-semibold">{user?.posts?.length || 0}</span>
              <span className="text-gray-500">posts</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-1">
              <span className="font-semibold">{user?.followers?.length || 0}</span>
              <span className="text-gray-500">followers</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-1">
              <span className="font-semibold">{user?.following?.length || 0}</span>
              <span className="text-gray-500">following</span>
            </div>
          </div>

          <div className="mt-2">
            <p className="font-semibold text-sm md:text-base">{user.username}</p>
            <p className="text-xs md:text-sm">UI/UX Designer • Digital Creator</p>
            <p className="text-xs md:text-sm my-1">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="flex gap-3 md:gap-4 mt-2 pb-6 overflow-x-auto scrollbar-hide">
        {highlightData.map((highlight) => (
          <div key={highlight.id} className="flex flex-col items-center flex-shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full p-[2px] bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500">
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
        <div className="flex justify-around text-[11px] md:text-xs font-medium text-gray-500 sticky top-0 bg-white">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-1.5 py-2 md:py-3 px-2 ${
              activeTab === 'posts' 
                ? 'text-black border-t border-black -mt-[1px]' 
                : 'hover:text-gray-800'
            }`}
          >
            <Grid3X3 className={`w-4 h-4 ${activeTab === 'posts' ? 'text-black' : ''}`} />
            <span>POSTS</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 py-2 md:py-3 px-2 ${
              activeTab === 'saved' 
                ? 'text-black border-t border-black -mt-[1px]' 
                : 'hover:text-gray-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeTab === 'saved' ? 'text-black' : ''}`} />
            <span>SAVED</span>
          </button>

          <button
            onClick={() => setActiveTab('tagged')}
            className={`flex items-center gap-1.5 py-2 md:py-3 px-2 ${
              activeTab === 'tagged' 
                ? 'text-black border-t border-black -mt-[1px]' 
                : 'hover:text-gray-800'
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === 'tagged' ? 'text-black' : ''}`} />
            <span>TAGGED</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 mt-1">
        {user.post.map((post) => (
          <div key={post._id} className="relative w-full aspect-square group">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center text-white">
                <Heart className="text-white w-4 h-4 mr-1 fill-white" />
                <span className="text-xs font-semibold">{post.likes.length}</span>
              </div>
              <div className="flex items-center text-white">
                <MessageCircle className="text-white w-4 h-4 mr-1 fill-transparent" />
                <span className="text-xs font-semibold">{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      {edit && (
        <div className="fixed p-8 inset-0 top-10 bg-black bg-opacity-40 flex items-center justify-center">
          <EditProfile edit={edit} setEdit={setEdit} />
        </div>
      )}
    </div>
  );
};

export default Profile;
