"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import add from "@/../public/assets/icons/addcircle.svg";
import remove from "@/../public/assets/icons/circle.svg";
import { defaultViewport, useHomeMotion } from "../motion-variants";

const FAQData = [
  {
    question: "What is EduLearn?",
    answer:
      "EduLearn is an AI-powered study companion built to help you gain real-world skills. You can create personalized learning agents, practice actively, and stay consistent with accountability systems.",
  },
  {
    question: "Is EduLearn free to use?",
    answer:
      "Yes. EduLearn has a free plan and a premium plan. The free plan covers core learning features, while premium unlocks advanced AI models, higher usage limits, and additional learning tools.",
  },
  {
    question: "What skills can I learn with EduLearn?",
    answer:
      "You can use EduLearn for software engineering, design, AI, cybersecurity, content creation, marketing, product management, and many other practical skills.",
  },
  {
    question: "How does EduLearn track my progress?",
    answer:
      "EduLearn tracks your learning through quizzes, milestones, roadmap progress, streaks, and project completion so you can clearly see consistency and improvement over time.",
  },
  {
    question: "Are achievements verifiable?",
    answer:
      "Yes. EduLearn supports verifiable proof-of-work achievements. For eligible milestones, certificates and accomplishments can be shared publicly to showcase your progress.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { staggerContainer, staggerItem, interactive } = useHomeMotion();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="relative px-4 sm:px-6 md:px-8">
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
          FAQ
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8"
        >
          <h2 className="text-[#E0E0E0] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px]">
            Got Questions? We&apos;ve Got Answers.
          </h2>

          <p className="text-[#B3B3B3] leading-[24px] md:leading-[28px] text-base md:text-lg lg:text-[20px] opacity-[0.7] font-normal md:max-w-[500px]">
            Find answers to common questions about EduLearn&apos;s features and
            learning experience.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col gap-[24px] items-center md:mx-20 mt-[48px]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        {FAQData.map((item, index) => (
          <motion.div
            layout
            className={`flex w-full flex-col rounded-xl border border-[#2E3033] overflow-hidden transition-colors duration-300 ${
              openIndex === index ? "bg-[#00FF80]" : "bg-[#0a0a0a]/40"
            }`}
            key={index}
            variants={staggerItem}
            whileHover={interactive ? { borderColor: "rgba(0,255,128,0.35)" } : undefined}
          >
            <motion.button
              type="button"
              layout
              onClick={() => toggleFAQ(index)}
              className={`flex w-full items-center gap-3 py-[16px] px-[24px] min-h-[80px] cursor-pointer text-left ${
                openIndex === index ? "text-black" : "text-[#E0E0E0]"
              }`}
              whileTap={interactive ? { scale: 0.995 } : undefined}
            >
              <p className="flex-1 font-medium pr-2">{item.question}</p>
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                <Image
                  src={openIndex === index ? remove : add}
                  alt=""
                  width={24}
                  height={24}
                  className="shrink-0 opacity-90"
                />
              </motion.div>
            </motion.button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-[24px] pb-[18px] text-black text-[15px] leading-relaxed border-t border-black/10">
                    <p>{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex items-center justify-center"
        variants={staggerItem}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="mt-[64px] flex flex-wrap items-center justify-center gap-3">
          <p className="leading-[30px] font-[400] opacity-[0.7] text-[20px]">Still have any questions?</p>
          <motion.button
            type="button"
            className="text-[#00FF80] opacity-[0.9] leading-[30px] text-[20px] cursor-pointer underline-offset-4 hover:underline"
            onClick={() => window.open("https://support.edulearn.fun", "_blank")}
            whileHover={interactive ? { scale: 1.03, y: -1 } : undefined}
            whileTap={interactive ? { scale: 0.98 } : undefined}
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.2),transparent_70%)]" />
      </div>
    </div>
  );
};

export default FAQ;
