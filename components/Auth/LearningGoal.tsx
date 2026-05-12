"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import leftArrowDark from "@/../public/assets/icons/dark/leftArrow.png";
import leftArrowLight from "@/../public/assets/icons/leftArrow.png";
import useUserStore from '../../core/userState';
import { UserService } from '../../services/user.service';
import { Loader2 } from "lucide-react";
import { CustomAlert } from "../CustomAlert";

const LearningGoal = () => {
  const [learningGoal, setLearningGoal] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: "success" | "destructive" | "warning" | "info";
    title: string;
    description?: string;
  }>({ show: false, variant: "info", title: "" });
  
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || user?.name || "";
  const email = searchParams.get("email") || user?.email || "";
  const username = searchParams.get("username") || user?.username || "";
  
  const showAlert = (variant: "success" | "destructive" | "warning" | "info", title: string, description?: string) => {
    setAlert({ show: true, variant, title, description });
    if (variant === "success") {
      setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
    }
  };
  
  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  const handleFinishSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!learningGoal.trim()) {
      showAlert("warning", "Please enter your learning goal", "Tell us what you want to learn");
      return;
    }

    if (!user && !email) {
      showAlert("destructive", "Error", "User information not found. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const userService = new UserService();
      const updatedUser = await userService.updateUserLearning({
        name: name,
        email: email,
        username: username,
        learning: learningGoal.trim()
      });

      const userId = user?.id || updatedUser.id;

      if (user) {
        setUser({
          ...user,
          learning: learningGoal.trim()
        });
      } else {
        setUser(updatedUser);
      }


      showAlert("success", "Setup complete!", "Redirecting to your dashboard...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      console.error("Error updating learning preference:", error);
      showAlert("destructive", "Error", "Failed to save your preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {alert.show && (
        <div className="mb-4">
          <CustomAlert
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
            onClose={hideAlert}
            className="animate-in fade-in-0 slide-in-from-top-1"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/auth')}>
        <Image src={leftArrowLight} alt="left arrow" width={22} height={22} className="dark:hidden"/>
        <Image src={leftArrowDark} alt="left arrow" width={22} height={22} className="hidden dark:block"/>
        <span className="text-[18px] text-gray-500 dark:text-[#B3B3B3] leading-[26px] font-[500] opacity-[0.7]">Back</span>
      </div>

      <div className='mt-[28px]'>
        <div className='flex flex-col gap-2'>
          <p className='text-center text-[28px] font-bold leading-[42px] text-[#2D3C52] dark:text-[#E0E0E0]'>
            What do you want to learn?
          </p>
          <p className='text-center text-[#61728C] dark:text-[#B3B3B3] leading-[26px] text-[16px] font-[500]'>
            Tell us about your learning goals so we can personalize your experience and generate a custom roadmap for you.
          </p>
        </div>

        <form onSubmit={handleFinishSetup} className="mt-[32px] space-y-[24px]">
          <div>
            <div className="mb-[8px]">
              <label className="text-[#2D3C52] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px]">
                Learning Goal
              </label>
            </div>
            <textarea 
              placeholder="e.g., React Native, UI design, cybersecurity basics, product management..." 
              className="w-full min-h-[120px] px-4 py-3 rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors resize-none font-[Satoshi]"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              maxLength={200}
            />
            <p className="text-right text-[#61728C] dark:text-[#B3B3B3] text-[12px] mt-1">
              {learningGoal.length}/200 characters
            </p>
          </div>

          <div className="bg-[#F9FBFC] dark:bg-[#131313] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[8px] p-4">
            <p className="text-[#2D3C52] dark:text-[#E0E0E0] text-[14px] font-semibold mb-2">
              What happens next?
            </p>
            <ul className="space-y-2 text-[#61728C] dark:text-[#B3B3B3] text-[14px]">
              <li className="flex items-start gap-2">
                <span className="text-[#00FF80] mt-1">-</span>
                <span>We&apos;ll generate a personalized learning roadmap</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00FF80] mt-1">-</span>
                <span>Get AI-powered suggestions tailored to your goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00FF80] mt-1">-</span>
                <span>Track your progress and earn rewards</span>
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!learningGoal.trim() || isLoading}
            className={`cursor-pointer gap-[12px] rounded-[8px] py-[10px] px-[24px] bg-[#000] text-[#00FF80] dark:text-[#000] dark:bg-[#00FF80] text-[16px] leading-[24px] font-[700] mt-[24px] w-full transition-opacity flex items-center justify-center ${
              (!learningGoal.trim() || isLoading) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Setting up your account..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LearningGoal;

