"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import useUserStore from "../../../core/userState";
import { useHomeMotion } from "../motion-variants";

const NavBar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { navMount } = useHomeMotion();
  const user = useUserStore((s) => s.user);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 28);
  });

  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = () => {
        setIsMenuOpen(false);
      };

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navMount}
      className={`sticky z-[60] top-3 sm:top-4 md:top-5 flex w-full touch-manipulation items-center justify-between gap-2 rounded-full border px-3 py-2 sm:px-4 sm:py-2.5 md:gap-4 md:px-6 md:py-3 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-[#2E3033]/60 bg-black/55 shadow-lg shadow-black/25 backdrop-blur-xl"
          : "border-[#2E3033]/35 bg-black/35 backdrop-blur-md"
      }`}
    >
      <div className="shrink-0">
        <Image
          src="/assets/images/logo.png"
          alt="EduLearn Logo"
          width={140}
          height={28}
          className="w-[120px] sm:w-[140px] md:w-[180px]"
          priority
        />
      </div>

      <div className="hidden min-w-0 md:block">
        <ul className="list-none flex items-center gap-2 lg:gap-[20px]">
          <li>
            <a href="#" className="rounded-full px-3 py-2 text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-white/5 hover:text-[#00FF80] active:bg-white/10">
              Home
            </a>
          </li>
          <li>
            <a href="#howItWorks" className="rounded-full px-3 py-2 text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-white/5 hover:text-[#00FF80] active:bg-white/10">
              How it works
            </a>
          </li>
          <li>
            <a href="#features" className="rounded-full px-3 py-2 text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-white/5 hover:text-[#00FF80] active:bg-white/10">
              Features
            </a>
          </li>
          <li>
            <a 
              href="/discover"
              className="rounded-full px-3 py-2 text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-white/5 hover:text-[#00FF80] active:bg-white/10"
              onClick={(e) => {
                e.preventDefault();
                router.push("/discover");
              }}
            >
              Discover
            </a>
          </li>
          <li>
            <Link
              href="/blog"
              className="rounded-full px-3 py-2 text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-white/5 hover:text-[#00FF80] active:bg-white/10"
            >
              Blog
            </Link>
          </li>
        </ul>
      </div>

      {!user ? (
        <div className="hidden shrink-0 md:flex items-center gap-2 lg:gap-3">
          <span
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#00FF80] px-5 text-[#00FF80] font-bold text-[14px] lg:min-h-[48px] lg:px-7 lg:text-[16px] cursor-pointer whitespace-nowrap transition-colors active:scale-[0.98] hover:bg-[#00FF80]/10"
            onClick={() => router.push("/auth")}
          >
            Sign In
          </span>

          <span
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#00FF80] px-5 text-[#000000] font-bold text-[14px] lg:min-h-[48px] lg:px-7 lg:text-[16px] cursor-pointer whitespace-nowrap shadow-[0_-4px_12px_rgba(0,66,33,0.35)_inset] transition-transform active:scale-[0.98]"
            onClick={() => router.push("/auth")}
          >
            Sign Up
          </span>
        </div>
      ) : (
        <div className="hidden shrink-0 md:flex items-center gap-2 lg:gap-3">
          {!user?.isPremium && (
            <span
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#00FF80] px-5 text-[#00FF80] font-bold text-[14px] lg:min-h-[48px] lg:px-6 lg:text-[16px] cursor-pointer whitespace-nowrap transition-colors active:scale-[0.98] hover:bg-[#00FF80]/10"
              onClick={() => router.push("/pricing")}
            >
              Upgrade
            </span>
          )}
          <span
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#00FF80] px-5 text-[#000000] font-bold text-[14px] lg:min-h-[48px] lg:px-7 lg:text-[16px] cursor-pointer whitespace-nowrap transition-transform active:scale-[0.98]"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </span>
        </div>
      )}

      <div className="md:hidden -mr-1 cursor-pointer rounded-full p-2.5 z-50 transition-colors active:bg-white/10" onClick={toggleMenu}>
        {isMenuOpen ? (
          <IoMdClose size={24} className="text-[#B3B3B3]" />
        ) : (
          <GiHamburgerMenu size={24} className="text-[#B3B3B3]" />
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="fixed left-4 right-4 top-[max(5.25rem,calc(env(safe-area-inset-top,0px)+4.25rem))] z-50 mx-auto max-h-[min(85dvh,28rem)] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-3xl bg-[#121212] py-4 px-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="list-none flex flex-col gap-4">
              <li className="py-2">
                <a href="#" className="text-[#B3B3B3] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors">
                  Home
                </a>
              </li>
              <li className="py-2">
                <a href="#howItWorks" className="text-[#B3B3B3] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors">
                  How it works
                </a>
              </li>
              <li className="py-2">
                <a href="#features" className="text-[#B3B3B3] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors">
                  Features
                </a>
              </li>
              <li className="py-2">
                <a 
                  href="/discover"
                  className="text-[#B3B3B3] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/discover");
                    setIsMenuOpen(false);
                  }}
                >
                  Discover
                </a>
              </li>
              <li className="py-2">
                <Link
                  href="/blog"
                  className="text-[#B3B3B3] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li className="py-2">
                <a 
                  href="/pricing"
                  className="text-[#B3B3B3] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/pricing");
                    setIsMenuOpen(false);
                  }}
                >
                  Pricing
                </a>
              </li>
              <div className="flex flex-col gap-3 mt-3">
                {!user ? (
                  <>
                    <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#00FF80] px-6 py-3 text-[#00FF80] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99]" onClick={() => router.push("/auth")}>
                      Sign In
                    </span>
                    <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#00FF80] px-6 py-3 text-[#000000] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99]" onClick={() => router.push("/auth")}>
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    {!user?.isPremium && (
                      <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#00FF80] px-6 py-3 text-[#00FF80] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99]" onClick={() => router.push("/pricing")}>
                        Upgrade
                      </span>
                    )}
                    <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#00FF80] px-6 py-3 text-[#000000] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99]" onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </span>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NavBar;