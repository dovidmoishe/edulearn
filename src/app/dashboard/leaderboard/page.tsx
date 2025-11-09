"use client";

import React, { useState, useEffect } from "react";
import useUserStore from "@/../core/userState";
import { UserService, User } from "@/../services/user.service";
import avatar from "@/../public/assets/icons/avatar2.png"
import badge from "@/../public/assets/icons/medal05.png"
import Image from "next/image";
import fire from "@/../public/assets/icons/fire.png"
import silver from "@/../public/assets/icons/silver.png"
import gold from "@/../public/assets/icons/gold.png"
import bronze from "@/../public/assets/icons/bronze.png"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { getHighQualityImageUrl } from "@/../utils/imageHelper";

interface LeaderboardUser extends User {
  rank: number;
}


export default function LeaderboardPage() {
  const { theme, user } = useUserStore();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userService = new UserService();
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await userService.getLeaderboard();
        const leaderboardUsers: LeaderboardUser[] = response.users.map((apiUser, index) => ({
          ...apiUser,
          rank: index + 1
        }));
        
        setUsers(leaderboardUsers);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRemainingUsers = () => {
    const remainingUsers = users.slice(3, 10).map((userData, index) => ({
      ...userData,
      rank: index + 4,
      isCurrentUser: currentUserId === userData.id,
    }));

    const currentUserInTop3 = users.slice(0, 3).some(userData => userData.id === currentUserId);
    const currentUserInTop10 = users.slice(0, 10).some(userData => userData.id === currentUserId);
    
    if (user && !currentUserInTop3 && !currentUserInTop10) {
      const currentUserRank = users.findIndex(userData => userData.id === user.id) + 1;
      
      if (currentUserRank > 10) {
        remainingUsers.push({
          ...user,
          rank: currentUserRank,
          isCurrentUser: true,
        });
      }
    }

    return remainingUsers;
  };

  const remainingUsers = getRemainingUsers();

  
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex items-end justify-center">
            {users[1] && (
              <div className="flex items-center w-[110px] md:w-[167px] justify-between flex-col py-[10px] md:py-[21px] px-[8px] md:px-[27px] gap-[8px] md:gap-[5px] h-[160px] md:h-[227px] rounded-tl-[20px] border-[0.8px] border-[#2E3033] bg-[#2E3033] relative"> 
                  <Image src={silver} alt="silver medal" width={45} height={45} className="absolute -top-[25px] z-10" />
                  <div className="w-[40px] h-[40px] md:w-[95px] md:h-[95px] rounded-full bg-white p-[3px] mt-[5px]">
                    <Image 
                      src={getHighQualityImageUrl(users[1].profilePictureURL) || avatar} 
                      alt="avatar" 
                      width={95} 
                      height={95} 
                      className="rounded-full w-full h-full object-cover" 
                    />
                  </div>
                  <p className="text-[#E0E0E0] text-center font-[500] leading-[16px] md:leading-[26px] text-[13px] md:text-[17px] mt-[3px]">
                    {users[1].name}
                  </p>
                  <p className="text-[#E0E0E0] text-center font-[500] leading-[12px] md:leading-[26px] text-[10px] md:text-[13px] mt-[1px]">
                    {users[1].level ? users[1].level.charAt(0).toUpperCase() + users[1].level.slice(1).toLowerCase() : 'Novice'}
                  </p>

                  <div className="flex items-center gap-[3px] md:gap-[6.5px] mt-[2px]">
                    <Image src={badge} alt="badge" width={10} height={10} className="w-[10px] h-[10px] md:w-[28px] md:h-[28px]" />
                    <p className="text-[#E0E0E0] text-[10px] md:text-[15px] font-[500] leading-[12px] md:leading-[22px]">
                      {users[1].xp || 0} XP
                    </p>
                  </div>
              </div>
            )}
            
            {users[0] && (
              <div className="h-[180px] md:h-[272px] bg-[#00FF80] w-[130px] md:w-[190px] flex-col flex items-center rounded-t-[20px] gap-[8px] relative z-[2]">
                  <Image src={gold} alt="gold medal" width={45} height={45} className="absolute -top-[25px] z-10" />
                  <div className="w-[40px] h-[40px] md:w-[95px] md:h-[95px] rounded-full bg-white p-[3px] mt-[5px]">
                    <Image 
                      src={getHighQualityImageUrl(users[0].profilePictureURL) || avatar} 
                      alt="avatar" 
                      width={95} 
                      height={95} 
                      className="rounded-full w-full h-full object-cover" 
                    />
                  </div>
                  <p className="text-[#000] text-center font-[500] leading-[16px] md:leading-[26px] text-[13px] md:text-[17px] mt-[3px]">
                    {users[0].name}
                  </p>
                  <p className="text-[#000] text-center font-[500] leading-[12px] md:leading-[26px] text-[10px] md:text-[13px] mt-[1px]">
                    {users[0].level ? users[0].level.charAt(0).toUpperCase() + users[0].level.slice(1).toLowerCase() : 'Novice'}
                  </p>

                  <div className="flex items-center gap-[3px] md:gap-[6.5px] mt-[2px]">
                    <Image src={badge} alt="badge" width={10} height={10} className="w-[10px] h-[10px] md:w-[28px] md:h-[28px]" />
                    <p className="text-[#000] text-[10px] md:text-[15px] font-[500] leading-[12px] md:leading-[22px]">
                      {users[0].xp || 0} XP
                    </p>
                  </div>
              </div>
            )}
            
            {users[2] && (
              <div className="flex items-center w-[100px] md:w-[167px] justify-between flex-col py-[8px] md:py-[21px] px-[8px] md:px-[27px] gap-[6px] md:gap-[5px] h-[140px] md:h-[227px] rounded-tr-[20px] border-[0.8px] border-[#2E3033] bg-[#2E3033] relative">
                  <Image src={bronze} alt="bronze medal" width={45} height={45} className="absolute -top-[25px] z-10" />
                  <div className="w-[40px] h-[40px] md:w-[95px] md:h-[95px] rounded-full bg-white p-[3px] mt-[5px]">
                    <Image 
                      src={getHighQualityImageUrl(users[2].profilePictureURL) || avatar} 
                      alt="avatar" 
                      width={95} 
                      height={95} 
                      className="rounded-full w-full h-full object-cover" 
                    />
                  </div>
                  <p className="text-[#E0E0E0] text-center font-[500] leading-[16px] md:leading-[26px] text-[13px] md:text-[17px] mt-[3px]">
                    {users[2].name}
                  </p>
                  <p className="text-[#E0E0E0] text-center font-[500] leading-[12px] md:leading-[26px] text-[10px] md:text-[13px] mt-[1px]">
                    {users[2].level ? users[2].level.charAt(0).toUpperCase() + users[2].level.slice(1).toLowerCase() : 'Novice'}
                  </p>

                  <div className="flex items-center gap-[3px] md:gap-[6.5px] mt-[2px]">
                    <Image src={badge} alt="badge" width={10} height={10} className="w-[10px] h-[10px] md:w-[28px] md:h-[28px]" />
                    <p className="text-[#E0E0E0] text-[10px] md:text-[15px] font-[500] leading-[12px] md:leading-[22px]">
                      {users[2].xp || 0} XP
                    </p>
                  </div>
              </div>
            )}
        </div>
      </div>


      <div className="mt-12 px-6">
        <div className={`rounded-2xl border ${
          theme === "dark" 
            ? "bg-[#131313] border-[#2E3033]" 
            : "bg-white border-[#E0E7F0]"
        }`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full py-12 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
              <p className={`text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"}`}>
                Loading leaderboard...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center w-full py-12 gap-3">
              <p className={`text-center ${theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"}`}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-[#00FF80] text-black hover:bg-[#00E070]"
                    : "bg-[#00FF80] text-black hover:bg-[#00E070]"
                }`}
              >
                Try Again
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-12 gap-3">
              <p className={`text-center ${theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"}`}>
                No users found in the leaderboard.
              </p>
            </div>
          ) : (
            <Table>
            <TableHeader>
              <TableRow className={`h-16 px-6 ${
                theme === "dark" 
                  ? "border-[#2E3033] hover:bg-[#1A1A1A]" 
                  : "border-[#E0E7F0] hover:bg-gray-50"
              }`}>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Rank
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Name
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  XP
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Streak
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Level
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remainingUsers.map((userData) => {
                const isCurrentUser = userData.isCurrentUser;
                return (
                  <TableRow 
                    key={userData.id}
                    className={`h-16 px-6 ${
                      isCurrentUser
                        ? "bg-[#00FF80] border-[#00FF80] hover:bg-[#00FF80]"
                        : theme === "dark" 
                          ? "border-[#2E3033] hover:bg-[#1A1A1A]" 
                          : "border-[#E0E7F0] hover:bg-gray-50"
                    }`}
                  >
                    <TableCell>
                      <p className={`text-[14px] leading-[24px] font-[500] ${
                        isCurrentUser ? "text-[#000]" : "text-[#B3B3B3]"
                      }`}>{userData.rank}</p>
                    </TableCell>
                    <TableCell>
                      <p className={`text-[14px] leading-[24px] font-[500] ${
                        isCurrentUser ? "text-[#000]" : "text-[#B3B3B3]"
                      }`}>{userData.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={badge}
                          alt="medal"
                          width={16}
                          height={16}
                          className="mr-1"
                        />
                        <span className={`text-[14px] leading-[24px] font-[500] ${
                          isCurrentUser ? "text-[#000]" : "text-[#B3B3B3]"
                        }`}>
                          {userData.xp || 0} XP
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={fire}
                          alt="fire"
                          width={16}
                          height={16}
                          className="mr-1"
                        />
                        <span className={`text-[14px] leading-[24px] font-[500] ${
                          isCurrentUser ? "text-[#000]" : "text-[#B3B3B3]"
                        }`}>
                          {userData.streak || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className={`text-[14px] leading-[24px] font-[500] ${
                        isCurrentUser ? "text-[#000]" : "text-[#B3B3B3]"
                      }`}>
                        {userData.level ? userData.level.charAt(0).toUpperCase() + userData.level.slice(1).toLowerCase() : 'Novice'}
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          )}
        </div>

      </div>
    </div>
  )
}


