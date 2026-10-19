import React from 'react'
import Signup from './Signup'
import Sidebar from './sidebar'
const Main = () => {
  return (
    <div className='w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-[40px] md:gap-[100px] px-6 py-8 md:p-[50px] md:py-[80px]'>
        <div className='w-full md:w-1/2 flex justify-center'>
          <Signup />
        </div>
        <div className='hidden md:flex md:w-1/2 justify-center'>
          <Sidebar />
        </div>
    </div>
  )
}

export default Main