import { useState, useEffect } from "react"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X, UserMinus, BookmarkCheck, AlarmClockPlus, SquareX } from "lucide-react"
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from "react-redux";
import store from "./redux/store";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import AllProfiles from "./AllProfiles";
import RightSidebar from "./RightSidebar"


export default function Post() {
  const { user } = useSelector(store => store.auth);
  const [selectedPost, setSelectedPost] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null);
  const [data, setData] = useState([]);
  const [like, setLike] = useState("");
  const [isLike, setIsLike] = useState("");
  const [text, setText] = useState("");
  const [commentId, setCommentId] = useState("");
  const [commentsId, setCommentsId] = useState("");
  const [profileId, setProfileId] = useState('');
  const [showprofile, setShowProfile] = useState(false);
  const [bookmarked, setBookmarked] = useState("")

  const navigate = useNavigate();

  const openComments = (postId) => {
    setSelectedPost(postId)
    setCommentId(id)
  }

  const closeComments = () => {
    setSelectedPost(null)
  }

  const toggleMenu = (postId) => {
    if (activeMenu === postId) {
      setActiveMenu(null)
    } else {
      setActiveMenu(postId)
    }
  }

  const handleMenuAction = (action) => {
    // Handle menu actions (unfollow, add to favorites)
    console.log(`Action: ${action} for post ${activeMenu}`)
    setActiveMenu(null)
  }
  const fetchAllPosts = async () => {
    try {
      console.log("API call firing...");
      const res = await axios.get("https://instagram-clone-6.onrender.com/api/v1/post/all", {
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

  const commentHandler = async() => {
    try {
      console.log("commentId", commentsId);
      const res = await axios.post(`https://instagram-clone-6.onrender.com/api/v1/post/${commentsId}/comment`,{text}, {
        withCredentials: true
      });
      console.log(res);
      fetchAllPosts();

      setText("")
     
      toast.success(res.data.message);
      console.log(res.data.message);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleLike = async (id) => {
  
    if (isLike !== id) {
      try {
        console.log("liked id", id);

        const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/post/${id}/like`, {
          withCredentials: true
        });
        fetchAllPosts();


        setLike(id);
        toast.success(res.data.message);
        console.log(res.data.message);
      } catch (error) {
        console.error("Error liking post", error);
      }
    } else {
      try {
        console.log("liked id", id);

        const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/post/${id}/dislike`, {
          withCredentials: true
        });

        fetchAllPosts();
        setLike(null);
        toast.success(res.data.message);
        console.log(res.data.message);
      } catch (error) {
        console.error("Error liking post", error);
      }
    }

  };

  // const handleComment = () => {
  //   try {
  //     const res = axios.post(`http://localhost:8000/api/v1/post/${commentId}/comment`, text, {
  //       withCredentials: true
  //     })
  //     if (res.data.success) {
  //       console.log(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  console.log("dataaaa", data);



  const showProfile = (id) => {

    if(user._id === id){
      setShowProfile(false);
      navigate("profile");
    }
    setProfileId(id);
    setShowProfile(true);

  }

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/post/delete/${id}`, {
        withCredentials:true
      })
      console.log(res)
      if(res.data.sucess){
        setActiveMenu(null)
        
        toast.success(res.data.message)
      }
      fetchAllPosts();

  } catch (error) {
    toast.error(error.response.data.message)
      
  }
  }

  const handleBookmark = async (id) => {
    try {
      const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/post/${id}/bookmark`, {
        withCredentials:true
      })

      if(res.data.success){
        setActiveMenu(null)
        setBookmarked(() => id);
        toast.success(res.data.message)
      }

  } catch (error) {
      console.log(error);
      
  }
  }
  const handleFollow = async (id) => {
    try {
      const res = await axios.get(`https://instagram-clone-6.onrender.com/api/v1/user/followorunfollow/${id}`,{
        withCredentials:true
      })

      if(res.data.success){
       

        toast.success(res.data.message) 
      }

  } catch (error) {
      console.log(error);
      
  }
  }
  return (
    <div className="min-h-screen min-w-full bg-gray-50 p-2 pt-14 md:p-8">
      {/* Main Content */}
      <main className="max-w-full mx-auto py-4">
        {/* Stories */}
        <div className="bg-white border rounded-lg mb-6 p-2">
          <div className="flex space-x-4 overflow-x-auto pb-2">

            <div className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div
              
                className={`w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600"`}
              >
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <span className="text-xs truncate w-16 text-center">Add Story</span>
            </div>

          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {data.slice(0,10).map((post) => (
            <article key={post._id} className="bg-white border rounded-lg">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div 
                onClick={() => showProfile(post.author._id)}
                className="flex items-center space-x-3">
                  <img
                    src={post.author.profilePicture || "/placeholder.svg"}

                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{post?.author.username}</div>
                    <div className="text-xs text-gray-500">Location</div>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2" onClick={() => toggleMenu(post?._id)}>
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Three-dot menu popup */}
                  {activeMenu === post._id && (
                    <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border z-10">
                      <button
                        className="w-full text-left px-4 py-3 text-blue-500 font-medium border-b flex items-center space-x-2"
                        onClick={() => handleFollow(post?.author._id)}
                      >
                        <UserMinus className="w-5 h-5" />
                        <span>Follow</span>
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 border-b flex items-center space-x-2"
                        onClick={() => handleBookmark(post?._id)}
                      >
                        <Bookmark className="w-5 h-5" />
                        <span>Add to favorites</span>
                      </button>
                      {
                        user && user?._id === post?.author._id &&
                        <button
                        className="w-full text-left text-red-400 px-4 py-3 flex items-center space-x-2"
                        onClick={() => {
                          handleDelete(post._id)
                          }}
                      >
                        <X className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                      }
                      <button
                        className="w-full text-left px-4 py-3 border-b flex items-center space-x-2"
                        onClick={() => setActiveMenu(null)}
                      >
                        <SquareX  className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Image */}
              <img src={post.image || "/placeholder.svg"} alt="Post" className="w-[850px] h-[500px] object-fill" />

              {/* Post Actions */}
              <div className="p-3">
                <div className="flex justify-between mb-3">
                  <div className="flex space-x-4">
                    <button onClick={() => {
                      setIsLike(post._id);
                      handleLike(post._id)
                    }
                    }
                      className="hover:text-gray-500">
                      {like === post._id ? (
                        <>
                          <Heart className="w-6 h-6" color="#f80d0d" strokeWidth={3} />
                        </>
                      ) : (
                        <>
                          <Heart className="w-6 h-6" />
                        </>
                      )}
                    </button>
                    <button 
                    
                    className="hover:text-gray-500" onClick={() => {
                    setCommentsId(post._id)
                    openComments(post._id)}
                    }>
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="hover:text-gray-500">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <button
                  onClick={() => handleBookmark(post._id)}
                  className="hover:text-gray-500">
                    {
                      bookmarked === post._id ? (
                        <BookmarkCheck />
                      ) : (
                        <Bookmark className="w-6 h-6" />
                      )
                    }

                  </button>
                </div>

                {/* Likes */}
                <div className="font-semibold mb-2">{post.likes.length} likes</div>

                {/* Caption */}
                <div className="mb-2 flex ">
                <img
                    src={post.author.profilePicture || "/placeholder.svg"}

                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold mr-2">{post.username}</span>
                  {post.caption}
                </div>

                {/* Comments Preview */}
                <button className="text-gray-500 text-sm mb-2" onClick={() => openComments(post._id)}>
                  View all {post.comments.length} comments
                </button>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 uppercase">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Comments Modal - Updated to show image alongside comments */}
      {selectedPost !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full min-h-[90vh] max-h-[80vh] overflow-y-scroll overflow-hidden flex flex-col md:flex-row">
            {/* Close button for mobile */}
            <button onClick={closeComments} className="absolute top-4 right-4 text-white md:hidden z-20">
              <X className="w-6 h-6" />
            </button>

            {/* Post Image - Takes up left side on desktop, top on mobile */}
            <div className="bg-white flex items-center justify-center">
              <img
                src={data.find((post) => post._id === selectedPost)?.image || "/placeholder.svg"}
                alt="Post"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Comments section - Takes up right side on desktop, bottom on mobile */}
            <div className="w-full bg-white flex flex-col h-full max-h-[90vh]">
              {/* Header with username and close button */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src={data.find((post) => post._id === selectedPost)?.author?.profilePicture || "/placeholder.svg"}
                    alt={data.find((post) => post._id === selectedPost)?.author?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="font-semibold">{data.find((post) => post._id === selectedPost)?.author?.username}</div>
                </div>
                <button onClick={closeComments} className="hidden md:block">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Comments list */}
              <div className="overflow-y-auto p-4 flex-grow">
                {/* Caption as first comment */}
                <p className="px-2 py-4 text-sm font-semibold">Post Created By :</p>
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={data.find((post) => post._id === selectedPost)?.author?.profilePicture || "/placeholder.svg"}
                    alt={data.find((post) => post._id === selectedPost)?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold mr-2">
                      {data.find((post) => post._id === selectedPost)?.author?.username}
                    </span>
                    {data.find((post) => post._id === selectedPost)?.caption}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-b my-3"></div>
                <p className="px-2 py-4 text-sm font-semibold">Comments : </p>
{console.log(selectedPost , "selectedPost")
}
                {/* Comments */}
                {data
                  .find((post) => post._id === selectedPost)
                  ?.comments.map((comment) => (
                    <div key={comment._id} className="flex items-start space-x-3 mb-4">
                      <img
                        src={comment.author?.profilePicture || "/placeholder.svg"}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold mr-2">{comment.author?.username}</span>
                        {comment.text}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Post actions */}
              <div className="border-t p-4">
                <div className="flex justify-between mb-3">
                  <div className="flex space-x-4">
                    <button className="hover:text-gray-500">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button 
                    
                    className="hover:text-gray-500">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="hover:text-gray-500">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="hover:text-gray-500">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Likes */}
                <div className="font-semibold mb-2">
                  {data.find((post) => post._id === selectedPost)?.likes.length} likes
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 uppercase">
                  {data.find((post) => post.id === selectedPost)?.timeAgo}
                </div>
              </div>

              {/* Comment input */}
              <div className="border-t p-3">
                <div className="flex items-center">
                  <input
                    type="text"
                    name="text"
                    value={(text)}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow border-none focus:ring-0 outline-none"
                  />
                  <button
                    onClick={() => commentHandler()}
                    className="text-sky-500 font-semibold">Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showprofile && 
        <div className='fixed p-8 py-20 md:py-0 inset-0 bg-black w-screen h-screen bg-opacity-40'>
          
          <AllProfiles setShowProfile={setShowProfile} profileId={profileId}
          
          />
          
          
          </div>}
          
    </div>
  )
}
