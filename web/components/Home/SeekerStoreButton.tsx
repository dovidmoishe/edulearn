"use client";

import React, { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { SiSolana } from "react-icons/si";

const SEEKER_DAPP_STORE_URL = "solanadappstore://details?id=com.edulearnv2.app";

type SeekerStoreButtonProps = {
  children?: ReactNode;
  className: string;
  iconSize?: number;
  style?: CSSProperties;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
};

const SeekerStoreButton = ({
  children = "Seeker Store",
  className,
  iconSize = 20,
  style,
  whileHover,
  whileTap,
}: SeekerStoreButtonProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const continueToStore = () => {
    window.location.href = SEEKER_DAPP_STORE_URL;
  };

  return (
    <>
      <motion.button
        type="button"
        className={className}
        style={style}
        whileHover={whileHover}
        whileTap={whileTap}
        onClick={() => setOpen(true)}
      >
        <SiSolana size={iconSize} />
        <span className="whitespace-nowrap">{children}</span>
      </motion.button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seeker-store-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="w-full max-w-[460px] rounded-[24px] border border-[#BFD8BF] bg-white p-6 text-[#101511] shadow-2xl shadow-black/25 dark:border-[#2E3033] dark:bg-[#101511] dark:text-white"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#00FF80] text-black">
              <SiSolana size={24} />
            </div>
            <h2 id="seeker-store-title" className="text-[24px] font-bold leading-tight">
              Open in Seeker dApp Store
            </h2>
            <p className="mt-3 text-[16px] leading-[24px] text-[#50605A] dark:text-[#B3B3B3]">
              The Seeker dApp Store link works best from a Solana Seeker phone.
              If you are browsing from another device, your browser may not be
              able to open the store listing directly.
            </p>
            <p className="mt-3 text-[16px] leading-[24px] text-[#50605A] dark:text-[#B3B3B3]">
              Continue when you are on a Seeker phone, or if you still want to
              try opening the EduLearn listing.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="min-h-[48px] rounded-full border border-[#BFD8BF] px-6 text-[15px] font-bold text-[#50605A] transition-colors hover:border-[#00B866] hover:text-[#008A4E] dark:border-[#2E3033] dark:text-[#B3B3B3] dark:hover:border-[#00FF80] dark:hover:text-[#00FF80]"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="min-h-[48px] rounded-full bg-[#00FF80] px-6 text-[15px] font-bold text-black shadow-[0_-4px_12px_rgba(0,66,33,0.35)_inset] transition-transform active:scale-[0.98]"
                onClick={continueToStore}
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SeekerStoreButton;
