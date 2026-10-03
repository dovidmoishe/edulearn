import React from 'react'
import Verify from '@/../components/Auth/Verify'
import Sidebar from '@/../components/Auth/sidebar'

  
const VerifyMain = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center gap-[100px] p-[50px] py-[80px]'>
        <div className='w-1/2 flex justify-center'>
          <Verify />
        </div>
        <div className='w-1/2 flex justify-center hidden md:flex'>
          <Sidebar /> 
        </div>
    </div>
  )
}

export default VerifyMain