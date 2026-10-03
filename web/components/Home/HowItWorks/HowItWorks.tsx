"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ChatImage from "@/../public/chat.png";
import ChatImageLight from "@/../public/ai_light.png";
import QuizImage from "@/../public/quizzes.png";
import QuizImageLight from "@/../public/quiz_light.png";
import XPIMage from "@/../public/xp.png";
import XPImageLight from "@/../public/xp_light.png";
import LeaderBoard from "@/../public/leaderboard.png";
import LeaderBoardLight from "@/../public/leaderboard_light.png";
import { defaultViewport, springSoft, useHomeMotion } from "../motion-variants";

function StepMedia({
  fromRight,
  className,
  children,
  reduce,
}: {
  fromRight: boolean;
  className: string;
  children: React.ReactNode;
  reduce: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, scale: 0.92, x: fromRight ? 44 : -44 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={springSoft}
    >
      {children}
    </motion.div>
  );
}

function StepBadge({ n, reduce }: { n: string; reduce: boolean }) {
  return (
    <motion.div
      className="bg-[#00FF80] rounded-[18.3px] flex items-center justify-center w-[60px] h-[60px] md:w-[72px] md:h-[72px] text-black font-[600] text-2xl md:text-[39px]"
      initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
      whileInView={reduce ? undefined : { scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {n}
    </motion.div>
  );
}

const stepImageClassName =
  "rounded-[16px] shadow-lg w-full sm:w-[90%] md:w-[95%] lg:w-full object-contain border-2 border-[#BFD8BF] dark:border-[#2E3033]";

const HowItWorks = () => {
  const { staggerContainer, staggerItem, reduce } = useHomeMotion();

  return (
    <div id="howItWorks" className="px-4 sm:px-6 md:px-8">
      <motion.div
        className="mt-10 md:mt-20 lg:mt-30 flex flex-col gap-8 md:gap-12 lg:gap-20"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div
          variants={staggerItem}
          className="rounded-[16px] border-2 border-[#BFD8BF] bg-white text-[#008A4E] leading-[28px] md:leading-[36px] flex items-center justify-center w-fit px-4 md:px-[24px] py-2 md:py-[15.5px] text-sm md:text-base dark:border-[#2E3033] dark:bg-[#131313] dark:text-[#00FF80]"
        >
          How It Works
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8"
        >
          <h2 className="text-[#101511] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px] dark:text-[#E0E0E0]">
            How EduLearn Works
          </h2>

          <p className="text-[#50605A] leading-[24px] md:leading-[28px] text-base md:text-lg lg:text-[20px] font-normal md:max-w-[500px] dark:text-[#B3B3B3] dark:opacity-[0.7]">
            From AI tutoring to gamified rewards, here&apos;s how to level up your
            learning journey.
          </p>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="flex flex-col lg:flex-row items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10"
        >
          <motion.div
            className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2"
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={springSoft}
          >
            <StepBadge n="01" reduce={reduce} />

            <div className="max-w-lg">
              <p className="text-[#101511] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500] dark:text-[#E0E0E0]">Chat to Learn</p>
              <p className="text-[#50605A] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2 dark:text-[#B3B3B3] dark:opacity-[0.7]">
                Ask questions, get explanations, or explore topics with your
                personal AI tutor.
              </p>
            </div>
          </motion.div>

          <StepMedia
            reduce={reduce}
            fromRight
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <Image
              src={ChatImageLight}
              alt="Chat to Learn"
              width={575}
              className={`${stepImageClassName} dark:hidden`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
            <Image
              src={ChatImage}
              alt="Chat to Learn"
              width={575}
              className={`${stepImageClassName} hidden dark:block`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </StepMedia>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="flex flex-col lg:flex-row-reverse items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10"
        >
          <motion.div
            className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2"
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={springSoft}
          >
            <StepBadge n="02" reduce={reduce} />

            <div className="max-w-lg">
              <p className="text-[#101511] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500] dark:text-[#E0E0E0]">Take Interactive Quizzes</p>
              <p className="text-[#50605A] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2 dark:text-[#B3B3B3] dark:opacity-[0.7]">
                Reinforce your knowledge with short, fun quizzes tailored to
                your learning path.
              </p>
            </div>
          </motion.div>

          <StepMedia reduce={reduce} fromRight={false} className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src={QuizImageLight}
              alt="Take Interactive Quizzes"
              width={600}
              height={400}
              className={`${stepImageClassName} dark:hidden`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
            <Image
              src={QuizImage}
              alt="Take Interactive Quizzes"
              width={600}
              height={400}
              className={`${stepImageClassName} hidden dark:block`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </StepMedia>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="flex flex-col lg:flex-row items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10"
        >
          <motion.div
            className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2"
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={springSoft}
          >
            <StepBadge n="03" reduce={reduce} />

            <div className="max-w-lg">
              <p className="text-[#101511] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500] dark:text-[#E0E0E0]">Earn XP & Unlock Rewards</p>
              <p className="text-[#50605A] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2 dark:text-[#B3B3B3] dark:opacity-[0.7]">
                Get instant XP for correct answers, unlock exclusive NFTs, and
                make every study session count.
              </p>
            </div>
          </motion.div>

          <StepMedia reduce={reduce} fromRight className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src={XPImageLight}
              alt="Earn XP & Unlock Rewards"
              width={600}
              height={400}
              className={`${stepImageClassName} dark:hidden`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
            <Image
              src={XPIMage}
              alt="Earn XP & Unlock Rewards"
              width={600}
              height={400}
              className={`${stepImageClassName} hidden dark:block`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </StepMedia>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="flex flex-col lg:flex-row-reverse items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10"
        >
          <motion.div
            className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2"
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={springSoft}
          >
            <StepBadge n="04" reduce={reduce} />

            <div className="max-w-lg">
              <p className="text-[#101511] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500] dark:text-[#E0E0E0]">Climb the Leaderboard</p>
              <p className="text-[#50605A] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2 dark:text-[#B3B3B3] dark:opacity-[0.7]">
                See how you rank against other learners and stay motivated with
                friendly competition.
              </p>
            </div>
          </motion.div>

          <StepMedia reduce={reduce} fromRight={false} className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src={LeaderBoardLight}
              alt="Climb the Leaderboard"
              width={600}
              height={400}
              className={`${stepImageClassName} dark:hidden`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
            <Image
              src={LeaderBoard}
              alt="Climb the Leaderboard"
              width={600}
              height={400}
              className={`${stepImageClassName} hidden dark:block`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </StepMedia>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HowItWorks;
