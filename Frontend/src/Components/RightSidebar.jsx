import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import store from "./redux/store";
import axios from "axios";
import AllProfiles from "./AllProfiles";

const RightSidebar = () => {
  

  const {suggestedUser} = useSelector(store => store.suggestedUser);
  console.log("jkasghdfjhasdgfjhsdgf", suggestedUser)
  const {user} = useSelector(store => store.auth);
  const [profileData, setProfileData] = useState([]);
  const [profileId, setProfileId] = useState("");
  const [showProfile, setShowProfile] = useState(false);

 
  // const fetchProfile = async () => {
  //   try {
  //       const res = await axios.get(`https://instagram-clone-6.onrender.com:///api/v1/user/${profileId}/profile`, {
  //           withCredentials:true
  //       })

  //       if(res.data.success){
  //           setProfileData(res.data.user);
  //           console.log("dsjfgsdjfgsdjfhg", res.data.user)
  //       }

  //       if(res.data.user._id === user._id){
  //           setShowProfile(false)
           
  //       }
  //   } catch (error) {
  //       console.log(error);
        
  //   }
  // }

  // useEffect(() => {
  //   fetchProfile()
  // }, [profileId])
  return (
    <div className="w-full hidden md:inline max-w-sm p-4 text-sm text-gray-500">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={user.profilePicture}
            alt="Your profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">{user.username}</p>
            <p className="text-gray-400">{user.username}</p>
          </div>
        </div>
        <button className="text-blue-500 font-semibold hover:text-blue-700 transition">Switch</button>
      </div>

      {/* Suggestions Header */}
      <div className="flex justify-between items-center mb-3">
        <p className="font-semibold text-gray-500">Suggestions for you</p>
        <button className="text-xs hover:text-gray-800">See All</button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestedUser.map((suggested) => (
          <div key={suggested._id} className="flex items-center justify-between">
            <div 
            onClick={() => {
              setShowProfile(() => true)
              setProfileId(suggested._id)
            }}
            className="flex items-center gap-3">
              <img
                src={suggested.profilePicture}
               
                className="w-9 h-9 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">{suggested.username}</p>
                
              </div>
            </div>
            <button className="text-blue-500 font-semibold text-xs hover:text-blue-700 transition">Follow</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-[11px] text-gray-400 space-y-1">
        <p className="flex flex-wrap gap-2">
          <span>About</span> • <span>Help</span> • <span>Press</span> • <span>API</span> • <span>Jobs</span> • <span>Privacy</span> • <span>Terms</span> • <span>Locations</span>
        </p>
        <p className="text-gray-400 mt-2">© 2025 INSTAGRAM FROM META</p>
      </div>

      {showProfile && 
        <div className='fixed p-8 inset-0 bg-black w-screen h-screen bg-opacity-40'>
          
          <AllProfiles setShowProfile={setShowProfile} profileId={profileId}
          
          />
          
          
          </div>}

      
    </div>
  );
};

export default RightSidebar;
