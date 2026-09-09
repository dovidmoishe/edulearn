"use client";
import React from "react";
import Image from "next/image";
import { motion, type TargetAndTransition } from "framer-motion";
import { FaApple } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import HeroImage from "@/../public/image.webp";
import HeroImageLight from "@/../public/dashboard_light.png";
import HeroImageMobile from "@/../public/image-mobile.png";
import { useHomeMotion } from "../motion-variants";

const heroPrimaryHover: TargetAndTransition = {
  y: -2,
  scale: 1.03,
  boxShadow:
    "0 0 0 1px rgba(0,255,128,0.35), 0 20px 50px -12px rgba(0,255,128,0.18)",
  transition: { type: "spring", stiffness: 500, damping: 28 },
};

const heroSecondaryHover: TargetAndTransition = {
  y: -2,
  scale: 1.02,
  borderColor: "rgba(0,255,128,0.35)",
  boxShadow: "0 18px 42px -18px rgba(0,255,128,0.24)",
  transition: { type: "spring", stiffness: 500, damping: 28 },
};

const Hero = () => {
  const {
    staggerContainer,
    staggerItem,
    heroLine,
    interactive,
    buttonTap,
    reduce,
  } = useHomeMotion();
  return (
    <div className="relative isolate px-4 sm:px-6 md:px-8">
      <motion.div
        className="my-12 sm:my-16 md:my-30 flex flex-col items-start"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="pointer-events-none absolute inset-x-[-24px] top-[-140px] bottom-[-80px] -z-10 overflow-hidden sm:inset-x-[-48px] md:inset-x-[-86px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(0,255,128,0.30),transparent_30%),radial-gradient(circle_at_24%_18%,rgba(0,255,163,0.18),transparent_28%),linear-gradient(180deg,#F7FAF7_0%,#F4FFF7_42%,rgba(247,250,247,0)_100%)] dark:bg-[radial-gradient(circle_at_50%_12%,rgba(0,255,128,0.34),transparent_28%),radial-gradient(circle_at_84%_55%,rgba(0,255,163,0.22),transparent_26%),linear-gradient(180deg,#000_0%,rgba(0,0,0,0.78)_34%,rgba(0,0,0,0)_100%)]" />
          <div className="absolute left-1/2 top-[70px] h-[540px] w-[760px] -translate-x-1/2 rounded-full bg-[#00FF80]/20 blur-[150px] dark:bg-[#00FF80]/30 dark:blur-[160px]" />
          <div className="absolute right-[-110px] top-[330px] h-[430px] w-[430px] rounded-full bg-[#00FFA3]/18 blur-[150px] dark:bg-[#00FFA3]/24 dark:blur-[180px]" />
          <div className="absolute left-[-180px] top-[210px] h-[360px] w-[360px] rounded-full bg-white/80 blur-[120px] dark:hidden" />
        </div>

        <motion.div
          variants={staggerItem}
          className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-left"
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
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-normal font-bold text-[#101511] dark:text-[#FFFFFF]"
            >
              Learn Web3 Smarter.
            </motion.span>
            <motion.span
              variants={heroLine}
              className="mt-1 block text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-normal font-bold text-[#008A4E] dark:text-[#00FF80]"
            >
              Earn as You Go
            </motion.span>
            <motion.p
              variants={staggerItem}
              className="mt-4 max-w-3xl text-base sm:text-lg md:text-[20px] leading-normal md:leading-[28px] text-[#435249] font-[500] dark:text-white dark:opacity-[0.7]"
            >
              Chat with an AI tutor, take quizzes, earn XP and NFTs, EduLearn
              makes every study session rewarding.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
          >
            <motion.a
              href="https://expo.dev/artifacts/eas/i7zpsBDws1PodVbmZEUZVB.apk"
              download="edulearn.apk"
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full border border-[#00B866] bg-[#00FF80] px-7 py-3 text-[15px] font-[700] text-black no-underline sm:w-auto sm:min-w-[190px] sm:text-[16px]"
              style={{
                boxShadow: "0 -7px 11.2px 1px rgba(0, 66, 33, 0.28) inset",
              }}
              whileHover={interactive ? heroPrimaryHover : undefined}
              whileTap={interactive ? buttonTap : undefined}
            >
              <SiSolana size={21} />
              Seeker Store
            </motion.a>
            <motion.a
              href="https://apps.apple.com/us/app/edulearn-fun/id6752799770"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full border border-[#00B866] bg-white/60 px-7 py-3 text-[15px] font-[700] text-[#008A4E] no-underline backdrop-blur dark:border-[#00FF80] dark:bg-black/20 dark:text-[#00FF80] sm:w-auto sm:min-w-[176px] sm:text-[16px]"
              whileHover={interactive ? heroSecondaryHover : undefined}
              whileTap={interactive ? buttonTap : undefined}
            >
              <FaApple size={20} />
              App Store
            </motion.a>
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
            src={HeroImageLight}
            alt="EduLearn dashboard preview"
            className="w-full drop-shadow-[0_20px_60px_rgba(0,255,128,0.12)] dark:hidden"
            priority
            style={{ maxWidth: "100%" }}
          />
          <Image
            src={HeroImage}
            alt="EduLearn dashboard preview"
            className="hidden w-full drop-shadow-[0_20px_60px_rgba(0,255,128,0.12)] dark:block"
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
