import React, { useRef, useEffect, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setAuthUser } from './redux/authSlice';

const CreatePost = ({ onClose }) => {
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [step, setStep] = useState(1); // 1: file preview, 2: caption screen
    const [caption, setCaption] = useState("");
    const [data, setdata] = useState([]);

    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewURL(URL.createObjectURL(file));
            setStep(1); // Reset to step 1 on new file
        }
    };

    const fetchAllPosts = async () => {
        try {
          console.log("API call firing...");
          const res = await axios.get("http://localhost:8000/api/v1/post/all", {
            withCredentials: true
          });
          console.log("Response:", res);
          if (res.data.success) {
            setData(res.data.posts);
          }
        } catch (error) {
          console.error("API error:", error);
        }
      };
      useEffect(() => {
        
    
        fetchAllPosts();
        
      }, []);

    const handleNext = () => setStep(2);

    const handlePost = async () => {
        // Here you can handle post logic like uploading to backend
        console.log("Posting:", { image, caption });


        // Create a FormData object
        const formData = new FormData();
        formData.append('image', image); // 'image' should match the field name expected by the backend
        formData.append('caption', caption);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
                withCredentials: true
            });
            if(res.data.success){
                toast.success(`${res.data.message}`)
                console.log("dfgiuyeityerityertieryuteriutyeriu",res.data);
                fetchAllPosts();
               
                onClose();
            }
            console.log('Image uploaded successfully:', res.data);
            
        } catch (err) {
            console.error('Error uploading image:', err);
        }

       
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-5 right-5 text-white hover:scale-110 transition">
                <X size={30} />
            </button>

            <div ref={modalRef} className="bg-[#262626] text-white rounded-xl w-[100vh] h-[70vh] p-4 flex flex-col jus shadow-xl">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-lg font-semibold">Create new post</h2>
                    {previewURL && (
                        step === 1 ? (
                            <button
                                onClick={handleNext}
                                className="text-blue-500 hover:text-blue-600 font-semibold"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handlePost}
                                className="text-blue-500 hover:text-blue-600 font-semibold"
                            >
                                Post
                            </button>
                        )
                    )}
                </div>

                {previewURL ? (
                    step === 1 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <img
                                src={previewURL}
                                alt="Preview"
                                className="max-h-[40vh] object-contain rounded"
                            />
                        </div>
                    ) : (
                        <div className="flex h-full">
                            <div className="w-6/6 flex items-center justify-center p-4">
                                <img
                                    src={previewURL}
                                    alt="Preview"
                                    className="max-h-[60vh] object-contain rounded"
                                />
                            </div>
                            <div className="w-1/2 p-4 flex flex-col">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-400 rounded-full w-12 h-12 mr-2">
                                        <img src={user.profilePicture} className="w-12 h-12 rounded-full" />
                                    </div>
                                    <span className="font-semibold">{user.username}</span>
                                </div>
                                <textarea
                                    className="bg-transparent border border-gray-500 rounded p-2 resize-none h-full focus:outline-none"
                                    placeholder="Write a caption..."
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <ImagePlus size={60} className="mb-4" />
                        <p className="text-sm mb-6 text-center">Drag photos and videos here</p>
                    </div>
                )}

                <div className="flex flex-col items-center mt-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,video/*"
                    />
                    {step === 1 && (
                        <button
                            onClick={handleButtonClick}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
                        >
                            {previewURL ? 'Change File' : 'Select From Computer'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
