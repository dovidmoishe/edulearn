"use client";
import React, { useState } from "react";
import Image from "next/image";
import add from "@/../public/assets/icons/addcircle.svg";
import remove from "@/../public/assets/icons/circle.svg";

const FAQData = [
  {
    question: "What is EduLearn?",
    answer:
      "EduLearn is an incentivized Web3 AI study companion that makes studying more fun and rewarding. You can chat with an intelligent tutor, take quizzes, earn XP, and unlock cool rewards like NFTs — all while tracking your progress.",
  },
  {
    question: "Is EduLearn free to use?",
    answer:
      "EduLearn currently has a free subscription and a premium subscription. The free subscription offers basic features, while the premium subscription unlocks advanced features and access to more learning credits. Credits can also be gotten through burning our token $EDLN ",
  },
  {
    question: "How do the NFTs and XP work?",
    answer:
      "As you study and complete quizzes, you earn XP that contributes to your overall progress. You can also earn NFTs as rewards for reaching certain milestones or completing specific tasks. These NFTs can be used as Proof-of-work and Proof of knowledge.",
  },
  {
    question: "Can I use EduLearn without being tech-savvy?",
    answer:
      "Absolutely! EduLearn is designed to be user-friendly and accessible to everyone, regardless of their technical background. The platform provides a simple and intuitive interface, making it easy for anyone to start learning web3 and earning rewards.",
  },
  {
    question: "How is my progress tracked?",
    answer:
      "Your progress is tracked through the XP system, which measures your learning journey. You can view your XP, completed quizzes, and earned NFTs in your profile. This allows you to see how far you&apos;ve come and what rewards you&apos;ve unlocked.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="relative px-4 sm:px-6 md:px-8 overflow-x-hidden">
      <div className="mt-10 md:mt-20 lg:mt-30 flex flex-col gap-8 md:gap-12 lg:gap-20">
        <div className="rounded-[16px] border-2 border-[#2E3033] bg-[#131313] text-[#00FF80] leading-[28px] md:leading-[36px] flex items-center justify-center w-fit px-4 md:px-[24px] py-2 md:py-[15.5px] text-sm md:text-base">
          FAQ
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          <h2 className="text-[#E0E0E0] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px]">
            Got Questions? We&apos;ve Got Answers.
          </h2>

          <p className="text-[#B3B3B3] leading-[24px] md:leading-[28px] text-base md:text-lg lg:text-[20px] opacity-[0.7] font-normal md:max-w-[500px]">
            Find answers to frequently asked questions about Edulearn service &
            offerings
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[24px] items-center md:mx-20 mt-[48px]">
        {FAQData.map((item, index) => (
          <div
            className={`flex flex-col border border-[#2E3033] rounded-[8px] w-full overflow-hidden transition-all duration-300 ${
              openIndex === index ? "bg-[#00FF80]" : ""
            }`}
            key={index}
          >
            <div
              className={`flex items-center py-[16px] px-[24px] min-h-[80px] cursor-pointer ${
                openIndex === index ? "text-black" : ""
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <p className="font-medium">{item.question}</p>
              <Image
                src={openIndex === index ? remove : add}
                alt={openIndex === index ? "collapse" : "expand"}
                className="ml-auto"
              />
            </div>
            {openIndex === index && (
              <div className="px-[24px] pb-[16px] text-black">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <div className="mt-[64px] flex items-center gap-3">
          <p className="leading-[30px] font-[400] opacity-[0.7] text-[20px] ">Still have any questions?</p>
          <p className="text-[#00FF80] opacity-[0.7] leading-[30px] text-[20px] cursor-pointer" onClick={() => window.open("https://support.edulearn.fun", "_blank")}>Contact Support</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.2),transparent_70%)]" />
      </div>
    </div>
  );
};

export default FAQ;
