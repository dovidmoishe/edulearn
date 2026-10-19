"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import medal05 from "@/../public/assets/icons/medal05.png";
import useUserStore from "@/../core/userState";
import useActivityStore from "@/../core/activityState";

interface Activity {
  id: string;
  userId: string;
  type: 'quiz' | 'chat' | 'streak';
  title: string;
  xpEarned: number;
  createdAt: string;
}

export interface QuizHistoryItem {
  id: string;
  sn: number;
  quizName: string;
  dateTaken: string;
  score: string;
  scorePercentage: number;
  xpEarned: number;
  status: "Passed" | "Failed";
}

interface QuizHistoryProps {
  data?: QuizHistoryItem[];
  totalItems?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
}


export default function QuizHistory({ 
  data, 
  totalItems = 25, 
  loading = false,
  onPageChange,
  onSearch 
}: QuizHistoryProps) {
  const { theme, user } = useUserStore();
  const { activities, isLoading, fetchActivities } = useActivityStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user?.id) {
      fetchActivities(user.id);
    }
  }, [user?.id, fetchActivities]);

  const transformActivitiesToQuizHistory = (activities: Activity[]): QuizHistoryItem[] => {
    return activities
      .filter(activity => activity.type === 'quiz')
      .map((activity, index) => {
        const scorePercentage = Math.round((activity.xpEarned / 10) * 100);
        const correctAnswers = Math.round((activity.xpEarned / 10) * 10); 
        const score = `${correctAnswers}/10`;
        
        const status = scorePercentage >= 60 ? "Passed" : "Failed";
        
        const date = new Date(activity.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        return {
          id: activity.id,
          sn: index + 1,
          quizName: activity.title,
          dateTaken: date,
          score: score,
          scorePercentage: scorePercentage,
          xpEarned: activity.xpEarned,
          status: status
        };
      });
  };

  const quizHistoryData = activities.length > 0 ? transformActivitiesToQuizHistory(activities) : data;
  const actualLoading = isLoading || loading;

  const filteredData = quizHistoryData?.filter(item =>
    item.quizName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actualTotalItems = quizHistoryData?.length || 0;
  const totalPages = Math.ceil(actualTotalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData?.slice(startIndex, endIndex) || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className={`${theme === "dark" ? "bg-[#0D0D0D]" : "bg-[#F9FBFC]"} min-h-screen`}>
      <div className="px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className={`text-[20px] leading-[30px] font-medium ${
            theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
          }`}>
            Quiz History
          </h1>
          
          <div className={`relative flex items-center rounded-lg border p-[12px] ${
            theme === "dark" 
              ? "bg-[#131313] border-[#2E3033]" 
              : "bg-white border-[#EDF3FC]"
          }`}>
            <svg 
              className={`w-4 h-4 mr-2 ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none ${
                theme === "dark" 
                  ? "text-[#E0E0E0] placeholder-[#B3B3B3]" 
                  : "text-[#2D3C52] placeholder-[#61728C]"
              }`}
            />
          </div>
        </div>

        <div className={`rounded-2xl border ${
          theme === "dark" 
            ? "bg-[#131313] border-[#2E3033]" 
            : "bg-white border-[#E0E7F0]"
        }`}>
          {actualLoading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
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
                  SN
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Quiz Name
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Date Taken
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Score
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  XP Earned
                </TableHead>
                <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                }`}>
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow 
                  key={item.id}
                  className={`h-16 px-6 ${
                    theme === "dark" 
                      ? "border-[#2E3033] hover:bg-[#1A1A1A]" 
                      : "border-[#E0E7F0] hover:bg-gray-50"
                  }`}
                >
                  <TableCell className={` text-[#B3B3B3] leading-[24px] font-[500] text-[14px] ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">{item.sn}</p>
                  </TableCell>
                  <TableCell className={`${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">{item.quizName}</p>
                  </TableCell>
                  <TableCell className={`${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">{item.dateTaken}</p>
                  </TableCell>
                  <TableCell className={` flex items-center gap-1 ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">{item.score}</p> <span className="text-[14px] leading-[24px] font-[500] text-[#B3B3B3]">({item.scorePercentage}%)</span>
                  </TableCell>
                  <TableCell className={`${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    <div className="flex items-center">
                      <Image
                        src={medal05}
                        alt="medal"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span className="text-[14px] leading-[24px] font-[500] text-[#B3B3B3]">
                        +{item.xpEarned}XP
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full ${
                      item.status === "Passed" ? "bg-[#F2FFF7]" : "bg-[#FBEAE9]"
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        item.status === "Passed" ? "bg-[#0E7B33]" : "bg-[#940803]"
                      }`} />
                      <span className={`text-sm font-medium ${
                        item.status === "Passed" ? "text-[#0E7B33]" : "text-[#940803]"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className={`text-sm ${
            theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
          }`}>
            Showing {startIndex + 1} of {actualTotalItems} result
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === 1
                  ? `${
                      theme === "dark" 
                        ? "text-[#666] cursor-not-allowed" 
                        : "text-gray-400 cursor-not-allowed"
                    }`
                  : `${
                      theme === "dark"
                        ? "text-[#E0E0E0] hover:text-[#00FF80]"
                        : "text-[#2D3C52] hover:text-[#00FF80]"
                    }`
              }`}
            >
              Prev page
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isCurrentPage = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      isCurrentPage
                        ? "bg-[#00FF80] text-black"
                        : `${
                            theme === "dark"
                              ? "text-[#E0E0E0] hover:bg-[#1A1A1A]"
                              : "text-[#2D3C52] hover:bg-gray-100"
                          }`
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? `${
                      theme === "dark" 
                        ? "text-[#666] cursor-not-allowed" 
                        : "text-gray-400 cursor-not-allowed"
                    }`
                  : `${
                      theme === "dark"
                        ? "text-[#E0E0E0] hover:text-[#00FF80]"
                        : "text-[#2D3C52] hover:text-[#00FF80]"
                    }`
              }`}
            >
              Next page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
