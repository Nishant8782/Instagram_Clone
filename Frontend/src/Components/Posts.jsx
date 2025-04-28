import React from 'react'
import Post from '../Components/Post'
function Posts() {
  return (
    <div>
      {
        [1].map((items, index) => (
            <>
            <Post />
            </>
        ))
      }
    </div>
  )
}

export default Posts
