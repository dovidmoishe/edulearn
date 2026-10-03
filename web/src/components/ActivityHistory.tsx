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

export interface ActivityHistoryItem {
  id: string;
  sn: number;
  actionDescription: string;
  xpEarned: number;
  date: string;
  type: 'quiz' | 'chat' | 'streak' | 'referral';
}

interface ActivityHistoryProps {
  data?: ActivityHistoryItem[];
  totalItems?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'quiz':
      return '📝';
    case 'chat':
      return '💬';
    case 'streak':
      return '🔥';
    case 'referral':
      return '👥';
    default:
      return '⭐';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'quiz':
      return 'Quiz';
    case 'chat':
      return 'Chat';
    case 'streak':
      return 'Streak';
    case 'referral':
      return 'Referral';
    default:
      return 'Activity';
  }
};

const mockActivityHistory: ActivityHistoryItem[] = [
  {
    id: "1",
    sn: 1,
    actionDescription: "Completed Algebra Quiz",
    xpEarned: 70,
    date: "June 20, 2025",
    type: "quiz"
  },
  {
    id: "2",
    sn: 2,
    actionDescription: "Chatted with AI Tutor",
    xpEarned: 70,
    date: "June 20, 2025",
    type: "chat"
  },
  {
    id: "3",
    sn: 3,
    actionDescription: "3-day XP Streak Bonus",
    xpEarned: 70,
    date: "June 18, 2025",
    type: "streak"
  },
  {
    id: "4",
    sn: 4,
    actionDescription: "Chatted with AI Tutor",
    xpEarned: 70,
    date: "June 18, 2025",
    type: "chat"
  },
  {
    id: "5",
    sn: 5,
    actionDescription: "Referred a Friend",
    xpEarned: 70,
    date: "June 17, 2025",
    type: "referral"
  }
];

export default function ActivityHistory({ 
  data = mockActivityHistory, 
  totalItems = 25, 
  loading = false,
  onPageChange,
  onSearch 
}: ActivityHistoryProps) {
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

  const transformActivitiesToActivityHistory = (activities: Activity[]): ActivityHistoryItem[] => {
    return activities.map((activity, index) => {
      const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return {
        id: activity.id,
        sn: index + 1,
        actionDescription: activity.title,
        xpEarned: activity.xpEarned,
        date: date,
        type: activity.type
      };
    });
  };

  const activityHistoryData = activities.length > 0 ? transformActivitiesToActivityHistory(activities) : data;
  const actualLoading = isLoading || loading;

  const filteredData = activityHistoryData.filter(item =>
    item.actionDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actualTotalItems = filteredData.length;
  const totalPages = Math.ceil(actualTotalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className={`text-[20px] leading-[30px] font-medium ${
          theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
        }`}>
          XP Earning History
        </h2>
        
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
            placeholder="Search activities..."
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
        ) : currentData.length > 0 ? (
          <>
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
                    Action Description
                  </TableHead>
                  <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                  }`}>
                    XP Earned
                  </TableHead>
                  <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                  }`}>
                    Date
                  </TableHead>
                  <TableHead className={`font-[500] leading-[24px] text-[16px] ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#61728C]"
                  }`}>
                    Type
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow 
                    key={item.id}
                    className={`h-16 px-6 ${
                      theme === "dark" 
                        ? "border-[#2E3033] hover:bg-[#1A1A1A]" 
                        : "border-[#E0E7F0] hover:bg-gray-50"
                    }`}
                  >
                    <TableCell className={`${
                      theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                    }`}>
                      <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">
                        {startIndex + index + 1}
                      </p>
                    </TableCell>
                    <TableCell className={`${
                      theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                    }`}>
                      <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">
                        {item.actionDescription}
                      </p>
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
                        <span className="text-[14px] leading-[24px] font-[500] text-[#E0E0E0]">
                          +{item.xpEarned}XP
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={`${
                      theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                    }`}>
                      <p className="text-[14px] text-[#B3B3B3] leading-[24px] font-[500]">
                        {item.date}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full ${
                        theme === "dark" ? "bg-[#1A1A1A]" : "bg-gray-100"
                      }`}>
                        <span className="mr-2 text-sm">
                          {getTypeIcon(item.type)}
                        </span>
                        <span className={`text-sm font-medium ${
                          theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                        }`}>
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center p-6 border-t border-[#2E3033]">
              <div className={`text-sm ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
              }`}>
                Showing {Math.min(startIndex + 1, actualTotalItems)} of {actualTotalItems} result{actualTotalItems !== 1 ? 's' : ''}
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
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const start = Math.max(1, currentPage - 2);
                      const end = Math.min(totalPages, start + 4);
                      pageNum = start + i;
                      if (pageNum > end) return null;
                    }
                    
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
          </>
        ) : (
          <div className={`text-center w-full py-12 ${
            theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
          }`}>
            <p className="text-lg">No activity history found.</p>
            <p className="text-sm mt-2">
              {searchTerm ? "Try adjusting your search terms." : "Start earning XP to see your activity history!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
