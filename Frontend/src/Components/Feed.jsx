import React from 'react'
import Posts from './Posts'

function Feed() {
  return (
   
        <div className='flex-1 flex flex-col md:max-h-[100vh] md:overflow-y-scroll'>
            <Posts />
        </div>
      
    
  )
}

export default Feed
