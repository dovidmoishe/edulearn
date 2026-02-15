"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useUserStore from "@/../core/userState";
import { RewardsService } from "@/../services/rewards.service";
import { WalletService } from "@/../services/wallet.service";

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
import level from "@/../public/assets/icons/levelHolder1.png";
import medal06 from "@/../public/assets/icons/medal06.png";
import { Progress } from "@/components/ui/progress";
import caretRight from "@/../public/assets/icons/dark/CaretRight.png";
import ActivityHistory from "@/components/ActivityHistory";
import usdc from "@/../public/solana.png";
import edln from "@/../public/mainlogo.png";
import sealCheck from "@/../public/assets/icons/dark/SealCheck.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const levels = ["novice", "beginner", "intermediate", "advanced", "expert"];

const milestones = {
  novice: 0,
  beginner: 500,
  intermediate: 1500,
  advanced: 3000,
  expert: 5000,
};

export default function RewardsPage() {
  const user = useUserStore((state) => state.user);
  const fetchWalletBalance = useUserStore((state) => state.fetchWalletBalance);
  const [rewards, setRewards] = useState<UserRewardWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userEarnings, setUserEarnings] = useState<{ sol: number; edln: number; hasEarnings: boolean }>({
    sol: 0,
    edln: 0,
    hasEarnings: false,
  });
  const [claimingEDLN, setClaimingEDLN] = useState(false);
  const [claimingSOL, setClaimingSOL] = useState(false);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [claimedAsset, setClaimedAsset] = useState<{type: 'edln' | 'USDC', amount: string} | null>(null);
  const [earningsCardUrl, setEarningsCardUrl] = useState<string | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);

  const rewardService = new RewardsService();
  const walletService = new WalletService();

  const currentXP = user?.xp || 0;

  const getMilestoneProgress = () => {
    if (currentXP >= milestones.expert) {
      return {
        progress: 100,
        xpNeeded: 0,
        currentLevel: milestones.expert,
        nextLevel: milestones.expert,
      };
    } else if (currentXP >= milestones.advanced) {
      return {
        progress:
          ((currentXP - milestones.advanced) /
            (milestones.expert - milestones.advanced)) *
          100,
        xpNeeded: milestones.expert - currentXP,
        currentLevel: milestones.advanced,
        nextLevel: milestones.expert,
      };
    } else if (currentXP >= milestones.intermediate) {
      return {
        progress:
          ((currentXP - milestones.intermediate) /
            (milestones.advanced - milestones.intermediate)) *
          100,
        xpNeeded: milestones.advanced - currentXP,
        currentLevel: milestones.intermediate,
        nextLevel: milestones.advanced,
      };
    } else if (currentXP >= milestones.beginner) {
      return {
        progress:
          ((currentXP - milestones.beginner) /
            (milestones.intermediate - milestones.beginner)) *
          100,
        xpNeeded: milestones.intermediate - currentXP,
        currentLevel: milestones.beginner,
        nextLevel: milestones.intermediate,
      };
    } else {
      return {
        progress: (currentXP / milestones.beginner) * 100,
        xpNeeded: milestones.beginner - currentXP,
        currentLevel: milestones.novice,
        nextLevel: milestones.beginner,
      };
    }
  };

  const { progress, xpNeeded } = getMilestoneProgress();

  const handleClaimEDLN = async () => {
    if (!user?.id) return;

    try {
      setClaimingEDLN(true);
      const result = await walletService.claimEarnings(user.id, "edln");

      if (result.success) {
        setClaimedAsset({
          type: 'edln',
          amount: String(userEarnings.edln) 
        });
        setSuccessModalVisible(true);
        
        fetchWalletBalance();
      } else {
        alert("Failed to claim: " + result.message);
      }
    } catch (error: unknown) {
      alert("Error: " + (error instanceof Error ? error.message : "Failed to claim EDLN tokens"));
    } finally {
      setClaimingEDLN(false);
      try {
        const earnings = await walletService.getUserEarnings(user.id);
        setUserEarnings(earnings);
      } catch (e) {
        console.error("Failed to refresh earnings:", e);
      }
    }
  };

  const handleClaimSOL = async () => {
    if (!user?.id) return;

    try {
      setClaimingSOL(true);
      const result = await walletService.claimEarnings(user.id, "sol");

      if (result.success) {
        setClaimedAsset({
          type: 'USDC',
          amount: String(userEarnings.sol)
        });
        setSuccessModalVisible(true);
        
        try {
          setLoadingCard(true);
          const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const cardUrl = `${API_URL}cards/earnings/${user.id}?theme=dark&t=${Date.now()}`;
          setEarningsCardUrl(cardUrl);
        } catch (cardError) {
          console.error("Failed to generate earnings card:", cardError);
        } finally {
          setLoadingCard(false);
        }
        
        fetchWalletBalance();
      } else {
        alert("Failed to claim: " + result.message);
      }
    } catch (error: unknown) {
      alert("Error: " + (error instanceof Error ? error.message : "Failed to claim USDC"));
    } finally {
      setClaimingSOL(false);
      try {
        const earnings = await walletService.getUserEarnings(user.id);
        setUserEarnings(earnings);
      } catch (e) {
        console.error("Failed to refresh earnings:", e);
      }
    }
  };

  const handleShare = async () => {
    if (!claimedAsset || !user?.referralCode) return;
    
    setSuccessModalVisible(false);
    setShareModalVisible(true);
  };

  const handleShareToX = async () => {
    if (!claimedAsset || !user?.referralCode) return;
    
    try {
      const message = `I just claimed ${claimedAsset.amount} $${claimedAsset.type.toUpperCase()} tokens on EduLearn! 🎉\n\nStart learning and earning with my referral code: ${user.referralCode}\n\n👉 edulearn.fun`;
      
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
      window.open(twitterUrl, '_blank');
      setShareModalVisible(false);
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share");
    }
  };

  const handleDownloadCard = async () => {
    if (!earningsCardUrl) return;
    
    try {
      const response = await fetch(earningsCardUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edulearn-earnings-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading card:", error);
      alert("Failed to download card");
    }
  };

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const userRewards = await rewardService.getUserRewards(
          user.id as unknown as string
        );
        setRewards(userRewards);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEarnings = async () => {
      if (!user?.id) return;

      try {
        setLoadingEarnings(true);
        const earnings = await walletService.getUserEarnings(user.id);
        setUserEarnings(earnings);
      } catch (error) {
        console.error("Error fetching user earnings:", error);
      } finally {
        setLoadingEarnings(false);
      }
    };

    if (user?.id) {
      fetchRewards();
      fetchEarnings();
    }
  }, [user?.id]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between items-center gap-[16px] px-[24px] py-[20px] rounded-[24px] bg-[#00FF80]">
        <div className="flex flex-col md:flex-row items-center gap-[16px]">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={level}
                alt="level"
                width={90}
                height={98}
                className="md:w-[90px] md:h-[98px] w-[58px] h-[63px]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[#000] md:text-[52px] text-[34px] font-[900] md:leading-[41px] leading-[28px]">
                  {levels.indexOf(user?.level?.toLowerCase() || "novice") + 1}
                </p>
              </div>
            </div>
            <p className="text-[#000] text-center text-[14px] md:text-[16px] font-[500] md:font-[700] leading-[24px] mt-[5px] md:mt-0">
              {user?.level}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[16px] md:gap-[28px] items-center md:items-start w-full md:w-auto">
          <div className="flex items-center gap-[8px]">
            <Image src={medal06} alt="medal" width={24} height={24} />
            <p className="text-[#000] text-[28px] font-700 leading-[30px]">
              {currentXP} XP
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Progress
              value={progress}
              className="h-[10px] md:h-2 rounded-[5px]"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            />
            <p className="text-[#000] text-[14px] md:text-[16px] leading-[24px] font-[400] mt-[16px]">
              {xpNeeded > 0
                ? `Great work! You're just ${xpNeeded} XP away from the next badge 🔥`
                : "Congratulations! You've reached the highest level! 🏆"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[16px] flex flex-col items-start p-[16px] gap-[24px] rounded-[24px] bg-[#131313] border border-[#2E3033]">
        <div className="py-[16px] flex items-center justify-between w-full">
          <p className="text-[#E0E0E0] leading-[30px] font-[500] text-[20px]">
            Your Badges
          </p>
          <Link href="/dashboard/nfts">
            <button className="flex items-center gap-[4px] bg-none border border-[#2E3033] rounded-[12px] px-[16px] py-[8px] hover:bg-[#2E3033] transition-colors">
              <p className="text-[#E0E0E0] leading-[24px] font-[500] text-[14px]">
                See All
              </p>
              <Image src={caretRight} alt="caretRight" width={24} height={24} />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-[40px] w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
          </div>
        ) : rewards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] w-full">
            {rewards.slice(0, 4).map((reward, index) => (
              <Link
                key={reward.id || index}
                href={`/dashboard/nft/${reward.id}`}
                className="flex flex-col bg-[#1A1A1A] border border-[#2E3033] rounded-[8px] p-[4px] hover:border-[#00FF80] transition-colors cursor-pointer"
              >
                <div className="relative w-full aspect-square bg-gray-300 rounded-[8px] overflow-hidden mb-[8px]">
                  {reward.imageUrl ? (
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
                {reward.earnedAt && (
                  <div className="flex items-center gap-[4px] px-[4px]">
                    <div className="w-[14px] h-[14px] opacity-60">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="#E0E0E0"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-[#E0E0E0] text-[12px] font-[400] leading-[16px]">
                      {new Date(reward.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-[40px] px-[20px] bg-[#0F0F0F] rounded-[12px] w-full">
            <p className="text-[#E0E0E0] text-[16px] font-[500] mb-[8px] text-center">
              You haven&apos;t earned any badges yet.
            </p>
            <p className="text-[#B3B3B3] text-[14px] font-[400] text-center">
              Complete quizzes and lessons to collect them!
            </p>
          </div>
        )}
      </div>

      <div className="mt-[16px] flex flex-col items-start p-[16px] gap-[24px] rounded-[24px] bg-[#131313] border border-[#2E3033]">
        <div className="flex flex-col gap-[8px] w-full">
          <p className="text-[#E0E0E0] leading-[30px] font-[500] text-[20px]">
            Active Earnings
          </p>
          <p className="text-[#B3B3B3] text-[14px] font-[400] leading-[24px]">
            Track your active token earnings and rewards
          </p>
        </div>

        {loadingEarnings ? (
          <div className="flex justify-center items-center py-[40px] w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
          </div>
        ) : userEarnings.hasEarnings ? (
          <div className="flex flex-col gap-[16px] w-full">
            <div className="flex items-center justify-between p-[16px] bg-[#1A1A1A] border border-[#2E3033] rounded-[16px]">
              <div className="flex items-center gap-[12px]">
                <Image
                  src={edln}
                  alt="EDLN"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-[#E0E0E0] text-[14px] font-[500] leading-[20px]">
                    EDLN Balance
                  </p>
                  <p className="text-[#E0E0E0] text-[18px] font-[700] leading-[24px]">
                    {String(userEarnings.edln)} EDLN
                  </p>
                </div>
              </div>
              <button
                onClick={handleClaimEDLN}
                disabled={claimingEDLN || userEarnings.edln <= 0}
                className="bg-[#00FF80] text-[#000] px-[16px] py-[8px] rounded-[8px] font-[500] text-[14px] hover:bg-[#00CC66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
              >
                {claimingEDLN ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#000]"></div>
                ) : (
                  "Claim"
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-[16px] bg-[#1A1A1A] border border-[#2E3033] rounded-[16px]">
              <div className="flex items-center gap-[12px]">
                <Image
                  src={usdc}
                  alt="USDC"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-[#E0E0E0] text-[14px] font-[500] leading-[20px]">
                    USDC Balance
                  </p>
                  <p className="text-[#E0E0E0] text-[18px] font-[700] leading-[24px]">
                    {String(userEarnings.sol)} USDC
                  </p>
                </div>
              </div>
              <button
                onClick={handleClaimSOL}
                disabled={claimingSOL || userEarnings.sol <= 0}
                className="bg-[#00FF80] text-[#000] px-[16px] py-[8px] rounded-[8px] font-[500] text-[14px] hover:bg-[#00CC66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
              >
                {claimingSOL ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#000]"></div>
                ) : (
                  "Claim"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-[40px] px-[20px] bg-[#0F0F0F] rounded-[12px] w-full">
            <p className="text-[#E0E0E0] text-[16px] font-[500] mb-[8px] text-center">
              No active earnings available.
            </p>
            <p className="text-[#B3B3B3] text-[14px] font-[400] text-center">
              Complete tasks and maintain streaks to earn rewards!
            </p>
          </div>
        )}
      </div>

      <div className="mt-[16px]">
        <ActivityHistory />
      </div>

      

      <Dialog open={successModalVisible} onOpenChange={setSuccessModalVisible}>
        <DialogContent className="bg-[#131313] border-[#2E3033] max-w-md flex items-center flex-col">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src={sealCheck} 
                alt="Success" 
                width={64} 
                height={64}
              />
            </div>
            <DialogTitle className="text-[#E0E0E0] text-[18px] font-[700] mb-2 text-center">
              Asset Claimed Successfully!
            </DialogTitle>
            <DialogDescription className="text-[#B3B3B3] text-[14px] font-[400] leading-[20px] text-center">
              Your tokens have been successfully transferred to your wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-[16px] mt-6">
            <button
              onClick={() => setSuccessModalVisible(false)}
              className="bg-transparent text-[#00FF80] px-[16px] py-[12px] rounded-[8px] font-[500] text-[14px] border border-[#00FF80] transition-colors"
            >
              Close
            </button>
            
            <button
              onClick={handleShare}
              className="bg-[#00FF80] text-[#000] px-[16px] py-[12px] rounded-[8px] font-[500] text-[14px] hover:bg-[#00CC66] transition-colors"
            >
              Share on X
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shareModalVisible} onOpenChange={setShareModalVisible}>
        <DialogContent className="bg-[#131313] border-[#2E3033] max-w-lg flex items-center flex-col">
          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-[#E0E0E0] text-[18px] font-[700] mb-2 text-center">
              Share Your Earnings
            </DialogTitle>
            <DialogDescription className="text-[#B3B3B3] text-[14px] font-[400] leading-[20px] text-center">
              Share your achievement with your friends on X!
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full mt-4">
            {loadingCard ? (
              <div className="flex justify-center items-center py-[60px] w-full bg-[#1A1A1A] rounded-[12px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
              </div>
            ) : earningsCardUrl ? (
              <div className="relative w-full aspect-[1.91/1] bg-[#1A1A1A] rounded-[12px] overflow-hidden">
                <img
                  src={earningsCardUrl}
                  alt="Earnings Card"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center py-[60px] w-full bg-[#1A1A1A] rounded-[12px]">
                <p className="text-[#B3B3B3] text-[14px]">Failed to load earnings card</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-[12px] mt-6 w-full">
            <button
              onClick={() => setShareModalVisible(false)}
              className="flex-1 bg-transparent text-[#E0E0E0] px-[16px] py-[12px] rounded-[8px] font-[500] text-[14px] border border-[#2E3033] hover:bg-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleDownloadCard}
              disabled={!earningsCardUrl}
              className="flex-1 bg-transparent text-[#00FF80] px-[16px] py-[12px] rounded-[8px] font-[500] text-[14px] border border-[#00FF80] hover:bg-[#00FF80] hover:text-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
            
            <button
              onClick={handleShareToX}
              className="flex-1 bg-[#00FF80] text-[#000] px-[16px] py-[12px] rounded-[8px] font-[500] text-[14px] hover:bg-[#00CC66] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
