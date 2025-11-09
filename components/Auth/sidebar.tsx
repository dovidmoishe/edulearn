import React from 'react'
import Image from 'next/image'
import SafeImage from './SafeImage'
import edulearn from "@/../public/assets/icons/edulearn.png"

const Sidebar = () => {
  return (
    <div className='rounded-[20px] flex flex-col justify-between bg-cover bg-center bg-no-repeat p-[40px] gap-[60px]' style={{backgroundImage: 'url(/onboarding.png)'}}>
        <div className='flex flex-col gap-[32px]'>
          <Image src={edulearn} width={150} height={31} alt='edulearn logo' />

          <div className="flex flex-col gap-[24px]">
            <p className='text-[48px] font-[500] leading-[52px] tracking-[-1px] text-white'>
              Join thousands leveling up daily.
            </p>

            <p className='opacity-[0.7] text-[16px] font-[400] leading-[22px] text-[#E4DBDB]'>
              From quick challenges to deep dives, EduLearn&apos;s community of learners is growing together — one badge at a time.
            </p>
          </div>
        </div>

        <div className='rounded-[20px] bg-white/10 flex flex-col gap-[16px] p-[24px]'>
          <p className='text-[16px] leading-[24px] font-[400] text-[#F0E6E6]'>
          As a Web3 gaming expert, I&apos;ve seen plenty of AI tools, but EduLearn actually stands out. The AI-powered quizzes pinpoint my weak spots and help me improve fast. It feels like training my brain with precision.
          </p>

          <div className='flex items-center gap-[12px]'>
            <SafeImage 
              src="https://pbs.twimg.com/profile_images/1970446634363371520/AIpKFc44_400x400.jpg" 
              width={40} 
              height={40} 
              alt='valour logo' 
              className='rounded-full'
            />

            <div className='flex flex-col gap-[4px]'>
              <p className='text-[14px] font-[600] leading-[20px] text-white'>Valour</p>
              <p className='text-[12px] font-[400] leading-[16px] text-[#A29999]'>Web3 Gaming creator</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Sidebar