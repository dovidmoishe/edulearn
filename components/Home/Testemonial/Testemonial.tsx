"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SafeImage from "../../SafeImage";
import { defaultViewport, useHomeMotion } from "../motion-variants";

interface TestimonialCardProps {
  name: string;
  username: string;
  content: string;
  avatar: string;
}

const TestimonialCard = ({ name, username, content, avatar }: TestimonialCardProps) => {
  const { interactive, cardHover, cardTap, glowHover } = useHomeMotion();

  return (
    <motion.article
      className="h-full min-h-0 rounded-2xl border border-[#2E3033] bg-[#131313] p-6 md:p-8 flex flex-col gap-4"
      whileHover={interactive ? { ...cardHover, ...glowHover, borderColor: "rgba(0,255,128,0.25)" } : undefined}
      whileTap={interactive ? cardTap : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#2E3033]"
            whileHover={interactive ? { scale: 1.08 } : undefined}
          >
            <SafeImage
              src={avatar}
              alt={`${name}'s avatar`}
              fill
              className="object-cover"
            />
          </motion.div>
          <div>
            <p className="text-[#E0E0E0] font-medium">{name}</p>
            <p className="text-gray-400 text-sm">@{username}</p>
          </div>
        </div>
        <Link
          href={`https://x.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-[#00FF80]"
        >
          <motion.span className="inline-block" whileHover={interactive ? { y: -2, rotate: 8 } : undefined}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.span>
        </Link>
      </div>
      <p className="flex-1 text-[#E0E0E0] text-base md:text-lg leading-relaxed">{content}</p>
    </motion.article>
  );
};

const Testemonial = () => {
  const { staggerContainer, staggerItem } = useHomeMotion();
  const testimonials = [
    {
      name: "itsdave.solana",
      username: "itsdavetech",
      content: "EduLearn helps me brush up on my web3 knowledge and random fact checks.",
      avatar: "/assets/avatar.jpg"
    },
    {
      name: "Emma",
      username: "emma3bw",
      content: "EduLearn turned Web3 from confusing to exciting for me. It feels like having a smart friend who explains everything simply while making learning fun with quizzes, XP, and NFTs that prove your progress.",
      avatar: "https://pbs.twimg.com/profile_images/1927500943022571520/gAmxyvYR_400x400.jpg"
    },
    {
      name: "Valour",
      username: "0xvalour",
      content: "I've been using EduLearn for a while and it's been amazing! I can create my own learning roadmaps, making Web3 learning easy and fun, and I even earn NFTs as proof of my progress!",
      avatar: "https://pbs.twimg.com/profile_images/1970446634363371520/AIpKFc44_400x400.jpg"
    }
  ];

  return (
    <div id="testimonial" className="px-4 sm:px-6 md:px-8 relative">
      <motion.div
        className="mt-10 md:mt-20 lg:mt-30 flex flex-col gap-8 md:gap-12 lg:gap-20 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div
          variants={staggerItem}
          className="rounded-[16px] border-2 border-[#2E3033] bg-[#131313] text-[#00FF80] leading-[28px] md:leading-[36px] flex items-center justify-center w-fit px-4 md:px-[24px] py-2 md:py-[15.5px] text-sm md:text-base"
        >
          Testimonial
        </motion.div>
        <motion.h2
          variants={staggerItem}
          className="text-[#E0E0E0] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px]"
        >
          Hear what other users say
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={staggerItem} className="h-full min-h-0">
              <TestimonialCard
                name={testimonial.name}
                username={testimonial.username}
                content={testimonial.content}
                avatar={testimonial.avatar}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Testemonial;
