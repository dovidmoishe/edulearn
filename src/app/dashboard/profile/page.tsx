"use client";
import React, { useState, useEffect } from "react";
import levelHolder from "@/../public/assets/icons/levelHolder1.png";
import Image from "next/image";
import useUserStore from "@/../core/userState";
import avatar from "@/../public/assets/icons/avatar2.png";
import badge from "@/../public/assets/icons/medal05.png";
import wallet from "@/../public/assets/icons/dark/wallet.png";
import copy from "@/../public/assets/icons/dark/copy.png";
import nft from "@/../public/assets/icons/dark/nft.png";
import brain from "@/../public/assets/icons/brain02.png";
import fire from "@/../public/assets/icons/fire.png";
import { WalletService } from "@/../services/wallet.service";
import { UserService } from "@/../services/user.service";
import { TwitterService } from "@/../services/twitter.service";
import congrats from "@/../public/assets/icons/congrats.png";
import walletIcon from "@/../public/assets/icons/wallet.png";
import roadmapIcon from "@/../public/assets/icons/roadmap.png"
import useActivityStore from "@/../core/activityState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import userIcon from "@/../public/assets/icons/user.png";
import warningIcon from "@/../public/assets/icons/warning.png";
import { FaXTwitter } from "react-icons/fa6";
import { RoadmapService } from "@/../services/roadmap.service";
import { Roadmap, RoadmapStep, RoadmapWithSteps } from "@/../interfaces/Roadmap";
import { useRouter } from "next/navigation";
import { getHighQualityImageUrl } from "@/../utils/imageHelper";
import { Trash2 } from "lucide-react";
import { createClient } from "../../../../utils/supabase/client";

