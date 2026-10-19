import LearningMain from '@/../components/Auth/LearningMain'
import React, { Suspense } from 'react'

const LoadingFallback = () => (
  <div className="w-full min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
      <p className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-medium">
        Loading learning setup...
      </p>
    </div>
  </div>
)

const page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LearningMain />
    </Suspense>
  )
}

export default page

