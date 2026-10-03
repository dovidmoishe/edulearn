"use client";
import useUserStore from "@/../core/userState";
import calendar from "@/../public/assets/icons/dark/calendar.png";
import Image from "next/image";
import Cards from "../../../components/Dashboard/Cards";
import XPChart from "@/components/XPChart";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <p className="text-[#E0E0E0] text-[32px] md:text-[28px] leading-normal font-[700]">
            Hey {user?.name?.split(" ")[0]}👋
          </p>

          <p className="text-[#B3B3B3] text-[16px] md:text-[14px] leading-[24px] font-[400]">
            ready to level up today ?
          </p>
        </div>

        <div className="flex items-center rounded-[8px] bg-[#131313] border border-[#2E3033] gap-[7.1px] py-2 px-2 cursor-pointer">
          <Image src={calendar} alt="calendar" width={16} height={16} />
          <p className="text-[#E0E0E0] text-[14px] leading-[21px] font-[400]">
            {new Date().toDateString()}
          </p>
        </div>
      </div>

      <Cards/> 
      
      <XPChart className="mt-4" />
    </div>
  );
}
