"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/../public/assets/images/logo.png";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { defaultViewport, useHomeMotion } from "../motion-variants";

const Footer = () => {
  const { staggerContainer, staggerItem, interactive } = useHomeMotion();

  return (
    <div className="relative mt-[120px] overflow-hidden pb-[80px]">
      <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 opacity-[0.08] z-0 dark:opacity-[0.05]">
        <Image
          src={logo}
          alt="watermark logo"
          className="w-[500px] md:w-[900px] h-auto object-contain"
        />
      </div>

      <motion.div
        className="relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div
          variants={staggerItem}
          className="flex flex-col md:flex-row gap-[120px]"
        >
          <div className="flex flex-col gap-[32px] ">
            <Image src={logo} alt="logo" width={190} height={39} />
            <p className="text-[#50605A] text-[16px] font-[400] leading-[24px] dark:text-[#B3B3B3]">
              AI-powered study companion for real-world skills
            </p>
            <div className="gap-[10px] flex items-center">
              <motion.a href="https://discord.com/invite/7ErYsnc5ty" target="_blank" rel="noopener noreferrer" aria-label="Discord" whileHover={interactive ? { y: -3, scale: 1.08 } : undefined} whileTap={interactive ? { scale: 0.95 } : undefined}>
                <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#BFD8BF] w-[40px] h-[40px] cursor-pointer hover:bg-[#00E070] transition-colors dark:border-[#2E3033]">
                  <FaDiscord color="black" size={20} />
                </div>
              </motion.a>
              <motion.a href="https://t.me/verificationedu" target="_blank" rel="noopener noreferrer" aria-label="Telegram" whileHover={interactive ? { y: -3, scale: 1.08 } : undefined} whileTap={interactive ? { scale: 0.95 } : undefined}>
                <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#BFD8BF] w-[40px] h-[40px] cursor-pointer hover:bg-[#00E070] transition-colors dark:border-[#2E3033]">
                  <FaTelegram color="black" size={20} />
                </div>
              </motion.a>
              <motion.a href="https://x.com/edulearndotfun" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" whileHover={interactive ? { y: -3, scale: 1.08 } : undefined} whileTap={interactive ? { scale: 0.95 } : undefined}>
                <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#BFD8BF] w-[40px] h-[40px] cursor-pointer hover:bg-[#00E070] transition-colors dark:border-[#2E3033]">
                  <FaXTwitter color="black" size={20} />
                </div>
              </motion.a>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[#101511] font-bold leading-[24px] text-[16px] dark:text-[#E0E0E0]">
              Quick Links
            </p>
            <motion.a href="#howItWorks" className="inline-block text-[#50605A] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]" whileHover={interactive ? { x: 4, color: "#00FF80" } : undefined}>
              How it works
            </motion.a>
            <motion.a href="#features" className="inline-block text-[#50605A] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]" whileHover={interactive ? { x: 4, color: "#00FF80" } : undefined}>
              Features
            </motion.a>
            <motion.a href="#testimonial" className="inline-block text-[#50605A] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]" whileHover={interactive ? { x: 4, color: "#00FF80" } : undefined}>
              Testimonial
            </motion.a>
            <motion.a href="#faq" className="inline-block text-[#50605A] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]" whileHover={interactive ? { x: 4, color: "#00FF80" } : undefined}>
              FAQ&apos;s
            </motion.a>
            <motion.a href="/blog" className="inline-block text-[#50605A] leading-[30px] font-[400] text-[20px] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]" whileHover={interactive ? { x: 4, color: "#00FF80" } : undefined}>
              Blog
            </motion.a>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="hidden md:block ">
        <div className="flex flex-row justify-between mt-[90px] mb-[40px]">
          <p className="text-[#50605A] text-[20px] font-medium leading-[30px] dark:text-[#B3B3B3]">
            (c) 2025 EDULEARN. All rights reserved.
          </p>

          <div className="flex items-center gap-[24px]">

            <motion.a href="https://support.edulearn.fun/privacy-policy" className="inline-block text-[#50605A] text-[20px] font-medium leading-[30px] hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]" whileHover={interactive ? { x: 3 } : undefined}>
              Privacy Policy
            </motion.a>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Footer;
