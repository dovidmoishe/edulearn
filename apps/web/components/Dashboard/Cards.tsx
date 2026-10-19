import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import useUserStore from "@/../core/userState";
import useActivityStore from "@/../core/activityState";
import useFlashCardStore from "@/../core/flashcardStore";
import Link from "next/link";

const levels = ['novice', 'beginner', 'intermediate', 'advanced', 'expert'];
import medal from "@/../public/assets/icons/dark/medal05.png";
import quiz from "@/../public/assets/icons/brain02.png";
import levelHolder from "@/../public/assets/icons/levelHolder.png";
import thirdMedal from "@/../public/assets/icons/thirdPlace.png";
import fire from "@/../public/assets/icons/fire.png";

const Cards = () => {
   const user = useUserStore((state) => state.user);
   const { activities, quizActivities, fetchActivities, fetchQuizActivities } =
     useActivityStore();
   const flashcardDecks = useFlashCardStore((s) => s.flashcardDecks);
   const fetchFlashcardDecks = useFlashCardStore((s) => s.fetchFlashcardDecks);

   const getActiveDays = (streak: number) => {
     const todayIndex = new Date().getDay();
     const active = [];

     for (let i = 0; i < Math.min(streak, 7); i++) {
       const index = (todayIndex - i + 7) % 7;
       active.push(index);
     }

     return active;
   };

  useEffect(() => {
    if (user?.id) {
      fetchActivities(user.id);
      fetchQuizActivities(user.id);
      fetchFlashcardDecks(user.id);
    }
  }, [user?.id, fetchActivities, fetchQuizActivities, fetchFlashcardDecks]);
  const weeklyActivityXP = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return activities
      .filter((activity) => new Date(activity.createdAt) >= sevenDaysAgo)
      .reduce((total, activity) => total + activity.xpEarned, 0);
  }, [activities]);

  const weeklyQuizData = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyQuizzes = quizActivities.filter(
      (quiz) => new Date(quiz.createdAt) >= sevenDaysAgo
    );

    return {
      count: weeklyQuizzes.length,
      xp: weeklyQuizzes.reduce((total, quiz) => total + quiz.xpEarned, 0),
    };
  }, [quizActivities]);

  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 w-full max-w-full overflow-hidden">
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px] min-w-0 overflow-hidden">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={medal} alt="XP icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">XP Earned</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">+{weeklyActivityXP} XP</div>
            <div className="text-[#B3B3B3] text-xs">This week&apos;s progress</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px] min-w-0 overflow-hidden">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={quiz} alt="Quiz icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Quizzes Completed</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">+{weeklyQuizData.count}</div>
            <div className="text-[#B3B3B3] text-xs">Completed this week</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px] min-w-0 overflow-hidden">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={thirdMedal} alt="Level icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Current Level</span>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative">
              <Image src={levelHolder} alt="level holder icon" width={60} height={60} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-white text-[20px] font-[900] leading-[15px]">
                  {levels.indexOf(user?.level?.toLowerCase() || "novice") + 1}
                </p>
                <p className="text-white text-[10px] font-bold leading-[12px]">{user?.level}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px] min-w-0 overflow-hidden">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={fire} alt="Streak icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Daily Check-in Streak</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex justify-between gap-1 mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
                const isActive = getActiveDays(user?.streak || 0).includes(index);
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isActive
                          ? "bg-[#00FF80] border-[#00FF80]"
                          : "bg-transparent border-[#2E2E2E]"
                      }`}
                    >
                      {isActive && (
                        <span className="text-[#000] text-[8px]">🔥</span>
                      )}
                    </div>
                    <p className="text-[#666] text-[8px] font-medium">{day}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="text-white text-sm font-medium">🔥 {user?.streak || 0}-Day Streak</div>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/flashcards"
          className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px] min-w-0 overflow-hidden hover:border-[#00FF80]/60 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={quiz} alt="Flashcards icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Flashcard Decks</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">{flashcardDecks.length}</div>
            <div className="text-[#B3B3B3] text-xs">Ready to review</div>
          </div>
        </Link>
    </div>
  );
};

export default Cards;
