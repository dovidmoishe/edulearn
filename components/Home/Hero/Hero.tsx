"use client";
import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroImage from "@/../public/image.webp";
import HeroImageMobile from "@/../public/image-mobile.png";
import { useHomeMotion } from "../motion-variants";

const Hero = () => {
  const [copied, setCopied] = useState(false);
  const {
    staggerContainer,
    staggerItem,
    heroLine,
    interactive,
    buttonHover,
    buttonTap,
    glowHover,
    reduce,
  } = useHomeMotion();
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
    <div className="px-4 sm:px-6 md:px-8">
      <motion.div
        className="my-12 sm:my-16 md:my-30 flex flex-col md:flex-row items-end md:items-end justify-between"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black via-black/50 to-transparent md:hidden"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] h-[600px] bg-[#00FF80] opacity-30 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-full max-w-[400px] h-[400px] bg-[#00FFA3] opacity-20 blur-[180px] rounded-full"></div>
        </div>

        <motion.div
          variants={staggerItem}
          className="max-w-full sm:max-w-xl md:max-w-2xl mb-8 md:mb-0 text-left w-[731px] md:text-left"
        >
          <h1 className="sr-only">Learn Web3 Smarter. Earn as You Go</h1>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-4"
            aria-hidden="true"
          >
            <motion.span
              variants={heroLine}
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-normal font-bold text-[#FFFFFF]"
            >
              Learn Web3 Smarter.
            </motion.span>
            <motion.span
              variants={heroLine}
              className="mt-1 block text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-normal font-bold text-[#00FF80]"
            >
              Earn as You Go
            </motion.span>
            <motion.p
              variants={staggerItem}
              className="mt-4 text-base sm:text-lg md:text-[20px] leading-normal md:leading-[24px] text-white font-[500] opacity-[0.7]"
            >
              Chat with an AI tutor, take quizzes, earn XP and NFTs, EduLearn
              makes every study session rewarding.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row gap-4 self-center md:self-end w-full sm:w-auto items-center sm:items-stretch mt-6 md:mt-0"
        >
          <motion.a
            href="auth"
            className="w-full sm:w-auto text-center bg-[#00FF80] rounded-[14px] py-2.5 sm:py-3 px-5 sm:px-6 text-black text-[14px] sm:text-[16px] font-[500] leading-normal tracking-[0.9px] cursor-pointer no-underline"
            style={{
              boxShadow: "0 -7px 11.2px 1px rgba(0, 66, 33, 0.40) inset",
            }}
            whileHover={interactive ? { ...buttonHover, ...glowHover } : undefined}
            whileTap={interactive ? buttonTap : undefined}
          >
            Get Started For Free
          </motion.a>
          <motion.div
            onClick={copyToClipboard}
            className="w-full sm:w-auto flex justify-center bg-[#131313] rounded-[14px] py-2.5 sm:py-3 px-5 sm:px-6 text-white items-center gap-2 cursor-pointer border border-[#2E3033] relative"
            whileHover={interactive ? { scale: 1.02, borderColor: "rgba(0,255,128,0.35)" } : undefined}
            whileTap={interactive ? buttonTap : undefined}
          >
            <span className="text-[14px] sm:text-[16px] whitespace-nowrap">Contract Address</span>
            <MdContentCopy size={16} className="sm:size-[18px]" />
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-sm"
              >
                Copied!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className="mt-12 sm:mt-16 md:mt-0 flex justify-center"
      >
        <motion.div
          className="relative mt-10 md:mt-0 w-full max-w-md mx-auto hidden md:block"
          style={{ maxWidth: "100%" }}
          initial={reduce ? false : { opacity: 0, scale: 0.92, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
          whileHover={
            interactive
              ? { scale: 1.03, y: -6, transition: { type: "spring", stiffness: 360, damping: 22 } }
              : undefined
          }
        >
          <Image
            src={HeroImage}
            alt="Hero Image"
            className="w-full drop-shadow-[0_20px_60px_rgba(0,255,128,0.12)]"
            priority
            style={{ maxWidth: "100%" }}
          />
        </motion.div>

        <motion.div
          className="mt-10 md:mt-0 w-full max-w-xs sm:max-w-sm mx-auto block md:hidden"
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <Image
            src={HeroImageMobile}
            alt="Hero Image"
            className="w-full"
            priority
            sizes="(max-width: 640px) 80vw, 384px"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
