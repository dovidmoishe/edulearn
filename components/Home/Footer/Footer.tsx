import React from "react";
import Image from "next/image";
import logo from "@/../public/assets/images/logo.png";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="relative mt-[120px] overflow-hidden pb-[80px]">
      <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 opacity-[0.05] z-0">
        <Image
          src={logo}
          alt="watermark logo"
          className="w-[500px] md:w-[900px] h-auto object-contain"
        />
      </div>

      <div className="relative z-10">
        <div className="flex  flex-col md:flex-row gap-[120px] ">
          <div className="flex flex-col gap-[32px] ">
            <Image src={logo} alt="logo" width={190} height={39} />
            <p className="text-[#B3B3B3] text-[16px] font-[400] leading-[24px]">
              Incentivized Web3 AI study companion
            </p>
            <div className="gap-[10px] flex items-center">
              <a href="https://discord.com/invite/7ErYsnc5ty" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#2E3033] w-[40px] h-[40px] cursor-pointer hover:bg-[#00E070] transition-colors">
                  <FaDiscord color="black" size={20} />
                </div>
              </a>
              <a href="https://t.me/verificationedu" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#2E3033] w-[40px] h-[40px] cursor-pointer hover:bg-[#00E070] transition-colors">
                  <FaTelegram color="black" size={20} />
                </div>
              </a>
              <a href="https://x.com/edulearndotfun" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#2E3033] w-[40px] h-[40px] cursor-pointer hover:bg-[#00E070] transition-colors">
                  <FaXTwitter color="black" size={20} />
                </div>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[#E0E0E0] font-bold leading-[24px] text-[16px]">
              Quick Links
            </p>
            <a href="#howItWorks" className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#00FF80] transition-colors">
              How it works
            </a>
            <a href="#features" className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#00FF80] transition-colors">
              Features
            </a>
            <a href="#testimonial" className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#00FF80] transition-colors">
              Testimonial
            </a>
            <a href="#faq" className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#00FF80] transition-colors">
              FAQ&apos;s
            </a>
          </div>
        </div>

        <div className="hidden md:block ">
        <div className="flex flex-row justify-between mt-[90px] mb-[40px]">
          <p className="text-[#B3B3B3] text-[20px] font-medium leading-[30px]">
            © 2025 EDULEARN. All rights reserved.
          </p>

          <div className="flex items-center gap-[24px]">
            
            <a href="https://support.edulearn.fun/privacy-policy" className="text-[#B3B3B3] text-[20px] font-medium leading-[30px] hover:text-[#00FF80] transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
