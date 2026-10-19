"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";

import Image from "next/image";
import HomeIcon from "@/../public/assets/icons/dark/home.png";
import ChatIcon from "@/../public/assets/icons/dark/chat.png";
import QuizzesIcon from "@/../public/assets/icons/dark/quiz.png";
import RewardsIcon from "@/../public/assets/icons/dark/rewards.png";
import LeaderboardIcon from "@/../public/assets/icons/dark/leaderboard.png";
import ProfileIcon from "@/../public/assets/icons/dark/user.png";
import useUserStore from "../../core/userState";
import avatar from "@/../public/assets/icons/avatar.png";
import StreakIcon from "@/../public/assets/icons/streak.png";
import badge from "@/../public/assets/icons/medal05.png";
import moon from "@/../public/assets/icons/dark/moon.png";
import MenuIcon from "@/../public/assets/icons/LOGO1.png";
import { getHighQualityImageUrl } from "@/../utils/imageHelper";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <Image src={HomeIcon} alt="Home" width={28} height={28} />,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: <Image src={ChatIcon} alt="Chat" width={28} height={28} />,
  },
  {
    title: "Quizzes",
    url: "/dashboard/quizzes",
    icon: <Image src={QuizzesIcon} alt="Quizzes" width={28} height={28} />,
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: <Image src={RewardsIcon} alt="Rewards" width={28} height={28} />,
  },
  {
    title: "Leaderboard",
    url: "/dashboard/leaderboard",
    icon: (
      <Image src={LeaderboardIcon} alt="Leaderboard" width={28} height={28} />
    ),
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: <Image src={ProfileIcon} alt="Profile" width={28} height={28} />,
  },
];

export function DynamicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const theme = useUserStore((s) => s.theme);
  const setTheme = useUserStore((s) => s.setTheme);
  const currentPage =
    navItems.find((item) => item.url === pathname) || navItems[0];
  const CurrentIcon = currentPage.icon;

  return (
    <header className="flex h-[84px] shrink-0 items-center justify-between border-b pt-4 pr-6 pb-4 pl-4 relative">
      <SidebarTrigger className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 z-20 hidden md:flex" />
      
      <div className="flex items-center gap-2 md:ml-8">
        <div className="hidden md:block">
        <div className="flex items-center gap-2">
          {CurrentIcon}
          <h1 className="text-lg font-semibold">{currentPage.title}</h1>
        </div>
        </div>

        <div className="block md:hidden">
          <div className="flex items-center gap-[16px]">
          <SidebarTrigger className="p-0 h-auto w-auto bg-transparent hover:bg-transparent border-none">
          </SidebarTrigger>
            <Image src={MenuIcon} alt="Menu" width={26} height={23} />
          </div>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="rounded-full bg-gray-200">
          <Image 
            src={getHighQualityImageUrl(user?.profilePictureURL) || avatar} 
            alt="User" 
            width={46} 
            height={46}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-[24px]">
        <div className="flex items-center gap-[24px]">
          <div className="flex items-center gap-[8px]">
            <Image
              src={StreakIcon}
              alt="Notification"
              width={28}
              height={28}
            />
            <p className="text-[#E0E0E0] text-[18px] leading-[26px] font-[500]">
              {user?.streak}
            </p>
          </div>
          <div className="flex items-center gap-[8px] ">
            <Image src={badge} alt="Badge" width={28} height={28} />
            <p className="text-[#E0E0E0] text-[18px] leading-[26px] font-[500]">
              {user?.xp}
            </p>
          </div>
          <div>
            <Image src={moon} alt="Badge" width={28} height={28} />
          </div>
        </div>


        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200">
            <Image 
              src={getHighQualityImageUrl(user?.profilePictureURL) || avatar} 
              alt="User" 
              width={48} 
              height={48}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-[4px]">
            <div className="text-[#E0E0E0] text-[14px] leading-[24px] font-[500] flex items-center gap-2">
              {user?.name}
              {user?.isPremium && (
                <span className="bg-[#00FF80] text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </div>
            <div className="text-[#B3B3B3] text-[14px] leading-[24px] font-[500]">
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
