"use client";

import { Menu, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import Logo from "@/../public/assets/icons/edulearn.png";
import MainLogo from "@/../public/assets/icons/LOGO1.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import XPBadge from "@/../public/assets/icons/medal01.png";
import { Progress } from "@/components/ui/progress";
import help from "@/../public/assets/icons//dark/help.png";
import logoutIcon from "@/../public/assets/icons/dark/logout.png";
import useUserStore from "@/../core/userState";  
import HomeIcon from "@/../public/assets/icons/dark/home.png"
import Chat from "@/../public/assets/icons/dark/aichat.png"
import Quizzes from "@/../public/assets/icons/dark/brain.png"
import Rewards from "@/../public/assets/icons/dark/gift.png"
import Leaderboard from "@/../public/assets/icons/dark/medal.png"
import Profile from "@/../public/assets/icons/dark/user1.png"
import { useRouter } from "next/navigation";


const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: Chat,
  },
  {
    title: "Quizzes",
    url: "/dashboard/quizzes",
    icon: Quizzes,
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: Rewards,
  },
  {
    title: "Leaderboard",
    url: "/dashboard/leaderboard",
    icon: Leaderboard,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: Profile,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed" && !isMobile;
  const { user } = useUserStore();
  const router = useRouter();
  const milestones = {
    novice: 0,
    beginner: 500,
    intermediate: 1500,
    advanced: 3000,
    expert: 5000,
  };

  const currentXP = user?.xp || 0;

  const getMilestoneProgress = () => {
    if (currentXP >= milestones.expert) {
      return {
        progress: 1,
        xpNeeded: 0,
        currentLevel: milestones.expert,
        nextLevel: milestones.expert,
      };
    } else if (currentXP >= milestones.advanced) {
      return {
        progress:
          (currentXP - milestones.advanced) /
          (milestones.expert - milestones.advanced),
        xpNeeded: milestones.expert - currentXP,
        currentLevel: milestones.advanced,
        nextLevel: milestones.expert,
      };
    } else if (currentXP >= milestones.intermediate) {
      return {
        progress:
          (currentXP - milestones.intermediate) /
          (milestones.advanced - milestones.intermediate),
        xpNeeded: milestones.advanced - currentXP,
        currentLevel: milestones.intermediate,
        nextLevel: milestones.advanced,
      };
    } else if (currentXP >= milestones.beginner) {
      return {
        progress:
          (currentXP - milestones.beginner) /
          (milestones.intermediate - milestones.beginner),
        xpNeeded: milestones.intermediate - currentXP,
        currentLevel: milestones.beginner,
        nextLevel: milestones.intermediate,
      };
    } else {
      return {
        progress: currentXP / milestones.beginner,
        xpNeeded: milestones.beginner - currentXP,
        currentLevel: milestones.novice,
        nextLevel: milestones.beginner,
      };
    }
  };

  const { progress, xpNeeded } = getMilestoneProgress();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };
  const logout = useUserStore((s) => s.logout);

  return (
    <Sidebar
      collapsible="icon"
      className={`${
        isCollapsed ? "w-[92px]" : "w-[256px]"
      } bg-[#131313] border-r-0 transition-all duration-200 h-screen overflow-hidden`}
    >
      <SidebarContent className="bg-[#131313] flex flex-col h-full">
        <SidebarGroup className="mt-[16px] flex-shrink-0">
          <SidebarGroupLabel
            className={isCollapsed ? "flex justify-center px-2" : ""}
          >
            {isCollapsed ? (
              <div onClick={() => router.push("/")}>
                <Image
                  src={MainLogo}
                  alt="EduLearn Logo"
                  width={42}
                  height={42}
                  className="hidden md:block"
                />
              </div>
            ) : (
              <div onClick={() => router.push("/")}>
                <Image src={Logo} alt="EduLearn Logo" width={120} height={24} />
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-8">
            <SidebarMenu className="space-y-[8px]">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={isCollapsed ? "flex justify-center w-full" : ""}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link
                        href={item.url}
                        className={`flex items-center ${
                          isCollapsed
                            ? "justify-center w-[60px] h-8 mx-auto"
                            : "gap-3 px-3 py-[8px]"
                        } ${
                          active
                            ? "bg-[#00FF80] text-black rounded-[8px]"
                            : isCollapsed
                            ? "hover:bg-[#1a1a1a] hover:text-white rounded-[8px]"
                            : "text-[#B3B3B3] hover:bg-[#1a1a1a] hover:text-white rounded-[8px]"
                        }`}
                      >
                        <Image 
                          src={item.icon} 
                          alt={item.title}
                          width={16.666}
                          height={15.834}
                          className="flex-shrink-0"
                        />
                        {(!isCollapsed || isMobile) && (
                          <span>{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              <SidebarMenuItem
                className={isCollapsed ? "flex justify-center w-full" : ""}
              >
                <SidebarMenuButton
                  asChild
                  tooltip={isCollapsed ? "Upgrade" : undefined}
                >
                  <Link
                    href="/pricing"
                    className={`flex items-center ${
                      isCollapsed
                        ? "justify-center w-[60px] h-8 mx-auto"
                        : "gap-3 px-3 py-[8px]"
                    } ${
                      isActive("/pricing")
                        ? "bg-[#00FF80] text-black rounded-[8px]"
                        : isCollapsed
                        ? "hover:bg-[#1a1a1a] hover:text-white rounded-[8px]"
                        : "text-[#B3B3B3] hover:bg-[#1a1a1a] hover:text-white rounded-[8px]"
                    }`}
                  >
                    <Sparkles 
                      size={17}
                      className="flex-shrink-0"
                    />
                    {(!isCollapsed || isMobile) && (
                      <span>{user?.isPremium ? "Pricing" : "Upgrade"}</span>
                    )}
                    {!user?.isPremium && (!isCollapsed || isMobile) && (
                      <span className="ml-auto bg-[#00FF80] text-black text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                        PRO
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-[12px] mt-auto flex-shrink-0 pb-4">
        {!isCollapsed && (
          <div className="p-[10px] flex flex-col rounded-[12px] bg-[#0D0D0D] gap-[12px] items-start">
            <div className="flex items-center gap-[8px]">
              <Image src={XPBadge} alt="XP Badge" width={20} height={20} />
              <p className="text-[#E0E0E0] text-[14px] font-[500] leading-[20px]">
                XP Progress
              </p>
            </div>

            <div className="w-full">
              <Progress value={progress * 100} className="h-2" />
              <p className="text-[#B3B3B3] font-[400] text-[10px] leading-[14px] mt-1">
                {xpNeeded > 0
                  ? `${currentXP}/${currentXP + xpNeeded} to the next badge`
                  : "Congratulations! You've reached the highest level!"}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-[8px]">
            <div className={`flex items-center gap-[8px] hover:bg-[#1a1a1a] rounded-[6px] cursor-pointer ${
              isCollapsed 
                ? "justify-center w-[60px] h-8 mx-auto" 
                : "px-2 py-1"
            }`}>
              <Image src={help} alt="Help" width={16} height={16} />
              {!isCollapsed && (
                <p className="text-[#E0E0E0] text-[14px] font-[400] leading-[20px]">
                  Help
                </p>
              )}
            </div>
            <div className={`flex items-center gap-[8px] hover:bg-[#1a1a1a] rounded-[6px] cursor-pointer ${
              isCollapsed 
                ? "justify-center w-[60px] h-8 mx-auto" 
                : "px-2 py-1"
            }`} onClick={() => {
              logout();
              router.push("/");
            }}>
              <Image src={logoutIcon} alt="Logout" width={16} height={16} />
              {!isCollapsed && (
                <p className="text-[#E0E0E0] text-[14px] font-[400] leading-[20px]">
                  Logout
                </p>
              )}
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
