import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router'
import RightSidebar from './RightSidebar'
import useSuggestedUser from '../hooks/useSuggestedUser'

function Home() {
  useSuggestedUser();
  return (
    <div className='flex w-full '>
        <div className='flex-grow '>
           <Feed />
           <Outlet />
        </div>
      <RightSidebar/>
    </div>
  )
}

export default Home
