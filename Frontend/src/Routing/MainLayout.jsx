import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../Components/Sidebar'
import Posts from '../Components/Posts'

function MainLayout() {
  return (
    <div className='md:flex '>
      <Sidebar />
    <div className='w-full'> 
      <Outlet />
     
    </div>
    </div>
  )
}

export default MainLayout
