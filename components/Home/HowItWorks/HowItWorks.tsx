import React from "react";
import Image from "next/image";
import ChatImage from "@/../public/chat.png";
import QuizImage from "@/../public/quizzes.png";
import XPIMage from "@/../public/xp.png";
import LeaderBoard from "@/../public/leaderboard.png";

const HowItWorks = () => {
  return (
    <div id="howItWorks" className="px-4 sm:px-6 md:px-8 overflow-x-hidden">
      <div className="mt-10 md:mt-20 lg:mt-30 flex flex-col gap-8 md:gap-12 lg:gap-20">
        <div className="rounded-[16px] border-2 border-[#2E3033] bg-[#131313] text-[#00FF80] leading-[28px] md:leading-[36px] flex items-center justify-center w-fit px-4 md:px-[24px] py-2 md:py-[15.5px] text-sm md:text-base">
          How It Works
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          <h2 className="text-[#E0E0E0] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px]">
            How EduLearn Works
          </h2>

          <p className="text-[#B3B3B3] leading-[24px] md:leading-[28px] text-base md:text-lg lg:text-[20px] opacity-[0.7] font-normal md:max-w-[500px]">
            From AI tutoring to gamified rewards — here&apos;s how to level up your
            learning journey.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10">
          <div className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2">
            <div className="bg-[#00FF80] rounded-[18.3px] flex items-center justify-center w-[60px] h-[60px] md:w-[72px] md:h-[72px] text-black font-[600] text-2xl md:text-[39px]">
              01
            </div>

            <div className="max-w-lg">
              <p className="text-[#E0E0E0] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500]">Chat to Learn</p>
              <p className="opacity-[0.7] text-[#B3B3B3] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2">
                Ask questions, get explanations, or explore topics with your personal AI tutor.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src={ChatImage}
              alt="Chat to Learn"
              width={575}
              className="rounded-[16px] shadow-lg w-full sm:w-[90%] md:w-[95%] lg:w-full object-contain border-2 border-[#2E3033]"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10">
          <div className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2">
            <div className="bg-[#00FF80] rounded-[18.3px] flex items-center justify-center w-[60px] h-[60px] md:w-[72px] md:h-[72px] text-black font-[600] text-2xl md:text-[39px]">
              02
            </div>

            <div className="max-w-lg">
              <p className="text-[#E0E0E0] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500]">Take Interactive Quizzes</p>
              <p className="opacity-[0.7] text-[#B3B3B3] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2">
                Reinforce your knowledge with short, fun quizzes tailored to your learning path.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src={QuizImage}
              alt="Take Interactive Quizzes"
              width={600}
              height={400}
              className="rounded-[16px] shadow-lg w-full sm:w-[90%] md:w-[95%] lg:w-full object-contain border-2 border-[#2E3033]"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10">
          <div className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2">
            <div className="bg-[#00FF80] rounded-[18.3px] flex items-center justify-center w-[60px] h-[60px] md:w-[72px] md:h-[72px] text-black font-[600] text-2xl md:text-[39px]">
              03
            </div>

            <div className="max-w-lg">
              <p className="text-[#E0E0E0] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500]">Earn XP & Unlock Rewards</p>
              <p className="opacity-[0.7] text-[#B3B3B3] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2">
                Get instant XP for correct answers. Unlock exclusive NFTs and claim $USDC
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src={XPIMage}
              alt="Earn XP & Unlock Rewards"
              width={600}
              height={400}
              className="rounded-[16px] shadow-lg w-full sm:w-[90%] md:w-[95%] lg:w-full object-contain border-2 border-[#2E3033]"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-start gap-8 lg:justify-between mt-4 md:mt-8 lg:mt-10">
          <div className="flex flex-col gap-6 md:gap-[64px] w-full lg:w-1/2">
            <div className="bg-[#00FF80] rounded-[18.3px] flex items-center justify-center w-[60px] h-[60px] md:w-[72px] md:h-[72px] text-black font-[600] text-2xl md:text-[39px]">
              04
            </div>

            <div className="max-w-lg">
              <p className="text-[#E0E0E0] text-xl md:text-2xl lg:text-[32px] leading-[32px] md:leading-[44px] font-[500]">Climb the Leaderboard</p>
              <p className="opacity-[0.7] text-[#B3B3B3] text-base md:text-lg lg:text-[20px] leading-[24px] md:leading-[30px] font-normal mt-2">
                See how you rank against other learners and stay motivated with friendly competition.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src={LeaderBoard}
              alt="Climb the Leaderboard"
              width={600}
              height={400}
              className="rounded-[16px] shadow-lg w-full sm:w-[90%] md:w-[95%] lg:w-full object-contain border-2 border-[#2E3033]"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 95vw, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
