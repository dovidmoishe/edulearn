"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useUserStore from '@/../core/userState'
import { RewardsService } from '@/../services/rewards.service'
import { format } from 'date-fns'

interface Reward {
  id: string;
  type: 'certificate' | 'points';
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
  ipfs?: string;
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

interface NFTsComponentProps {
  className?: string;
}

export default function NFTsComponent({ className = "" }: NFTsComponentProps) {
  const [activeTab, setActiveTab] = useState<"claimed" | "unclaimed" | "locked">("claimed");
  const [allRewards, setAllRewards] = useState<Reward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<UserRewardWithDetails[]>([]);
  const [unclaimedRewards, setUnclaimedRewards] = useState<UserRewardWithDetails[]>([]);
  const [lockedRewards, setLockedRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<UserRewardWithDetails | null>(null);
  const [claimedReward, setClaimedReward] = useState<UserRewardWithDetails | null>(null);

  const { user } = useUserStore();
  const rewardService = new RewardsService();

  useEffect(() => {
    const loadAllRewards = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const rewards = await rewardService.getAllRewards();
        const userRewards = await rewardService.getUserRewards(user.id as unknown as string);

        setAllRewards(rewards);

        const claimed = userRewards.filter((reward) => reward.signature);
        const unclaimed = userRewards.filter((reward) => !reward.signature);

        setClaimedRewards(claimed);
        setUnclaimedRewards(unclaimed);

        const userRewardIds = new Set(userRewards.map((reward) => reward.id));
        const locked = rewards.filter((reward) => !userRewardIds.has(reward.id));
        setLockedRewards(locked);
      } catch (error) {
        console.error("Failed to load rewards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllRewards();
  }, [user?.id]);

  const openClaimModal = (reward: UserRewardWithDetails) => {
    setSelectedReward(reward);
    setShowClaimModal(true);
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedReward(null);
  };

  const handleClaimReward = async () => {
    if (!user?.id || !selectedReward) return;

    try {
      setClaimingId(selectedReward.id);
      setIsLoading(true);
      setError(null);

      await rewardService.claimReward(user.id as unknown as string, selectedReward.id);

      const userRewards = await rewardService.getUserRewards(user.id as unknown as string);
      const claimed = userRewards.filter((reward) => reward.signature);
      const unclaimed = userRewards.filter((reward) => !reward.signature);

      setClaimedRewards(claimed);
      setUnclaimedRewards(unclaimed);
      
      setClaimedReward(selectedReward);
      setShowClaimModal(false);
      setShowSuccessModal(true);

      if (unclaimed.length === 0) {
        setActiveTab("claimed");
      }
    } catch (error: unknown) {
      console.error("Failed to claim reward:", error);
      
      let errorMessage = "Failed to claim badge";
      
      if (error instanceof Error) {
        if (error.message.includes("insufficient funds for rent")) {
          errorMessage = "Your wallet doesn&apos;t have enough SOL to pay for transaction fees";
        } else if (error.message.includes("Transaction simulation failed")) {
          errorMessage = "Transaction failed. Please try again later";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setShowClaimModal(false);
    } finally {
      setIsLoading(false);
      setClaimingId(null);
    }
  };

  const handleShareToX = () => {
    if (!claimedReward || !user?.referralCode) return;
    
    const message = `I just claimed ${claimedReward.title} on EduLearn! Join me in building real skills with my referral code: ${user.referralCode} #EduLearn #SkillBuilding #ProofOfWork`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent('https://edulearn.fun')}`;
    
    window.open(url, '_blank');
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setClaimedReward(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Date unavailable";
    }
  };

  const getCurrentRewards = () => {
    switch (activeTab) {
      case "claimed":
        return claimedRewards;
      case "unclaimed":
        return unclaimedRewards;
      case "locked":
        return lockedRewards;
      default:
        return [];
    }
  };

  const currentRewards = getCurrentRewards();

  return (
    <div className={`bg-[#0D0D0D] min-h-screen ${className}`}>
      <div className="p-[20px]">
        <div className="flex items-center gap-[16px] mb-[20px] mt-[50px]">
          <button 
            onClick={() => window.history.back()}
            className="w-[40px] h-[40px] bg-[#131313] border border-[#2E3033] rounded-[12px] flex items-center justify-center hover:bg-[#2E3033] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[#FFFFFF] text-[20px] font-[500] leading-[24px]">Badges</h1>
        </div>

        <div className="mb-[20px] px-[10px]">
          <div className="flex justify-around w-full py-[24px]">
            {(["claimed", "unclaimed", "locked"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-center text-[16px] font-[500] leading-[24px] pb-[8px] transition-all ${
                  activeTab === tab
                    ? "text-[#FFFFFF] font-[700] border-b-2 border-[#FFFFFF]"
                    : "text-[#FFFFFF]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>    
        {isLoading && !claimingId ? (
          <div className="flex justify-center items-center py-[40px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
          </div>
        ) : currentRewards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px] pb-[20px]">
            {currentRewards.map((reward, index) => {
              const isClickable = activeTab === "claimed";
              
              if (isClickable) {
                return (
                  <Link
                    key={reward.id || index}
                    href={`/dashboard/nft/${reward.id}`}
                    className="bg-[#131313] border border-[#2E3033] rounded-[12px] p-[4px] hover:border-[#00FF80] transition-colors cursor-pointer max-w-[152px] h-[192px] flex flex-col"
                  >
                    <NFTCardContent reward={reward} activeTab={activeTab} formatDate={formatDate} openClaimModal={openClaimModal} isLoading={isLoading} claimingId={claimingId} />
                  </Link>
                );
              } else {
                return (
                  <div
                    key={reward.id || index}
                    className="bg-[#131313] border border-[#2E3033] rounded-[12px] p-[4px] hover:border-[#00FF80] transition-colors cursor-pointer max-w-[152px] h-[192px] flex flex-col"
                  >
                    <NFTCardContent reward={reward} activeTab={activeTab} formatDate={formatDate} openClaimModal={openClaimModal} isLoading={isLoading} claimingId={claimingId} />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-[40px]">
            <p className="text-[#E0E0E0] text-[16px] font-[500] mb-[8px] text-center">
              {activeTab === "claimed" && "You haven't claimed any badge yet."}
              {activeTab === "unclaimed" && "No unclaimed badges found."}
              {activeTab === "locked" && "No locked rewards found."}
            </p>
            {(activeTab === "claimed" || activeTab === "unclaimed") && (
              <p className="text-[#B3B3B3] text-[14px] font-[400] text-center">
                Complete quizzes and lessons to collect them!
              </p>
            )}
          </div>
        )}

         {showClaimModal && selectedReward && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-[#131313] rounded-[24px] p-[24px] max-w-[400px] mx-[20px] text-center">
               {selectedReward.imageUrl && (
                 <div className="w-[160px] h-[160px] mx-auto mb-[12px] relative rounded-[8px] overflow-hidden">
                   <Image
                     src={selectedReward.imageUrl}
                     alt={selectedReward.title || "Badge"}
                     fill
                     className="object-cover"
                   />
                 </div>
               )}
               
               <h3 className="text-[#E0E0E0] text-[20px] font-[700] leading-[36px] mb-[8px]">
                 Ready to Claim? 🎉
               </h3>
               
               <p className="text-[#FFFFFF] text-[16px] text-center mb-[16px]">
                 You&apos;re about to claim{" "}
                 <span className="text-[#E0E0E0] font-[700]">
                   {selectedReward.title}
                 </span>
                 , collectible badge for your achievement!
               </p>
               
               <div className="flex gap-[16px] mt-[16px] w-full">
                 <button
                   onClick={closeClaimModal}
                   className="bg-[#000] border border-[#00FF80] text-[#00FF80] py-[12px] px-[24px] rounded-[16px] flex-1 font-[700] text-[16px] hover:bg-[#00FF80] hover:text-[#000] transition-colors"
                 >
                   Cancel
                 </button>
                 
                 <button
                   onClick={handleClaimReward}
                   disabled={isLoading}
                   className="bg-[#00FF80] text-[#000] py-[12px] px-[24px] rounded-[16px] flex-1 font-[700] text-[16px] hover:bg-[#00CC66] transition-colors disabled:opacity-50"
                 >
                   {isLoading ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#000] mx-auto"></div>
                   ) : (
                     "Claim Now"
                   )}
                 </button>
               </div>
             </div>
           </div>
         )}

         {showSuccessModal && claimedReward && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-[#131313] rounded-[16px] p-[24px] max-w-[400px] mx-[20px] text-center">
               <div className="w-[64px] h-[64px] mx-auto mb-[16px]">
                 <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="32" cy="32" r="32" fill="#00FF80"/>
                   <path d="M20 32L28 40L44 24" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               
               <h3 className="text-[#E0E0E0] text-[18px] font-[700] text-center mb-[8px]">
                 Badge Claimed Successfully!
               </h3>
               
               <p className="text-[#FFFFFF] text-[14px] text-center mb-[16px]">
                 Your badge has been successfully transferred to your wallet.
               </p>
               
               <div className="flex gap-[16px]">
                 <button
                   onClick={closeSuccessModal}
                   className="bg-[#00FF80] text-[#000] py-[12px] px-[24px] rounded-[16px] flex-1 font-[500] text-[16px] hover:bg-[#00CC66] transition-colors"
                 >
                   Close
                 </button>
                 
                 <button
                   onClick={handleShareToX}
                   className="bg-[#131313] border border-[#2E3033] text-[#E0E0E0] py-[12px] px-[24px] rounded-[16px] flex-1 font-[500] text-[16px] hover:bg-[#2E3033] transition-colors"
                 >
                   Share on X
                 </button>
               </div>
             </div>
           </div>
         )}

         {error && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-[#131313] rounded-[16px] p-[24px] max-w-[400px] mx-[20px]">
               <h3 className="text-[#FF3B30] text-[18px] font-[700] text-center mb-[8px]">
                 Error Claiming Badge
               </h3>
               <p className="text-[#FFFFFF] text-[14px] text-center mb-[16px]">
                 {error}
               </p>
               <button
                 onClick={() => setError(null)}
                 className="bg-[#00FF80] text-[#000] py-[12px] px-[24px] rounded-[16px] w-full font-[500] text-[16px] hover:bg-[#00CC66] transition-colors"
               >
                 Try Again
               </button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}

interface NFTCardContentProps {
  reward: Reward | UserRewardWithDetails;
  activeTab: "claimed" | "unclaimed" | "locked";
  formatDate: (dateString: string) => string;
  openClaimModal: (reward: UserRewardWithDetails) => void;
  isLoading: boolean;
  claimingId: string | null;
}

function NFTCardContent({ reward, activeTab, formatDate, openClaimModal, isLoading, claimingId }: NFTCardContentProps) {
  return (
    <>
      <div className="relative w-full aspect-square bg-gray-300 rounded-[8px] overflow-hidden mb-[8px] flex-1">
        {activeTab === "locked" ? (
          <div className="relative w-full h-full">
            {reward.imageUrl ? (
              <Image
                src={reward.imageUrl}
                alt={reward.title || "Badge"}
                fill
                className="object-cover opacity-50"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#666] to-[#333] flex items-center justify-center opacity-50">
                <span className="text-[#FFF] font-bold text-lg">?</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ) : reward.imageUrl ? (
          <Image
            src={reward.imageUrl}
            alt={reward.title || "Badge"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#00FF80] to-[#00CC66] flex items-center justify-center">
            <span className="text-[#000] font-bold text-lg">?</span>
          </div>
        )}
      </div>

      {activeTab === "claimed" && 'earnedAt' in reward && reward.earnedAt && (
        <div className="flex items-center gap-[4px] px-[4px]">
          <div className="w-[14px] h-[14px] opacity-60">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#E0E0E0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[#E0E0E0] text-[12px] font-[400] leading-[16px]">
            {formatDate('earnedAt' in reward ? reward.earnedAt : '')}
          </p>
        </div>
      )}

      {activeTab === "unclaimed" && (
        <button
          onClick={(e) => {
            e.preventDefault();
            if ('earnedAt' in reward) {
              openClaimModal(reward);
            }
          }}
          disabled={isLoading && claimingId === reward.id}
          className="bg-[#00FF80] text-[#000] py-[10px] px-[16px] rounded-[8px] h-[40px] flex items-center justify-center gap-[12px] w-full font-[500] text-[14px] leading-[24px] hover:bg-[#00CC66] transition-colors disabled:opacity-50"
        >
          {isLoading && claimingId === reward.id ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#000]"></div>
          ) : (
            "Claim"
          )}
        </button>
      )}

      {activeTab === "locked" && reward.title && (
        <div className="px-[4px]">
          <p className="text-[#E0E0E0] text-[12px] font-[500] leading-[16px] truncate">
            {reward.title}
          </p>
        </div>
      )}
    </>
  );
}
