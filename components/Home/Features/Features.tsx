"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion, type TargetAndTransition } from "framer-motion";
import aiChat from "@/../public/assets/icons/ai-chat.png";
import chart from "@/../public/assets/icons/chart.png";
import mobile from "@/../public/assets/icons/mobile.png";
import medal1 from "@/../public/assets/icons/medal1.png";
import medal2 from "@/../public/assets/icons/medal2.png";
import brain from "@/../public/assets/icons/brain.png";
import { defaultViewport, useHomeMotion } from "../motion-variants";

const featureCardHover: TargetAndTransition = {
  y: -10,
  boxShadow:
    "0 0 0 1px rgba(0,255,128,0.35), 0 20px 50px -12px rgba(0,255,128,0.18)",
  transition: { type: "spring", stiffness: 400, damping: 22 },
};

const featureIconHover: TargetAndTransition = {
  scale: 1.08,
  rotate: [0, -6, 6, 0],
  transition: { duration: 0.45 },
};

const features = [
  {
    icon: aiChat,
    title: "AI-Powered Tutor",
    description:
      "Built-in chat assistant gives instant, personalized help, just ask and learn.",
  },
  {
    icon: brain,
    title: "Interactive Quizzes",
    description:
      "Test your understanding with bite-sized quizzes tailored to your level.",
  },
  {
    icon: medal1,
    title: "Gamified Learning",
    description:
      "Earn XP, badges, and even NFTs as you progress  because learning should be rewarding.",
  },
  {
    icon: medal2,
    title: "Leaderboard Motivation",
    description:
      "Climb the ranks, compete with peers, and stay driven to learn more.",
  },
  {
    icon: chart,
    title: "Trackable Progress",
    description:
      "See your learning journey at a glance — stay on track and reach your goals.",
  },
  {
    icon: mobile,
    title: "Learn Anytime, Anywhere",
    description:
      "Quiz on your phone, track progress on your laptop, EduLearn fits your flow.",
  },
];

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: StaticImageData;
  title: string;
  description: string;
}) => {
  const { interactive, cardTap } = useHomeMotion();

  return (
    <motion.article
      className="flex cursor-pointer flex-col gap-6 items-start rounded-2xl p-6 md:p-8 bg-[#0D0D0D] border border-[#2E3033] shadow-sm shadow-[#00FF80]/10"
      whileHover={interactive ? featureCardHover : undefined}
      whileTap={interactive ? cardTap : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full gap-2 bg-[#0D0D0D] border border-[#2E3033] w-[48px] h-[48px] md:w-[72px] md:h-[72px]"
        whileHover={interactive ? featureIconHover : undefined}
      >
        <Image
          src={icon}
          alt={title}
          width={40}
          height={40}
          className="w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
        />
      </motion.div>

      <div className="flex flex-col">
        <p className="text-[#E0E0E0] text-[20px] font-bold leading-[30px] mb-2">
          {title}
        </p>
        <p className="text-[#B3B3B3] text-[16px] leading-[24px] opacity-80">
          {description}
        </p>
      </div>
    </motion.article>
  );
};

const Features = () => {
  const { staggerContainer, staggerItem } = useHomeMotion();

  return (
    <div id="features" className="px-4 sm:px-6 md:px-8 mt-[120px]">
      <motion.div
        className="mt-10 md:mt-20 lg:mt-30 flex flex-col gap-8 md:gap-12 lg:gap-20"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div
          variants={staggerItem}
          className="rounded-[16px] border-2 border-[#2E3033] bg-[#131313] text-[#00FF80] leading-[28px] md:leading-[36px] flex items-center justify-center w-fit px-4 md:px-[24px] py-2 md:py-[15.5px] text-sm md:text-base"
        >
          Why EduLearn
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8"
        >
          <h2 className="text-[#E0E0E0] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px]">
            Why EduLearn Stands Out
          </h2>

          <p className="text-[#B3B3B3] leading-[24px] md:leading-[28px] text-base md:text-lg lg:text-[20px] opacity-[0.7] font-normal md:max-w-[500px]">
            From AI-powered tutoring to on-chain rewards, EduLearn makes
            studying smarter, more fun, and genuinely motivating.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={staggerItem}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;
