"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import useUserStore from "../../../core/userState";

const NavBar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUserStore((s) => s.user);

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
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 sm:py-3 backdrop-blur-md bg-black/70 border-b border-white/10">
      <div>
        <Image
          src="/assets/images/logo.png"
          alt="EduLearn Logo"
          width={140}
          height={28}
          className="w-[120px] sm:w-[140px] md:w-[180px]"
          priority
        />
      </div>

      <div className="hidden md:block">
        <ul className="list-none flex items-center gap-[16px] lg:gap-[24px]">
          <li>
            <a href="#" className="text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#howItWorks" className="text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors">
              How it works
            </a>
          </li>
          <li>
            <a href="#features" className="text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors">
              Features
            </a>
          </li>
          <li>
            <a 
              href="/discover"
              className="text-[#B3B3B3] leading-normal text-[15px] lg:text-[16px] font-[500] cursor-pointer hover:text-[#00FF80] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                router.push("/discover");
              }}
            >
              Discover
            </a>
          </li>
        </ul>
      </div>

      {!user ? (
        <div className="hidden md:flex items-center gap-[8px] lg:gap-[12px]" onClick={() => router.push("/auth")}>
          <span className="border border-[#00FF80] h-[40px] lg:h-[48px] rounded-[8px] px-[16px] lg:px-[32px] py-[8px] lg:py-[10px] text-[#00FF80] font-bold text-[14px] lg:text-[16px] leading-normal cursor-pointer whitespace-nowrap">
            Sign In
          </span>

          <span
            className="h-[40px] lg:h-[48px] rounded-[8px] px-[16px] lg:px-[32px] py-[8px] lg:py-[10px] bg-[#00FF80] text-[#000000] font-bold text-[14px] lg:text-[16px] leading-normal cursor-pointer whitespace-nowrap"
            onClick={() => router.push("/auth")}
          >
            Sign Up
          </span>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-[8px] lg:gap-[12px]">
          {!user?.isPremium && (
            <span
              className="border border-[#00FF80] h-[40px] lg:h-[48px] rounded-[8px] px-[16px] lg:px-[24px] py-[8px] lg:py-[10px] text-[#00FF80] font-bold text-[14px] lg:text-[16px] leading-normal cursor-pointer whitespace-nowrap hover:bg-[#00FF80]/10 transition-colors"
              onClick={() => router.push("/pricing")}
            >
              Upgrade
            </span>
          )}
          <span
            className="h-[40px] lg:h-[48px] rounded-[8px] px-[16px] lg:px-[32px] py-[8px] lg:py-[10px] bg-[#00FF80] text-[#000000] font-bold text-[14px] lg:text-[16px] leading-normal cursor-pointer whitespace-nowrap"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </span>
        </div>
      )}

      <div className="md:hidden cursor-pointer z-50" onClick={toggleMenu}>
        {isMenuOpen ? (
          <IoMdClose size={24} className="text-[#B3B3B3]" />
        ) : (
          <GiHamburgerMenu size={24} className="text-[#B3B3B3]" />
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div
            className="absolute top-[60px] right-4 left-4 bg-[#121212] py-4 px-5 z-50 shadow-lg rounded-lg md:hidden max-w-full overflow-auto w-auto"
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
                    <span className="border border-[#00FF80] rounded-[8px] px-[32px] py-[10px] text-[#00FF80] font-bold text-[16px] leading-normal cursor-pointer text-center" onClick={() => router.push("/auth")}>
                      Sign In
                    </span>
                    <span className="rounded-[8px] px-[32px] py-[10px] bg-[#00FF80] text-[#000000] font-bold text-[16px] leading-normal cursor-pointer text-center" onClick={() => router.push("/auth")}>
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    {!user?.isPremium && (
                      <span className="border border-[#00FF80] rounded-[8px] px-[32px] py-[10px] text-[#00FF80] font-bold text-[16px] leading-normal cursor-pointer text-center" onClick={() => router.push("/pricing")}>
                        Upgrade
                      </span>
                    )}
                    <span className="rounded-[8px] px-[32px] py-[10px] bg-[#00FF80] text-[#000000] font-bold text-[16px] leading-normal cursor-pointer text-center" onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </span>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
