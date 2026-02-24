"use client";
import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import Image from "next/image";
import HeroImage from "@/../public/image.webp";
import HeroImageMobile from "@/../public/image-mobile.png";

const Hero = () => {
  const [copied, setCopied] = useState(false);
  const contractAddress = "CFw2KxMpWuxivoowkF8vRCrnMuDeg5VMHRR7zjE7pBLV";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(contractAddress)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="overflow-x-hidden px-4 sm:px-6 md:px-8">
      <div className="my-12 sm:my-16 md:my-30 flex flex-col md:flex-row items-end md:items-end justify-between">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black via-black/50 to-transparent md:hidden"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] h-[600px] bg-[#00FF80] opacity-30 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-full max-w-[400px] h-[400px] bg-[#00FFA3] opacity-20 blur-[180px] rounded-full"></div>
        </div>

        <div className="max-w-full sm:max-w-xl md:max-w-2xl mb-8 md:mb-0 text-left w-[731px] md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-normal font-bold text-[#FFFFFF] mb-4">
            Learn Web3 Smarter. Earn as You Go
          </h1>
          <p className="text-base sm:text-lg md:text-[20px] leading-normal md:leading-[24px] text-white font-[500] opacity-[0.7]">
            Chat with an AI tutor, take quizzes, earn XP and NFTs, EduLearn
            makes every study session rewarding.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 self-center md:self-end w-full sm:w-auto items-center sm:items-stretch mt-6 md:mt-0">
          <a
            href="#cta"
            className="w-full sm:w-auto text-center bg-[#00FF80] rounded-[12px] py-2.5 sm:py-3 px-5 sm:px-6 text-black text-[14px] sm:text-[16px] font-[500] leading-normal tracking-[0.9px] cursor-pointer hover:bg-[#00FF80]/90 transition-colors duration-300 no-underline"
            style={{
              boxShadow: "0 -7px 11.2px 1px rgba(0, 66, 33, 0.40) inset",
            }}
          >
            Get Started For Free
          </a>
          <div
            onClick={copyToClipboard}
            className="w-full sm:w-auto flex justify-center bg-[#131313] rounded-[12px] py-2.5 sm:py-3 px-5 sm:px-6 text-white items-center gap-2 cursor-pointer hover:bg-[#1a1a1a] transition-colors duration-300 relative"
          >
            <span className="text-[14px] sm:text-[16px] whitespace-nowrap">Contract Address</span>
            <MdContentCopy size={16} className="sm:size-[18px]" />
            {copied && (
              <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-sm">
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-0 flex justify-center">
        <Image
          src={HeroImage}
          alt="Hero Image"
          className="mt-10 md:mt-0 w-full max-w-md mx-auto hidden md:block"
          priority
          style={{ maxWidth: "100%" }}
        />

        <Image
          src={HeroImageMobile}
          alt="Hero Image"
          className="mt-10 md:mt-0 w-full max-w-xs sm:max-w-sm mx-auto block md:hidden"
          priority
          sizes="(max-width: 640px) 80vw, 384px"
        />
      </div>
    </div>
  );
};

export default Hero;
