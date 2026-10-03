"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import UsdcIcon from '@/../public/solana.png'
import useUserStore from '@/../core/userState'
import { RewardsService } from '@/../services/rewards.service'
import NavBar from '@/../components/Home/NavBar/NavBar'

interface Job {
  id: number;
  title: string;
  description: string;
  nft: string;
  pay: string;
  rewardId: string;
  applicationLink: string;
}

interface UserRewardWithDetails {
  id: string;
  type: "certificate" | "points";
  title: string;
  description: string;
  imageUrl?: string;
  earnedAt: string;
  signature?: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "NoizLabs Ambassador",
    description: "Build hype for NoizLabs and help them grow their community. Create content, engage the community, and spread the word about audio meme tokens.",
    nft: "https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/nfts/photo_2025-11-09_03-01-24.jpg",
    pay: "50",
    rewardId: "7838fd39-2003-4759-b567-40f04ce3b835",
    applicationLink: "https://docs.google.com/forms/d/e/1FAIpQLSfXsXZOv7JF-05xuesK-Ntp834EHj97Z5yD3A4L-g_OmSsdHw/viewform?usp=header"
  },
 
]

const DiscoverPage = () => {
  const user = useUserStore((state) => state.user);
  const [userRewards, setUserRewards] = useState<UserRewardWithDetails[]>([]);
  const [isLoadingRewards, setIsLoadingRewards] = useState(true);
  const rewardService = new RewardsService();

  useEffect(() => {
    const fetchUserRewards = async () => {
      if (!user?.id) {
        setIsLoadingRewards(false);
        return;
      }

      try {
        setIsLoadingRewards(true);
        const rewards = await rewardService.getUserRewards(user.id as unknown as string);
        setUserRewards(rewards);
      } catch (error) {
        console.error("Error fetching user rewards:", error);
      } finally {
        setIsLoadingRewards(false);
      }
    };

    fetchUserRewards();
  }, [user?.id]);

  const checkEligibility = (rewardId: string) => {
    const hasReward = userRewards.some((reward) => reward.id === rewardId);
    const isClaimed = userRewards.find((reward) => reward.id === rewardId)?.signature;
    
    return hasReward && !!isClaimed;
  };

  const handleApply = (job: Job) => {
    const isEligible = checkEligibility(job.rewardId);
    
    if (isEligible) {
      window.open(job.applicationLink, '_blank');
    }
  };

  if (isLoadingRewards) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF80]"></div>
          <p className="text-[#B3B3B3] text-[16px] font-[500]">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <NavBar />
      
      <div className="px-[20px] md:px-[40px] py-[40px] md:py-[60px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-[48px] text-center">
            <h1 className="text-[#E0E0E0] text-[36px] md:text-[48px] font-[700] leading-[44px] md:leading-[56px] mb-[16px]">
              Discover Opportunities
            </h1>
            <p className="text-[#B3B3B3] text-[16px] md:text-[18px] font-[400] leading-[24px] max-w-[600px] mx-auto">
              Use your verifiable proof-of-work achievements to unlock
              exclusive opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[24px]">
            {jobs.map((job) => {
              const isEligible = checkEligibility(job.rewardId);
              
              return (
                <div 
                  key={job.id} 
                  className="bg-[#131313] border border-[#2E3033] rounded-[24px] p-[20px] hover:border-[#00FF80] transition-all duration-300 flex gap-[16px]"
                >
                  <div className="relative w-[140px] h-[200px] rounded-[12px] overflow-hidden flex-shrink-0">
                    <Image 
                      src={job.nft} 
                      alt={job.title} 
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-[8px] bg-[#1A1A1A] border border-[#2E3033] rounded-[8px] px-[10px] py-[4px] w-fit mb-[12px]">
                      <Image src={UsdcIcon} alt="USDC" width={16} height={16} />
                      <p className="text-[#00FF80] text-[13px] font-[700] leading-[18px]">
                        ${job.pay} USDC
                      </p>
                    </div>

                    <h2 className="text-[#E0E0E0] text-[18px] font-[700] leading-[24px] mb-[10px]">
                      {job.title}
                    </h2>
                    
                    <p className="text-[#B3B3B3] text-[13px] font-[400] leading-[20px] mb-[16px] flex-1">
                      {job.description}
                    </p>

                    <button
                      onClick={() => handleApply(job)}
                      disabled={!isEligible}
                      className={`w-full px-[20px] py-[10px] rounded-[12px] font-[600] text-[14px] transition-all duration-300 ${
                        isEligible
                          ? 'bg-[#00FF80] text-[#000] hover:bg-[#00CC66] cursor-pointer'
                          : 'bg-[#2E3033] text-[#666666] cursor-not-allowed opacity-50'
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-[80px] px-[20px]">
              <p className="text-[#E0E0E0] text-[18px] font-[500] mb-[8px] text-center">
                No jobs available yet
              </p>
              <p className="text-[#B3B3B3] text-[14px] font-[400] text-center">
                Keep learning and building proof-of-work. New opportunities are
                coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscoverPage
