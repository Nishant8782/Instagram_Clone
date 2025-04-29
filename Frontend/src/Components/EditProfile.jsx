import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditProfile({ setEdit }) {
    const { user } = useSelector((store) => store.auth);
    const [profileData, setProfileData] = useState({
        username: user.username || "",
        bio: user.bio || "",
        email: user.email || "",
        gender: user.gender || "Prefer not to say",
    });
    const [showImageOverlay, setShowImageOverlay] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
        console.log("ye hai dataaa", profileData)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted: ", profileData);
    };

    const closeOverlay = () => {
        setEdit(false);
    };

    const handleEditProfile = async (e) => {
            e.preventDefault();
            
    
    
            // Create a FormData object
            const formData = new FormData();
            formData.append('profilePicture', profileData.profilePicture); // 'image' should match the field name expected by the backend
            formData.append('bio', profileData.bio);
            formData.append('gender', profileData.gender);
            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
    
            try {
                const res = await axios.post('https://instagram-clone-6.onrender.com/api/v1/user/profile/edit', formData, {
                    withCredentials: true
                });
                if(res.data.success){
                    toast.success(`${res.data.message}`)
                    dispatch(setAuthUser([...user , res.data.user]));
                    setEdit(false);
                }
                console.log('Image uploaded successfully:', res.data);
                setEdit(false);
            } catch (err) {
                console.error('Error uploading image:', err);
            }
    
           
        };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setShowImageOverlay(true);
        }
    };

    const handleNext = () => {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        setProfileData((prev) => ({ ...prev, profilePicture: file }));
        setShowImageOverlay(false);
    };

    return (
        <div className="max-h-[77vh] overflow-y-scroll p-4 rounded-md min-w-full z-50  bg-white text-[#262626] font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                <button onClick={closeOverlay} className="p-1">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-base font-semibold">Edit {user.username}'s Profile</h1>
                <button
                    onClick={handleSubmit}
                    className="text-sm font-semibold text-[#0095f6]"
                >
                    Done
                </button>
            </div>

            <div className="flex max-w-5xl mx-auto mt-6 px-4">
                {/* Sidebar */}
                <aside className="w-64 pr-6 hidden md:block">
                    <nav className="space-y-4 text-sm font-semibold">
                        <button className="text-black">Edit Profile</button><br></br>
                        <button
                            type="button"
                            className="text-sm text-gray-500 font-semibold"
                        >
                            Change Profile Photo
                        </button>



                        <button className="text-gray-500 hover:text-black">
                            Apps and Websites
                        </button>
                        <button className="text-gray-500 hover:text-black">
                            Email Notifications
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <form onSubmit={handleEditProfile} className="max-w-2xl">
                        {/* Profile Photo */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("fileInput").click()}
                                        className="text-sm text-[#0095f6] font-semibold"
                                    >
                                        Change Profile Photo
                                    </button>
                                </>
                            </div>
                        </div>

                        {/* Input Fields */}


                        <div className="flex mb-6">
                            <label className="w-32 text-right pr-6 text-sm font-semibold pt-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm outline-none"
                            />
                        </div>


                        <div className="flex mb-6">
                            <label className="w-32 text-right pr-6 text-sm font-semibold pt-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm outline-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex mb-6">
                            <label className="w-32 text-right pr-6 text-sm font-semibold pt-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm outline-none"
                            />
                        </div>


                        <div className="flex mb-6">
                            <label className="w-32 text-right pr-6 text-sm font-semibold pt-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={profileData.gender}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm outline-none"
                            >
                                <option value={user.gender}>{user.gender}</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="flex justify-start pl-32 mt-6">
                            <button
                                type="submit"
                                className="bg-[#0095f6] text-white text-sm font-semibold px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </main>
            </div>

            {showImageOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center w-80">
                        <h2 className="text-lg font-semibold mb-4">Choose from Device</h2>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="Selected"
                                className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
                            />
                        )}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowImageOverlay(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-[#0095f6] text-white text-sm rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
