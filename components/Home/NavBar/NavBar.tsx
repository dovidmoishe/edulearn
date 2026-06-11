"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import useUserStore from "../../../core/userState";
import { useHomeMotion } from "../motion-variants";

const NavBar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const previousScrollY = useRef(0);
  const { scrollY } = useScroll();
  const { navMount } = useHomeMotion();
  const user = useUserStore((s) => s.user);
  const theme = useUserStore((s) => s.theme);
  const setTheme = useUserStore((s) => s.setTheme);
  const isDark = theme === "dark";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = previousScrollY.current;
    const scrollingDown = latest > previous;
    const scrollingUp = latest < previous;

    setScrolled(latest > 28);

    if (latest <= 28 || scrollingUp) {
      setIsHidden(false);
    } else if (scrollingDown && latest > 96 && !isMenuOpen) {
      setIsHidden(true);
    }

    previousScrollY.current = latest;
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

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navMount}
      className={`sticky z-[60] top-3 sm:top-4 md:top-5 flex w-full touch-manipulation items-center justify-between gap-2 rounded-full border px-3 py-2 sm:px-4 sm:py-2.5 md:gap-4 md:px-6 md:py-3 transition-[background-color,backdrop-filter,border-color,box-shadow,transform] duration-300 ${
        isHidden ? "-translate-y-[calc(100%+2rem)]" : "translate-y-0"
      } ${
        scrolled
          ? "border-[#D7E7D7] bg-white/85 shadow-lg shadow-emerald-950/10 backdrop-blur-xl dark:border-[#2E3033]/60 dark:bg-black/55 dark:shadow-black/25"
          : "border-[#D7E7D7]/80 bg-white/65 backdrop-blur-md dark:border-[#2E3033]/35 dark:bg-black/35"
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
            <a href="#" className="rounded-full px-3 py-2 text-[#50605A] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-[#00FF80]/10 hover:text-[#008A4E] active:bg-[#00FF80]/15 dark:text-[#B3B3B3] dark:hover:bg-white/5 dark:hover:text-[#00FF80] dark:active:bg-white/10">
              Home
            </a>
          </li>
          <li>
            <a href="#howItWorks" className="rounded-full px-3 py-2 text-[#50605A] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-[#00FF80]/10 hover:text-[#008A4E] active:bg-[#00FF80]/15 dark:text-[#B3B3B3] dark:hover:bg-white/5 dark:hover:text-[#00FF80] dark:active:bg-white/10">
              How it works
            </a>
          </li>
          <li>
            <a href="#features" className="rounded-full px-3 py-2 text-[#50605A] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-[#00FF80]/10 hover:text-[#008A4E] active:bg-[#00FF80]/15 dark:text-[#B3B3B3] dark:hover:bg-white/5 dark:hover:text-[#00FF80] dark:active:bg-white/10">
              Features
            </a>
          </li>
          <li>
            <Link
              href="/blog"
              className="rounded-full px-3 py-2 text-[#50605A] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer transition-colors hover:bg-[#00FF80]/10 hover:text-[#008A4E] active:bg-[#00FF80]/15 dark:text-[#B3B3B3] dark:hover:bg-white/5 dark:hover:text-[#00FF80] dark:active:bg-white/10"
            >
              Blog
            </Link>
          </li>
        </ul>
      </div>

      {!user ? (
        <div className="hidden shrink-0 md:flex items-center gap-2 lg:gap-3">
          <button
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#BFD8BF] bg-white/70 text-[#15251C] transition-colors hover:border-[#00A85E] hover:text-[#008A4E] active:scale-[0.98] dark:border-[#2E3033] dark:bg-[#131313] dark:text-[#B3B3B3] dark:hover:border-[#00FF80] dark:hover:text-[#00FF80]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#00B866] px-5 text-[#008A4E] font-bold text-[14px] lg:min-h-[48px] lg:px-7 lg:text-[16px] cursor-pointer whitespace-nowrap transition-colors active:scale-[0.98] hover:bg-[#00FF80]/10 dark:border-[#00FF80] dark:text-[#00FF80]"
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
          <button
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#BFD8BF] bg-white/70 text-[#15251C] transition-colors hover:border-[#00A85E] hover:text-[#008A4E] active:scale-[0.98] dark:border-[#2E3033] dark:bg-[#131313] dark:text-[#B3B3B3] dark:hover:border-[#00FF80] dark:hover:text-[#00FF80]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!user?.isPremium && (
            <span
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#00B866] px-5 text-[#008A4E] font-bold text-[14px] lg:min-h-[48px] lg:px-6 lg:text-[16px] cursor-pointer whitespace-nowrap transition-colors active:scale-[0.98] hover:bg-[#00FF80]/10 dark:border-[#00FF80] dark:text-[#00FF80]"
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

      <div className="md:hidden -mr-1 cursor-pointer rounded-full p-2.5 z-50 transition-colors active:bg-[#00FF80]/10 dark:active:bg-white/10" onClick={toggleMenu}>
        {isMenuOpen ? (
          <IoMdClose size={24} className="text-[#50605A] dark:text-[#B3B3B3]" />
        ) : (
          <GiHamburgerMenu size={24} className="text-[#50605A] dark:text-[#B3B3B3]" />
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/30 dark:bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="fixed left-4 right-4 top-[max(5.25rem,calc(env(safe-area-inset-top,0px)+4.25rem))] z-50 mx-auto max-h-[min(85dvh,28rem)] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-3xl border border-[#D7E7D7] bg-white py-4 px-5 shadow-xl dark:border-transparent dark:bg-[#121212]"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="list-none flex flex-col gap-4">
              <li className="py-2">
                <a href="#" className="text-[#50605A] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]">
                  Home
                </a>
              </li>
              <li className="py-2">
                <a href="#howItWorks" className="text-[#50605A] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]">
                  How it works
                </a>
              </li>
              <li className="py-2">
                <a href="#features" className="text-[#50605A] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]">
                  Features
                </a>
              </li>
              <li className="py-2">
                <Link
                  href="/blog"
                  className="text-[#50605A] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li className="py-2">
                <a 
                  href="/pricing"
                  className="text-[#50605A] leading-normal text-[16px] font-[500] cursor-pointer hover:text-[#008A4E] transition-colors dark:text-[#B3B3B3] dark:hover:text-[#00FF80]"
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
                <button
                  type="button"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#BFD8BF] px-6 py-3 text-[#15251C] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99] dark:border-[#2E3033] dark:text-[#B3B3B3]"
                  onClick={toggleTheme}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
                {!user ? (
                  <>
                    <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#00B866] px-6 py-3 text-[#008A4E] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99] dark:border-[#00FF80] dark:text-[#00FF80]" onClick={() => router.push("/auth")}>
                      Sign In
                    </span>
                    <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#00FF80] px-6 py-3 text-[#000000] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99]" onClick={() => router.push("/auth")}>
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    {!user?.isPremium && (
                      <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#00B866] px-6 py-3 text-[#008A4E] font-bold text-[16px] cursor-pointer text-center transition-transform active:scale-[0.99] dark:border-[#00FF80] dark:text-[#00FF80]" onClick={() => router.push("/pricing")}>
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
