"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useUserStore from "@/../core/userState";
import { RewardsService } from "@/../services/rewards.service";

interface Reward {
  id: string;
  type: 'certificate' | 'points';
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
  ipfs?: string;
}
import { format } from "date-fns";

interface UserRewardWithDetails {
  id: string;
  type: "certificate" | "points";
  title: string;
  description: string;
  imageUrl?: string;
  earnedAt: string;
  signature?: string;
}

export default function NFTDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [reward, setReward] = useState<Reward | null>(null);
  const [userReward, setUserReward] = useState<UserRewardWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useUserStore();
  const rewardService = new RewardsService();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const rewardData = await rewardService.getRewardById(id);
        setReward(rewardData);

        if (user?.id) {
          const userRewards = await rewardService.getUserRewards(user.id as unknown as string);
          const userSpecificReward = userRewards.find((r: UserRewardWithDetails) => r.id === id);
          if (userSpecificReward) {
            setUserReward(userSpecificReward);
          }
        }
      } catch (error) {
        console.error("Error fetching reward:", error);
        setError("Failed to load NFT details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date unavailable";
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handleViewOnExplorer = () => {
    if (userReward?.signature) {
      const explorerUrl = `https://solscan.io/tx/${userReward.signature}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF80]"></div>
          <p className="text-[#B3B3B3] text-[16px] font-[500]">Loading NFT details...</p>
        </div>
      </div>
    );
  }

  if (error || !reward) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-[20px]">
        <div className="flex items-center gap-[16px] mb-[20px] mt-[20px]">
          <Link href="/dashboard/nfts">
            <button className="w-[40px] h-[40px] bg-[#131313] border border-[#2E3033] rounded-[12px] flex items-center justify-center hover:bg-[#2E3033] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
          <h1 className="text-[#FFFFFF] text-[20px] font-[500] leading-[24px]">NFT Details</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center py-[60px]">
          <div className="w-16 h-16 bg-[#FF3B30] rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[#E0E0E0] text-[18px] font-[500] mb-2 text-center">NFT Not Found</p>
          <p className="text-[#B3B3B3] text-[14px] font-[400] text-center">The NFT you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/dashboard/nfts">
            <button className="mt-6 bg-[#00FF80] text-[#000] px-[24px] py-[12px] rounded-[12px] font-[500] text-[14px] hover:bg-[#00CC66] transition-colors">
              Back to NFTs
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-[20px]">
      <div className="flex items-center gap-[16px] mb-[20px] mt-[20px]">
        <Link href="/dashboard/nfts">
          <button className="w-[40px] h-[40px] bg-[#131313] border border-[#2E3033] rounded-[12px] flex items-center justify-center hover:bg-[#2E3033] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Link>
        <h1 className="text-[#FFFFFF] text-[20px] font-[500] leading-[24px]">NFT Details</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-[40px] px-[20px]">
        <div className="bg-[#131313] border border-[#2E3033] rounded-[24px] p-[32px] max-w-[500px] w-full">
          <div className="relative w-full aspect-square bg-gray-300 rounded-[16px] overflow-hidden mb-[24px] max-w-[300px] mx-auto">
            {reward.imageUrl ? (
              <Image
                src={reward.imageUrl}
                alt={reward.title || "NFT"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00FF80] to-[#00CC66] flex items-center justify-center">
                <span className="text-[#000] font-bold text-4xl">?</span>
              </div>
            )}
          </div>

          <div className="text-center mb-[24px]">
            <h2 className="text-[#E0E0E0] text-[24px] font-[700] leading-[32px] mb-[8px]">
              {reward.title}
            </h2>
            <p className="text-[#B3B3B3] text-[16px] font-[400] leading-[24px] mb-[16px]">
              {reward.description}
            </p>

            {userReward?.earnedAt && (
              <div className="flex items-center justify-center gap-[8px] mb-[16px]">
                <div className="w-[16px] h-[16px] opacity-60">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#E0E0E0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#B3B3B3] text-[14px] font-[500] leading-[20px]">
                  Received on: <span className="text-[#E0E0E0] font-[700]">{formatDate(userReward.earnedAt)}</span>
                </p>
              </div>
            )}

            <div className="flex justify-center mb-[24px]">
              {userReward ? (
                <div className="bg-[#00FF80] text-[#000] px-[16px] py-[8px] rounded-[8px] font-[500] text-[14px]">
                  ✓ Owned
                </div>
              ) : (
                <div className="bg-[#2E3033] text-[#B3B3B3] px-[16px] py-[8px] rounded-[8px] font-[500] text-[14px]">
                  Not Owned
                </div>
              )}
            </div>
          </div>

          <div className="space-y-[12px]">
            {userReward?.signature && (
              <button
                onClick={handleViewOnExplorer}
                className="w-full bg-[#00FF80] text-[#000] py-[12px] px-[24px] rounded-[12px] font-[500] text-[16px] hover:bg-[#00CC66] transition-colors flex items-center justify-center gap-[8px]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View on Explorer
              </button>
            )}
            
            <Link href="/dashboard/nfts">
              <button className="w-full bg-transparent border border-[#2E3033] text-[#E0E0E0] py-[12px] px-[24px] rounded-[12px] font-[500] text-[16px] hover:bg-[#2E3033] transition-colors">
                Back to Collection
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
