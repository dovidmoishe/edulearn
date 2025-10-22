"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import mail from "@/../public/assets/icons/mail.png";
import mailDark from "@/../public/assets/icons/dark/mail.png";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


interface FormData {
  name: string;
  email: string;
  referralCode: string;
  username: string;
}

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    referralCode: "",
    username: "",
  });

  const router = useRouter();

  const sanitizeInput = (value: string, field: keyof FormData): string => {
    let sanitized = value.replace(/[<>\"'&]/g, "").trim();

    switch (field) {
      case "email":
        sanitized = sanitized
          .toLowerCase()
          .replace(/[^a-z0-9@._-]/g, "")
          .substring(0, 254);
        break;

      case "name":
        sanitized = sanitized
          .replace(/[^a-zA-Z\s'-]/g, "")
          .replace(/\s+/g, " ")
          .substring(0, 50);
        break;

      case "username":
        sanitized = sanitized
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .substring(0, 30);
        sanitized = sanitized.replace(/^_+|_+$/g, "");
        break;

      case "referralCode":
        sanitized = sanitized
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .substring(0, 20);
        break;

      default:
        sanitized = sanitized.substring(0, 100);
        break;
    }

    return sanitized;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = sanitizeInput(value, field);
    setFormData({ ...formData, [field]: sanitizedValue });
  };

  const validateInput = (field: keyof FormData, value: string): boolean => {
    switch (field) {
      case "email":
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return (
          emailRegex.test(value) && value.length >= 5 && value.length <= 254
        );

      case "name":
        return (
          value.length >= 2 &&
          value.length <= 50 &&
          /^[a-zA-Z\s'-]+$/.test(value)
        );

      case "username":
        return (
          value.length >= 3 &&
          value.length <= 30 &&
          /^[a-z0-9_]+$/.test(value)
        );

      case "referralCode":
        return (
          value.length === 0 ||
          (value.length >= 3 && value.length <= 20 && /^[A-Z0-9]+$/.test(value))
        );

      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateInput("email", formData.email)) {
        console.error("Please enter a valid email address");
        return;
      }

      if (!isLogin) {
        if (!validateInput("name", formData.name)) {
          console.error(
            "Please enter a valid name (2-50 characters, letters only)"
          );
          return;
        }

        if (!validateInput("username", formData.username)) {
          console.error(
            "Username must be 3-30 characters, alphanumeric and underscores only"
          );
          return;
        }

        if (
          formData.referralCode &&
          !validateInput("referralCode", formData.referralCode)
        ) {
          console.error(
            "Referral code must be 3-20 characters, alphanumeric only"
          );
          return;
        }
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOtp({
        email: formData.email,
      });

      if (error) {
        console.error(isLogin ? "Login failed:" : "Sign up failed:", error.message);
        return;
      }

      console.log(isLogin ? "Login result:" : "Sign up result:", data);
      
      const params = new URLSearchParams({
        email: formData.email,
      });

      if (!isLogin) {
        params.append('isSignUp', 'true');
        params.append('name', formData.name);
        params.append('username', formData.username);
        if (formData.referralCode) params.append('referralCode', formData.referralCode);
      }

      router.push(`/auth/verify?${params.toString()}`);
    } catch (error) {
      console.error(isLogin ? "Login error:" : "Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-lg mx-auto px-6 py-8">
      <div className="flex flex-col items-center gap-[32px] mb-12">
        <div className="flex items-center justify-center">
          <Image
            src="/assets/icons/LOGO.png"
            alt="EduLearn Logo"
            width={42}
            height={40}
            className="dark:hidden"
            priority
          />
          <Image
            src="/assets/icons/LOGO1.png"
            alt="EduLearn Logo"
            width={42}
            height={40}
            className="dark:inline hidden"
            priority
          />
        </div>
        <div className="flex flex-col text-center ">
          <p className="text-[#2D3C52] dark:text-[#E0E0E0] leading-[42px] font-[700] text-[24px]">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>

          <p className="text-[#61728C] dark:text-[#B3B3B3] text-[18px] leading-[26px] text-center font-medium opacity-[0.7]">
            {isLogin
              ? "Login to continue your journey"
              : "Lets get started, your Web3 AI tutor awaits"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px] block">
              Name
            </label>
            <div className="relative w-full">
              <input
                placeholder="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                maxLength={50}
                autoComplete="name"
                required={!isLogin}
                className="w-full rounded-[8px] h-[48px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[12px] pl-[16px] pr-[16px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px] block">
            Email
          </label>
          <div className="relative w-full">
            <input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              maxLength={254}
              autoComplete="email"
              required
              className="w-full rounded-[8px] h-[48px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[12px] pl-[16px] pr-[44px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
            />
            <div className="absolute right-[16px] top-1/2 transform -translate-y-1/2 flex items-center justify-center">
              <Image
                src={mail}
                alt="Mail Icon"
                width={22}
                height={22}
                className="dark:hidden"
              />
              <Image
                src={mailDark}
                alt="Mail Icon"
                width={22}
                height={22}
                className="dark:inline hidden"
              />
            </div>
          </div>
        </div>

        {!isLogin && (
          <>
            <div className="space-y-2">
              <label className="text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px] block">
                Referral Code (Optional)
              </label>
              <div className="relative w-full">
                <input
                  placeholder="Referral Code"
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) =>
                    handleInputChange("referralCode", e.target.value)
                  }
                  maxLength={20}
                  autoComplete="off"
                  className="w-full rounded-[8px] h-[48px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[12px] pl-[16px] pr-[16px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px] block">
                X Username
              </label>
              <div className="relative w-full">
                <input
                  placeholder="@username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  maxLength={30}
                  autoComplete="username"
                  required={!isLogin}
                  className="w-full rounded-[8px] h-[48px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[12px] pl-[16px] pr-[16px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer gap-[12px] rounded-[8px] py-[14px] px-[24px] bg-[#000] text-[#00FF80] dark:text-[#000] dark:bg-[#00FF80] text-[16px] leading-[24px] font-[700] mt-8 w-full flex items-center justify-center transition-opacity ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
        </button>
      </form>

      <div className="flex items-center justify-center mt-8 text-center gap-2">
        <p className="text-[#61728C] dark:text-[#B3B3B3] leading-[24px] text-[16px] font-[400]">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <p
          className={`text-[#2D3C52] dark:text-[#E0E0E0] underline underline-offset-[6px] decoration-solid decoration-1 decoration-[#2D3C52] dark:decoration-[#E0E0E0] cursor-pointer hover:opacity-80 transition-opacity ${
            loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
          }`}
          onClick={() => !loading && setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </p>
      </div>
    </div>
  );
};

export default Signup;
