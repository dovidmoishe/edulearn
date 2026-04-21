"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/../public/assets/images/edulearn.png";
import playIcon from "@/../public/assets/icons/play.png";
import { defaultViewport, useHomeMotion } from "../motion-variants";

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const { staggerContainer, staggerItem, interactive, reduce } = useHomeMotion();

  return (
    <motion.div
      className="mt-[280px] md:mt-[200px] sm:mt-[150px] gap-[64px] md:gap-[40px] sm:gap-[32px] flex flex-col items-center"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      <motion.div
        variants={staggerItem}
        className="relative"
        whileHover={interactive ? { scale: 1.06, rotate: [0, -3, 3, 0] } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        <Image className="w-[80px] h-[76px] sm:w-[60px] sm:h-[57px]" src={logo} alt="EduLearn Logo" />
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="relative w-full max-w-[1200px] h-auto aspect-video rounded-2xl overflow-hidden mx-4 shadow-[0_24px_80px_-20px_rgba(0,255,128,0.15)] ring-1 ring-[#2E3033]/80"
        whileHover={interactive ? { scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 24 } } : undefined}
      >
        <video
          className="w-full h-full object-cover"
          src="https://syvlfqtwjnnhohajuhhg.supabase.co/storage/v1/object/public/project%20media/EduLearn-2%20(1).mp4"
          autoPlay={playing}
          controls={playing}
          muted={!playing}
        />

        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.78)] backdrop-blur-[2px]">
            <motion.button
              type="button"
              onClick={() => setPlaying(true)}
              className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#00FF80]"
              whileHover={interactive ? { scale: 1.08 } : undefined}
              whileTap={interactive ? { scale: 0.9 } : undefined}
            >
              <motion.span
                className="absolute inset-[-14px] rounded-full bg-[#00FF80]/20 blur-2xl"
                aria-hidden
                animate={reduce ? undefined : { opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
                transition={reduce ? undefined : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              />
              <Image src={playIcon} className="relative z-[1] w-[120px] h-[120px] sm:w-[80px] sm:h-[80px]" alt="Play video" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Demo;
