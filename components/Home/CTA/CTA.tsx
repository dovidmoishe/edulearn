"use client";
import React from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { defaultViewport, useHomeMotion } from "../motion-variants";

const ctaLinkHover: TargetAndTransition = {
  y: -2,
  scale: 1.03,
  backgroundColor: "rgba(0,255,128,0.08)",
  boxShadow:
    "0 0 0 1px rgba(0,255,128,0.35), 0 20px 50px -12px rgba(0,255,128,0.18)",
  transition: { type: "spring", stiffness: 500, damping: 28 },
};

const CTA = () => {
  const { staggerContainer, staggerItem, interactive, buttonTap } = useHomeMotion();

  return (
    <motion.div
      id="cta"
      className="flex flex-col items-center justify-center mt-[120px] mb-[80px]"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      <motion.div variants={staggerItem} className="flex items-center flex-col gap-[20px] mb-[40px]">
        <p className="text-[#E0E0E0] text-center text-[40px] sm:text-[48px] font-[600] leading-tight">
          Ready to learn smarter?
        </p>
        <p className="text-[#B3B3B3] text-center leading-[28px] opacity-[0.7] font-[400] text-[18px] sm:text-[20px] max-w-lg">
          Join EduLearn today and earn while you study.
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="flex items-center justify-center flex-col md:flex-row gap-[24px]">
        <motion.a
          href="https://expo.dev/artifacts/eas/i7zpsBDws1PodVbmZEUZVB.apk"
          download="edulearn.apk"
          className="rounded-full border border-[#00FF80] py-3 px-8 text-[#00FF80] w-[min(100%,220px)] flex items-center justify-center gap-[12px] cursor-pointer no-underline bg-transparent"
          whileHover={interactive ? ctaLinkHover : undefined}
          whileTap={interactive ? buttonTap : undefined}
        >
          <FaGooglePlay size={20} />
          Download APK
        </motion.a>

        <motion.button
          type="button"
          className="rounded-full border border-[#00FF80] py-3 px-8 text-[#00FF80] w-[min(100%,220px)] flex items-center justify-center gap-[12px] cursor-pointer bg-transparent"
          onClick={() => window.open("https://apps.apple.com/us/app/edulearn-fun/id6752799770", "_blank")}
          whileHover={interactive ? ctaLinkHover : undefined}
          whileTap={interactive ? buttonTap : undefined}
        >
          <FaApple size={20} />
          App Store
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CTA;
