"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import leftArrowDark from "@/../public/assets/icons/dark/leftArrow.png";
import leftArrowLight from "@/../public/assets/icons/leftArrow.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient } from '../../utils/supabase/client';
import useUserStore from '../../core/userState';
import { UserService } from '../../services/user.service';
import { Loader2 } from "lucide-react";
import { CustomAlert } from "../CustomAlert";
import { generateUUID } from '@/lib/utils';
 
const Verify = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [loadingText, setLoadingText] = useState("Verifying...");
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: "success" | "destructive" | "warning" | "info";
    title: string;
    description?: string;
  }>({ show: false, variant: "info", title: "" });
  
  const {setUser} = useUserStore()
  
  const showAlert = (variant: "success" | "destructive" | "warning" | "info", title: string, description?: string) => {
    setAlert({ show: true, variant, title, description });
    if (variant === "success") {
      setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
    }
  };
  
  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "example@gmail.com";
  const isSignUp = searchParams.get("isSignUp") === "true";
  const name = searchParams.get("name") || "";
  const referralCode = searchParams.get("referralCode") || "";
  const username = searchParams.get("username") || "";

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOtp({
        email
      });

      if (error) {
        console.error("Resend OTP failed:", error.message);
        return;
      }

      setTimeLeft(30 * 60);
      setCanResend(false);
      showAlert("success", "New verification code sent", "A new verification code has been sent to your email");
      
    } catch (error) {
      console.error("Resend OTP error:", error);
      showAlert("destructive", "Resend failed", "Unable to resend code. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      showAlert("warning", "Incomplete code", "Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    setLoadingText("Verifying code...");
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) {
        console.error("OTP verification failed:", error.message);
        showAlert("destructive", "Verification failed", "Please check the code and try again.");
        return;
      }

      if (isSignUp) {
        setLoadingText("Creating your account...");
        
        try {
          const userService = new UserService();
          const userId = generateUUID();
          const newUser = await userService.createUser({
            id: userId,
            name,
            email,
            referredBy: referralCode,
            username
          });

          if (!newUser) {
            console.error("User creation failed");
            showAlert("destructive", "Account creation failed", "Failed to create account. Please try again.");
            return;
          }

          setUser(newUser);
          showAlert("success", "Welcome to EduLearn!", "Account created successfully! Setting up your profile...");
          setTimeout(() => {
            router.push(`/auth/learning?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
          }, 1500);
          
        } catch (createError) {
          console.error("User creation failed:", createError);
          showAlert("destructive", "Account creation failed", "Failed to create account. Please try again.");
          return;
        }
      } else {
        setLoadingText("Loading your profile...");
        
        const userService = new UserService();
        const userData = await userService.getUser(email);
        if (!userData) {
          console.error("User not found");
          showAlert("destructive", "User not found", "Unable to find your account. Please try signing up.");
          return;
        }

        setUser(userData);
        router.push("/dashboard");
      }
      
    } catch (error) {
      console.error("OTP verification failed:", error);
      showAlert("destructive", "Verification failed", "Please try again or contact support if the issue persists.");
    } finally {
      setLoading(false);
      setLoadingText("Verifying...");
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
          <p className='text-center text-[24px] font-bold leading-[42px] text-[#2D3C52] dark:text-[#E0E0E0]'>
            Verify Email Address
          </p>
          <p className='text-center text-[#61728C] dark:text-[#B3B3B3] leading-[26px] text-[18px] font-[500]'>
            Enter the six digits code sent to your email address {email}
            {/* {isSignUp && (
              <span className="block text-sm mt-1 text-[#00FF80] font-semibold">
                We're creating your account...
              </span>
            )} */}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-[32px] space-y-[24px]">
          <div>
            <div className="mb-[8px]">
              <label className="text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px]">
                Code
              </label>
            </div>
            <div className="flex justify-start w-full">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className="w-full"
              >
                <InputOTPGroup className="gap-2 w-full justify-start">
                  <InputOTPSlot 
                    index={0} 
                    className="w-[48px] h-[48px] text-base font-semibold rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="w-[48px] h-[48px] text-base font-semibold rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="w-[48px] h-[48px] text-base font-semibold rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="w-[48px] h-[48px] text-base font-semibold rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="w-[48px] h-[48px] text-base font-semibold rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="w-[48px] h-[48px] text-base font-semibold rounded-[8px] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] dark:bg-[#131313] text-[#2D3C52] dark:text-[#E0E0E0] focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="text-center space-y-2">
              <p className="text-[#61728C] dark:text-[#E0E0E0] text-[14px] leading-[24px] font-[400]">
              Didn&apos;t receive a code?{" "}
              <span
                className={`text-[#2D3C52] dark:text-[#E0E0E0] font-[700] cursor-pointer hover:opacity-80 transition-opacity ${
                  (!canResend || resendLoading) && "opacity-50 cursor-not-allowed"
                }`}
                onClick={canResend && !resendLoading ? handleResendOtp : undefined}
              >
                {resendLoading ? "Resending..." : "Resend Code"}
              </span>
            </p>
            <p className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] leading-[24px] font-medium">
              Code expires in{" "}
              <span className="text-[#2D3C52] dark:text-[#E0E0E0] font-[700]">
                {formatTime()}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`cursor-pointer gap-[12px] rounded-[8px] py-[10px] px-[24px] bg-[#000] text-[#00FF80] dark:text-[#000] dark:bg-[#00FF80] text-[16px] leading-[24px] font-[700] mt-[40px] w-full transition-opacity flex items-center justify-center ${
              (loading || otp.length !== 6) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? loadingText : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;