const levels = ["novice", "beginner", "intermediate", "advanced", "expert"];

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const walletBalance = useUserStore((state) => state.walletBalance);
  const fetchWalletBalance = useUserStore((state) => state.fetchWalletBalance);
  const { activities, quizActivities, fetchActivities, fetchQuizActivities } = useActivityStore();
  const [isBuyModalVisible, setBuyModalVisible] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccessModalVisible, setBuySuccessModalVisible] = useState(false);
  const [transactionLink, setTransactionLink] = useState<string>("");
  const [isBuying, setIsBuying] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [burnSuccessModalVisible, setBurnSuccessModalVisible] = useState(false);

  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    learning: user?.learning || ""
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [exportWalletModalVisible, setExportWalletModalVisible] = useState(false);
  const [confirmExportModalVisible, setConfirmExportModalVisible] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isExportingWallet, setIsExportingWallet] = useState(false);
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapWithSteps | null>(null);
  const [roadmapModalVisible, setRoadmapModalVisible] = useState(false);
  const [isLoadingRoadmapDetails, setIsLoadingRoadmapDetails] = useState(false);
  const [isStartingStep, setIsStartingStep] = useState<string | null>(null);

  const walletService = new WalletService();
  const userService = new UserService();
  const twitterService = new TwitterService();
  const roadmapService = new RoadmapService();
  const router = useRouter();

  const getActiveDays = (streak: number) => {
    const todayIndex = new Date().getDay();
    const active = [];

    for (let i = 0; i < Math.min(streak, 7); i++) {
      const index = (todayIndex - i + 7) % 7;
      active.push(index);
    }

    return active;
  };

  useEffect(() => {
    if (user?.id) {
      fetchWalletBalance();
      fetchActivities(user.id);
      fetchQuizActivities(user.id);
      fetchRoadmaps();
    }
  }, [user?.id, fetchWalletBalance, fetchActivities, fetchQuizActivities]);

  const fetchRoadmaps = async () => {
    if (!user?.id) return;
    
    setIsLoadingRoadmaps(true);
    try {
      const userRoadmaps = await roadmapService.getUserRoadmaps(user.id);
      setRoadmaps(userRoadmaps);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
    } finally {
      setIsLoadingRoadmaps(false);
    }
  };

  const handleViewRoadmap = async (roadmapId: string) => {
    setIsLoadingRoadmapDetails(true);
    setRoadmapModalVisible(true);
    setSelectedRoadmap(null);
    try {
      const roadmapData = await roadmapService.getRoadmapById(roadmapId);
      console.log('Fetched roadmap data:', roadmapData);
      setSelectedRoadmap(roadmapData);
    } catch (error) {
      console.error("Failed to fetch roadmap details:", error);
      alert("Failed to load roadmap details");
      setRoadmapModalVisible(false);
    } finally {
      setIsLoadingRoadmapDetails(false);
    }
  };

  const handleStartStep = async (stepId: string, chatId: string) => {
    if (!user?.id) return;
    
    setIsStartingStep(stepId);
    try {
      await roadmapService.startRoadmapStep(stepId, { userId: user.id });
      
      if (selectedRoadmap) {
        setSelectedRoadmap({
          ...selectedRoadmap,
          steps: selectedRoadmap.steps.map(step => 
            step.id === stepId ? { ...step, done: true } : step
          )
        });
      }
      
      router.push(`/dashboard/chat/${chatId}`);
    } catch (error) {
      console.error("Failed to start step:", error);
      alert("Failed to start step. Please try again.");
    } finally {
      setIsStartingStep(null);
    }
  };

  const toggleBuyModal = () => {
    setBuyModalVisible(!isBuyModalVisible);
    if (!isBuyModalVisible) {
      setBuyAmount("");
      setBuyError(null);
    }
  };

  const handleBuyEDLN = async () => {
    try {
      setIsBuying(true);
      setBuyError(null);
      const amount = parseFloat(buyAmount);
      if (isNaN(amount) || amount <= 0) {
        setBuyError("Please enter a valid amount");
        setIsBuying(false);
        return;
      }

      if (amount > (walletBalance?.sol || 0)) {
        setBuyError("Insufficient SOL balance");
        setIsBuying(false);
        return;
      }

      const result = await walletService.swapSolToEDLN(user?.id || "", amount);
      console.log(`Successfully bought EDLN with ${amount} SOL`);
      
      setTransactionLink(result.response || "");
      
      await fetchWalletBalance(); 
      
      setIsBuying(false);
      toggleBuyModal();
      
      setBuySuccessModalVisible(true);
    } catch (error: unknown) {
      setBuyError(error instanceof Error ? error.message : "Failed to complete purchase");
      setIsBuying(false);
    }
  };

  const handleBurnTokens = async () => {
    try {
      setIsBurning(true);
      try {
        const response = await walletService.burnEDLN(user?.id || "", 1000);
        if(response.signature) {
          await userService.incrementCredits(user?.id as unknown as string, 3)
          setBurnSuccessModalVisible(true);
        } else {
          alert("Unable to burn EDLN tokens. Buy more or Please try again later.");
        }
      } catch (error) {
        console.error("Error burning EDLN tokens", error);
        alert("Failed to burn EDLN tokens. Buy more or Please try again later.");

      }

      await fetchWalletBalance();
      setIsBurning(false);
    } catch (error: unknown) {
      console.error("Error burning tokens:", error);
      setIsBurning(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleEditProfile = () => {
    setEditFormData({
      name: user?.name || "",
      username: user?.username || "",
      learning: user?.learning || ""
    });
    setEditProfileModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    if (!editFormData.name.trim() || !editFormData.username.trim()) {
      alert("Name and username cannot be empty");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const updatedUser = await userService.editUser({
        name: editFormData.name,
        email: user?.email as string,
        username: editFormData.username,
        learning: editFormData.learning
      });
      
      if (user) {
        setUser({
          ...user,
          name: updatedUser.name,
          username: updatedUser.username,
          learning: updatedUser.learning
        });
      }

      alert("Profile updated successfully!");
      setEditProfileModalVisible(false);

    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error instanceof Error ? error.message : "Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleExportWallet = () => {
    setConfirmExportModalVisible(true);
  };

  const confirmExportWallet = async () => {
    if (!user?.id) {
      alert("User information not available");
      return;
    }
    setConfirmExportModalVisible(false);
    setIsExportingWallet(true);
    
    try {
      const response = await walletService.decryptPrivateKey(user.id);
      if (response.success) {
        setPrivateKey(response.privateKey || null);
        setExportWalletModalVisible(true);
      } else {
        alert(response.error || "Failed to export private key");
      }
    } catch (error) {
      console.error("Error exporting private key:", error);
      alert("Failed to export private key. Please try again later.");
    } finally {
      setIsExportingWallet(false);
    }
  };

  const handleConnectTwitter = async () => {
    if (isConnectingTwitter) return;
    
    try {
      setIsConnectingTwitter(true);
      await twitterService.initiateAuth();
    } catch (error) {
      console.error("Error connecting Twitter:", error);
      alert("Failed to connect to X. Please try again.");
      setIsConnectingTwitter(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const supabase = createClient();
      await userService.deleteUser(user?.id as unknown as string, (await supabase.auth.getUser()).data.user?.id as string);
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="pb-[32px]">
      <div className="bg-[#00FF80] rounded-[24px] py-[20px] px-[24px]">
        <div className="flex flex-col gap-[12px] md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[14px]">
              <Image
                src={getHighQualityImageUrl(user?.profilePictureURL) || avatar}
                className="rounded-[27px] object-cover"
                alt="user image"
                height={42}
                width={42}
              />
              <div className="flex-1">
                <p className="text-[#000] text-[16px] font-[500] leading-[22px] truncate">
                  {user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-[8px]">
              <div className="relative">
                <Image
                  src={levelHolder}
                  alt="level holder"
                  height={24}
                  width={24}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#000] font-[700] text-[14px]">
                    {levels.indexOf(user?.level?.toLowerCase() || "novice") + 1}
                  </p>
                </div>
              </div>
              <p className="text-[#000] text-[12px] font-[500]">{user?.level}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-[3px]">
              <Image src={badge} alt="badge" height={24} width={24} />
              <p className="text-[#000] text-[14px] font-[500] leading-[22px]">
                {user?.xp} XP
              </p>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[12px]">
            <div className="flex items-center justify-between mb-[12px]">
              <div className="flex items-center gap-[8px] flex-1">
                <Image src={wallet} alt="wallet" height={24} width={24} />
                <p className="text-[#000] text-center text-[14px] font-[500] leading-[22px] truncate flex-1">
                  {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : ''}
                </p>
                <button
                  onClick={() => copyToClipboard(user?.address || "")}
                  className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
                >
                  <Image src={copy} alt="copy" height={16} width={16} />
                </button>
              </div>
            </div>
            
            <div className="text-center mb-[5px]">
              <p className="text-[#61728C] text-[12px] font-[400] leading-[16px]">Balance</p>
            </div>
            
            <div className="flex items-center justify-center gap-[10px]">
              <div className="flex flex-col items-center px-[15px]">
                <p className="text-[#000] text-[18px] font-[700] leading-[20px] mb-[2px]">
                  {walletBalance?.sol?.toFixed(4) || "0.0000"}
                </p>
                <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">SOL</p>
              </div>
              
              <button
                onClick={toggleBuyModal}
                className="w-[28px] h-[28px] rounded-full bg-[#00FF80] flex items-center justify-center hover:bg-[#00CC66] transition-colors flex-shrink-0"
              >
                <span className="text-[#000] text-[18px] font-[700] leading-[20px]">+</span>
              </button>
              
              <div className="flex flex-col items-center px-[15px]">
                <p className="text-[#000] text-[18px] font-[700] leading-[20px] mb-[2px]">
                  {walletBalance?.tokenAccount?.toFixed(2) || "0.00"}
                </p>
                <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">EDLN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-start gap-[14px]">
            <Image
              src={getHighQualityImageUrl(user?.profilePictureURL) || avatar}
              className="rounded-[27px] object-cover"
              alt="user image"
              height={95}
              width={95}
            />
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-[#000] text-[17px] font-[500] leading-[26px] text-center">
                {user?.name}
              </p>
              <div className="relative">
                <Image
                  src={levelHolder}
                  alt="level holder"
                  height={50}
                  width={45}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p
                    className="text-[#000] font-[900]"
                    style={{
                      fontSize: "26.966px",
                      lineHeight: "21.289px",
                    }}
                  >
                    {levels.indexOf(user?.level?.toLowerCase() || "novice") + 1}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[7px]">
              <Image src={badge} alt="badge" height={28} width={28} />
              <p className="text-[#000] text-[15px] font-[500] leading-[22px]">
                {user?.xp} XP
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[12px] bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[12px]">
            <div className="flex items-center gap-[8px]">
              <Image src={wallet} alt="wallet" height={28} width={28} />
              <p className="text-[#000] text-[14px] font-[500] leading-[22px]">
                {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : ''}
              </p>
              <button
                onClick={() => copyToClipboard(user?.address || "")}
                className="p-1 hover:bg-black/10 rounded transition-colors"
              >
                <Image src={copy} alt="copy" height={16} width={16} />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-[10px]">
              <div className="flex flex-col items-center">
                <p className="text-[#000] text-[16px] font-[700] leading-[20px]">
                  {walletBalance?.sol?.toFixed(4) || "0.0000"}
                </p>
                <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">SOL</p>
              </div>
              
              <button
                onClick={toggleBuyModal}
                className="w-[28px] h-[28px] rounded-full bg-[#00FF80] flex items-center justify-center hover:bg-[#00CC66] transition-colors"
              >
                <span className="text-[#000] text-[18px] font-[700] leading-[20px]">+</span>
              </button>
              
              <div className="flex flex-col items-center">
                <p className="text-[#000] text-[16px] font-[700] leading-[20px]">
                  {walletBalance?.tokenAccount?.toFixed(2) || "0.00"}
                </p>
                <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">EDLN</p>
              </div>
            </div>
          </div>
        </div>
      </div>  

      <div className="mt-[32px] grid grid-cols-2 md:grid-cols-4 gap-[16px]">
        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={badge} alt="XP icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Total XP</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">{user?.xp || 0} XP</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={nft} alt="NFT icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">NFTs Collected</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={brain} alt="Quiz icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Quizzes Completed</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">{quizActivities.length}</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={fire} alt="Streak icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Daily Check-in Streak</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex justify-between gap-1 mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
                const isActive = getActiveDays(user?.streak || 0).includes(index);
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isActive
                          ? "bg-[#00FF80] border-[#00FF80]"
                          : "bg-transparent border-[#2E2E2E]"
                      }`}
                    >
                      {isActive && (
                        <span className="text-[#000] text-[8px]">🔥</span>
                      )}
                    </div>
                    <p className="text-[#666] text-[8px] font-medium">{day}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="text-white text-sm font-medium">🔥 {user?.streak || 0}-Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[32px] bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E3033] dark:border-[#2E2E2E] rounded-[24px] p-[16px]">
        <div className="flex items-center flex-col md:flex-row md:justify-between gap-[24px]">
          <div className="flex items-center gap-[16px]">
            <Image
              src={congrats}
              alt="Invite friends"
              width={62}
              height={62}
            />
            <div className="flex flex-col gap-[4px] flex-1">
              <h3 className="text-[#E0E0E0] text-[16px] font-[500] leading-[22px]">
                Invite friends, earn rewards!
              </h3>
              <p className="text-[#B3B3B3] text-[14px] font-[400] leading-[18px] md:leading-[24px]">
                Share your referral code and earn XP when they join.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-[16px] bg-[#0D0D0D] dark:bg-[#0D0D0D] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-[16px] py-[8px] pl-[24px] pr-[12px]">
            <p className="text-[#E0E0E0] text-[16px] font-[500] leading-[24px]">
              {user?.referralCode}
            </p>
            <button
              onClick={() => copyToClipboard(user?.referralCode || "")}
              className="flex items-center gap-[8px] bg-[#131313] border border-[#2E3033] dark:border-[#2E2E2E] hover:bg-[#3E3E3E] rounded-[8px] px-[8px] py-[4px] transition-colors ml-auto"
            >
              <span className="text-[#B3B3B3] text-[16px] font-[400] leading-[26px]">Copy Code</span>
              <Image
                src={copy}
                alt="copy"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-[32px] flex flex-col gap-[16px]">
        <div className="bg-[#1A1A1A] dark:bg-[#131313] border border-[#2E2E2E] dark:border-[#2E3033] rounded-[16px] p-[20px] flex flex-col md:flex-row items-center justify-between gap-[16px]">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#E0E0E0] text-[16px] font-[500] leading-[24px]">
              Burn 1000 $EDLN and get 3 credits
            </p>
          </div>
          <button
            onClick={handleBurnTokens}
            disabled={isBurning}
            className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[20px] py-[10px] rounded-[12px] font-[500] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors disabled:opacity-70 flex items-center justify-center min-w-[80px] min-h-[40px]"
          >
            {isBurning ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF80] dark:border-[#000000]"></div>
            ) : (
              "Burn"
            )}
          </button>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#131313] border border-[#2E2E2E] dark:border-[#2E3033] rounded-[16px] p-[20px] flex flex-col md:flex-row items-center justify-between gap-[16px]">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#E0E0E0] text-[16px] font-[500] leading-[24px]">
              Stake 5000 $EDLN for 30 days and earn 500 XP
            </p>
          </div>
          <button
            disabled={true}
            className="bg-transparent border border-[#61728C] text-[#61728C] px-[20px] py-[10px] rounded-[12px] font-[500] text-[16px] cursor-not-allowed min-w-[80px] min-h-[40px]"
          >
            Coming Soon
          </button>
        </div>
      </div>

      {roadmaps.length > 0 && (
        <div className="mt-[32px]">
          <h2 className="text-[#E0E0E0] text-[20px] font-[600] leading-[30px] mb-[16px]">
            Your Learning Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="bg-[#1A1A1A] dark:bg-[#131313] border border-[#2E2E2E] dark:border-[#2E3033] rounded-[16px] p-[20px] flex flex-col gap-[16px] hover:border-[#00FF80] transition-all cursor-pointer"
                onClick={() => handleViewRoadmap(roadmap.id)}
              >
                <div className="flex items-start   gap-[12px]">
                  <div className="w-[40px] h-[40px] bg-[#2E2E2E] dark:bg-[#2E3033] rounded-[12px] flex items-center justify-center flex-shrink-0">
                    <Image src={roadmapIcon} height={24} width={24} alt="roadmap icon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#E0E0E0] text-[16px] font-[600] leading-[22px] mb-[4px] line-clamp-2">
                      {roadmap.title}
                    </h3>
                    <p className="text-[#B3B3B3] text-[14px] font-[400] leading-[18px] line-clamp-2">
                      {roadmap.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-[12px] text-[#B3B3B3] text-[12px]">
                  <div className="flex items-center gap-[4px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>~45 mins</span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>5 Steps</span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <Image src={badge} alt="XP" width={16} height={16} />
                    <span>Earn up to 16 XP</span>
                  </div>
                </div>

                <button
                  className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[20px] py-[12px] rounded-[12px] font-[600] text-[14px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewRoadmap(roadmap.id);
                  }}
                >
                  View Learning Path
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-[24px] border border-[#2E3033] bg-[#131313] gap-[24px] p-[16px] items-start flex-col mt-[32px]">
            <div>
            <p className="text-[#E0E0E0] text-[20px] font-[500] leading-[30px]">Settings</p>
            </div>

            <div className="flex items-center justify-between flex-col md:flex-row gap-[16px] mt-[16px]">
              <button 
                onClick={handleEditProfile}
                className="flex items-center gap-[12px] bg-transparent border border-[#00FF80] py-[10px] px-[16px] rounded-[8px] w-full hover:bg-opacity-10 transition-colors cursor-pointer"
              >
                <Image src={userIcon} alt="user" width={20} height={20} />
                <p className="text-[#00FF80] text-[16px] font-[500] leading-[24px]">Edit Profile Info</p>
              </button>

              <button 
                onClick={handleExportWallet}
                className="flex items-center gap-[12px] bg-transparent border border-[#00FF80] py-[10px] px-[16px] rounded-[8px] w-full hover:bg-opacity-10 transition-colors cursor-pointer"
              >
                <Image src={walletIcon} alt="user" width={20} height={20} />
                <p className="text-[#00FF80] text-[16px] font-[500] leading-[24px]">Export Secret Key</p>
              </button>

              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-[12px] bg-transparent border border-[#00FF80] py-[10px] px-[16px] rounded-[8px] w-full hover:bg-opacity-10 transition-colors cursor-pointer"
              >
                <Trash2 className="text-[#00FF80]" size={20} />
                <p className="text-[#00FF80] text-[16px] font-[500] leading-[24px]">Delete Account</p>
              </button>

              <button 
                onClick={handleConnectTwitter}
                disabled={isConnectingTwitter || user?.isVerified}
                className={`flex items-center gap-[12px] py-[10px] px-[16px] rounded-[8px] w-full transition-colors cursor-pointer ${
                  user?.isVerified 
                    ? 'bg-[#00FF80] bg-opacity-20 border border-[#00FF80] cursor-default' 
                    : 'bg-transparent border border-[#00FF80] hover:bg-opacity-10'
                } disabled:opacity-70`}
              >
                <FaXTwitter className="text-[#00FF80]" size={20} />
                <p className="text-[#00FF80] text-[16px] font-[500] leading-[24px]">
                  {isConnectingTwitter ? 'Connecting...' : user?.isVerified ? 'X Connected ✓' : 'Connect X Account'}
                </p>
              </button>
            </div>


      </div>

      <Dialog open={isBuyModalVisible} onOpenChange={setBuyModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] text-center mb-4">
              Buy EDLN Tokens
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <input
                type="number"
                placeholder="Amount in SOL"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                disabled={isBuying}
                className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[12px] w-full text-[16px] font-[400] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#00FF80] focus:border-transparent disabled:opacity-50"
              />
              <p className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[400] text-right">
                Available: {walletBalance?.sol?.toFixed(4) || "0.0000"} SOL
              </p>
            </div>
            
            {buyError && (
              <p className="text-[#FF3B30] text-[14px] font-[400] text-center">{buyError}</p>
            )}

            <div className="flex gap-[16px] mt-[16px]">
              <button
                onClick={toggleBuyModal}
                disabled={isBuying}
                className="bg-[#FFFFFF] dark:bg-[#000000] border border-[#000000] dark:border-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#000000] dark:text-[#00FF80] text-[16px] font-[700] hover:bg-[#F9FBFC] dark:hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleBuyEDLN}
                disabled={isBuying}
                className="bg-[#000000] dark:bg-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#00FF80] dark:text-[#000000] text-[16px] font-[700] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isBuying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF80] dark:border-[#000000]"></div>
                ) : (
                  "Buy EDLN"
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={buySuccessModalVisible} onOpenChange={setBuySuccessModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md flex items-center flex-col">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F0FFF9] dark:bg-[rgba(0,255,128,0.1)] border border-[#00FF80] flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00FF80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] mb-2 text-center">
              Purchase Successful!
            </DialogTitle>
            <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-[400] leading-[24px] text-center mb-6">
              Your EDLN tokens have been purchased successfully. Your wallet balance has been updated.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px] w-full">
            {transactionLink && (
              <button
                onClick={() => window.open(transactionLink, '_blank')}
                className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[24px] py-[12px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors flex items-center justify-center gap-[8px]"
              >
                <span>View on Solscan</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21V9M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            <button
              onClick={() => setBuySuccessModalVisible(false)}
              className="bg-transparent text-[#00FF80] px-[24px] py-[12px] rounded-[16px] font-[500] text-[16px] border border-[#00FF80] hover:bg-[#00FF80] hover:text-[#000] dark:hover:text-[#000] transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editProfileModalVisible} onOpenChange={setEditProfileModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] text-center mb-4">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[500]">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                disabled={isUpdatingProfile}
                className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[12px] w-full text-[16px] font-[400] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#00FF80] focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[500]">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={editFormData.username}
                onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                disabled={isUpdatingProfile}
                className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[12px] w-full text-[16px] font-[400] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#00FF80] focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[500]">What are you learning?</label>
              <input
                type="text"
                placeholder="blockchain basics, web3 design, smart contracts..."
                value={editFormData.learning}
                onChange={(e) => setEditFormData({...editFormData, learning: e.target.value})}
                disabled={isUpdatingProfile}
                maxLength={100}
                className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[12px] w-full text-[16px] font-[400] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#00FF80] focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="flex gap-[16px] mt-[16px]">
              <button
                onClick={() => setEditProfileModalVisible(false)}
                disabled={isUpdatingProfile}
                className="bg-[#FFFFFF] dark:bg-[#000000] border border-[#000000] dark:border-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#000000] dark:text-[#00FF80] text-[16px] font-[700] hover:bg-[#F9FBFC] dark:hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                className="bg-[#000000] dark:bg-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#00FF80] dark:text-[#000000] text-[16px] font-[700] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isUpdatingProfile ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF80] dark:border-[#000000]"></div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmExportModalVisible} onOpenChange={setConfirmExportModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md flex items-center flex-col">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-[60px] h-[60px] rounded-full bg-[#FFF9F0] dark:bg-[rgba(255,176,32,0.1)] border border-[#FFB020] flex items-center justify-center">
                <Image src={warningIcon} alt="warning" width={30} height={30} />
              </div>
            </div>
            <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] mb-2 text-center">
              Security Warning
            </DialogTitle>
            <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-[400] leading-[24px] text-center mb-6">
              Are you sure you want to export your private key? This key provides complete access to your wallet and funds.
              Only proceed if you are in a secure location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-[16px] w-full">
            <button
              onClick={() => setConfirmExportModalVisible(false)}
              className="bg-[#FFFFFF] dark:bg-[#2E3033] border border-[#000000] dark:border-[#2E3033] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#000000] dark:text-[#E0E0E0] text-[16px] font-[500] hover:bg-[#F9FBFC] dark:hover:bg-[#3E3E3E] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={confirmExportWallet}
              disabled={isExportingWallet}
              className="bg-[#000000] dark:bg-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#00FF80] dark:text-[#000000] text-[16px] font-[700] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isExportingWallet ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF80] dark:border-[#000000]"></div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={exportWalletModalVisible} onOpenChange={setExportWalletModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md flex items-center flex-col">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-[60px] h-[60px] rounded-full bg-[#FFF9F0] dark:bg-[rgba(255,176,32,0.1)] border border-[#FFB020] flex items-center justify-center">
                <Image src={warningIcon} alt="warning" width={30} height={30} />
              </div>
            </div>
            <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] mb-2 text-center">
              Your Private Key
            </DialogTitle>
            <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-[400] leading-[24px] text-center mb-6">
              Keep this private key secure. Anyone with access to this key will have full control over your wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px] w-full">
            <div className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[16px] w-full">
              <p className="text-[#2D3C52] dark:text-[#E0E0E0] text-[14px] font-[400] break-all select-all">
                {privateKey}
              </p>
            </div>
            
            <button
              onClick={() => copyToClipboard(privateKey || "")}
              className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[24px] py-[12px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors flex items-center justify-center gap-[8px]"
            >
              <Image src={copy} alt="copy" width={16} height={16} />
              <span>Copy to clipboard</span>
            </button>
            
            <button
              onClick={() => {
                setExportWalletModalVisible(false);
                setPrivateKey(null);
              }}
              className="bg-transparent text-[#000000] dark:text-[#E0E0E0] px-[24px] py-[12px] rounded-[16px] font-[500] text-[16px] border border-[#000000] dark:border-[#2E3033] hover:bg-[#F9FBFC] dark:hover:bg-[#2E3033] transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={burnSuccessModalVisible} onOpenChange={setBurnSuccessModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md flex items-center flex-col">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F0FFF9] dark:bg-[rgba(0,255,128,0.1)] border border-[#00FF80] flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L19 7L15.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L8.26 12L5 7L10.91 8.26L12 2Z" fill="#00FF80"/>
                </svg>
              </div>
            </div>
            <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] mb-2 text-center">
              Tokens Burned Successfully!
            </DialogTitle>
            <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-[400] leading-[24px] text-center mb-6">
              You&apos;ve received 3 credits and your wallet balance has been updated.
            </DialogDescription>
          </DialogHeader>
          
          <button
            onClick={() => setBurnSuccessModalVisible(false)}
            className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[32px] py-[12px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors w-full"
          >
            OK
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={roadmapModalVisible} onOpenChange={setRoadmapModalVisible}>
        <DialogContent className="bg-[#FFFFFF] dark:bg-[#0D0D0D] border-[#EDF3FC] dark:border-[#2E3033] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-xl">
          {isLoadingRoadmapDetails ? (
            <div className="flex items-center justify-center py-[60px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF80]"></div>
            </div>
          ) : selectedRoadmap ? (
            <>
              <DialogHeader className="border-b border-[#EDF3FC] dark:border-[#2E3033] pb-[16px]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-[12px] mb-[8px]">
                      <div className="w-[48px] h-[48px] bg-[#F0FFF9] dark:bg-[#00FF80]/10 rounded-[12px] flex items-center justify-center">
                        <Image src={roadmapIcon} height={24} width={24} alt="roadmap icon" /> 
                      </div>
                      <div className="flex-1">
                        <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[24px] font-[700] leading-[32px]">
                          {selectedRoadmap.roadmap.title}
                        </DialogTitle>
                      </div>
                    </div>
                    <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-[400] leading-[24px]">
                      {selectedRoadmap.roadmap.description}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-[16px] mt-[16px] text-[#61728C] dark:text-[#B3B3B3] text-[14px]">
                  <div className="flex items-center gap-[6px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>~{selectedRoadmap.steps.reduce((acc, step) => acc + step.time, 0)} mins</span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{selectedRoadmap.steps.length} Steps</span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <Image src={badge} alt="XP" width={18} height={18} />
                    <span>{selectedRoadmap.steps.filter(s => s.done).length} / {selectedRoadmap.steps.length} completed</span>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto py-[24px] custom-scrollbar">
                <div className="space-y-[12px]">
                  {selectedRoadmap.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`border rounded-[16px] p-[20px] transition-all ${
                        step.done 
                          ? 'bg-[#F0FFF9] dark:bg-[#00FF80]/5 border-[#00FF80]/30 dark:border-[#00FF80]/30' 
                          : 'bg-[#F9FBFC] dark:bg-[#1A1A1A] border-[#EDF3FC] dark:border-[#2E3033] hover:border-[#00FF80]/50'
                      }`}
                    >
                      <div className="flex items-start gap-[16px]">
                        <div className="flex items-center justify-center w-[32px] h-[32px] flex-shrink-0">
                          {step.done ? (
                            <div className="w-[24px] h-[24px] rounded-full bg-[#00FF80] flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L9 17L19 7" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-[32px] h-[32px] rounded-full bg-[#2E2E2E] dark:bg-[#2E3033] flex items-center justify-center text-[#E0E0E0] font-[600] text-[14px]">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-[8px]">
                            <h3 className={`text-[18px] font-[600] leading-[24px] ${
                              step.done 
                                ? 'text-[#00FF80] line-through decoration-[#00FF80]/50' 
                                : 'text-[#2D3C52] dark:text-[#E0E0E0]'
                            }`}>
                              {step.title}
                            </h3>
                            <span className="text-[#61728C] dark:text-[#B3B3B3] text-[12px] font-[500] whitespace-nowrap ml-[8px]">
                              {step.time} min
                            </span>
                          </div>
                          
                          <p className={`text-[14px] font-[400] leading-[20px] mb-[16px] ${
                            step.done 
                              ? 'text-[#61728C] dark:text-[#B3B3B3]' 
                              : 'text-[#61728C] dark:text-[#B3B3B3]'
                          }`}>
                            {step.description}
                          </p>

                          {!step.done && (
                            <button
                              onClick={() => handleStartStep(step.id, selectedRoadmap.roadmap.chatId)}
                              disabled={isStartingStep === step.id}
                              className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[20px] py-[10px] rounded-[12px] font-[600] text-[14px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px]"
                            >
                              {isStartingStep === step.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  <span>Starting...</span>
                                </>
                              ) : (
                                <>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                                  </svg>
                                  <span>Start Step</span>
                                </>
                              )}
                            </button>
                          )}

                          {step.done && (
                            <div className="flex items-center gap-[8px] text-[#00FF80] text-[14px] font-[500]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#EDF3FC] dark:border-[#2E3033] pt-[16px] flex items-center justify-between">
                <div className="text-[#61728C] dark:text-[#B3B3B3] text-[14px]">
                  {selectedRoadmap.steps.filter(s => s.done).length === selectedRoadmap.steps.length ? (
                    <span className="text-[#00FF80] font-[600]">🎉 Roadmap completed!</span>
                  ) : (
                    <span>Keep going! You&apos;re doing great.</span>
                  )}
                </div>
                <button
                  onClick={() => setRoadmapModalVisible(false)}
                  className="bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#000000] dark:border-[#2E3033] rounded-[12px] py-[10px] px-[24px] text-[#000000] dark:text-[#E0E0E0] text-[14px] font-[600] hover:bg-[#F9FBFC] dark:hover:bg-[#2E3033] transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <div className="py-[60px] text-center text-[#61728C] dark:text-[#B3B3B3]">
              Failed to load roadmap details
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
