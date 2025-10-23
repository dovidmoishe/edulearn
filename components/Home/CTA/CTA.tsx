import React from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";

const CTA = () => {
  return (
    <div className="flex items-center justify-center mt-[120px] mb-[80px]">
      <div className="flex flex-col items-center">
        <div className="flex items-center flex-col gap-[20px] mb-[40px]">
          <p className="text-[#E0E0E0] text-center text-[48px] font-[600] leading-normal">
            Ready to learn smarter?
          </p>
          <p className="text-[#B3B3B3] text-center leading-[28px] opacity-[0.7] font-[400] text-[20px]">
            Join EduLearn today and earn while you study.
          </p>
        </div>

        <div className="flex items-center justify-center flex-col md:flex-row gap-[24px]">
        <button className="rounded-[8px] border border-[#00FF80] py-[10px] px-[16px] text-[#00FF80] w-[198px] flex items-center justify-center gap-[12px] cursor-pointer" onClick={() => window.open("https://apps.apple.com/us/app/edulearn-fun/id6752799770", "_blank")}>
                
                Sign Up
            </button>

            <button className="rounded-[8px] border border-[#00FF80] py-[10px] px-[16px] text-[#00FF80] w-[198px] flex items-center justify-center gap-[12px] cursor-pointer" onClick={() => window.open("https://apps.apple.com/us/app/edulearn-fun/id6752799770", "_blank")}>
                <FaApple size={20} />
                App Store
            </button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
