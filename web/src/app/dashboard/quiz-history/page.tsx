"use client";

import { useState, useEffect } from "react";
import QuizHistory, { QuizHistoryItem } from "@/components/QuizHistory";

export default function QuizHistoryPage() {
  const [quizData, setQuizData] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Simulate API call
  useEffect(() => {
    const fetchQuizHistory = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockData: QuizHistoryItem[] = [
        {
          id: "1",
          sn: 1,
          quizName: "Osmosis",
          dateTaken: "23 June 2025",
          score: "7/10",
          scorePercentage: 70,
          xpEarned: 70,
          status: "Passed"
        },
        {
          id: "2", 
          sn: 2,
          quizName: "Photosynthesis",
          dateTaken: "22 June 2025",
          score: "2/10",
          scorePercentage: 20,
          xpEarned: 2,
          status: "Failed"
        },
        {
          id: "3",
          sn: 3,
          quizName: "Cell Division", 
          dateTaken: "21 June 2025",
          score: "8/10",
          scorePercentage: 80,
          xpEarned: 80,
          status: "Passed"
        },
        {
          id: "4",
          sn: 4,
          quizName: "Genetics",
          dateTaken: "20 June 2025", 
          score: "6/10",
          scorePercentage: 60,
          xpEarned: 60,
          status: "Passed"
        },
        {
          id: "5",
          sn: 5,
          quizName: "Ecosystems",
          dateTaken: "19 June 2025",
          score: "9/10", 
          scorePercentage: 90,
          xpEarned: 90,
          status: "Passed"
        }
      ];
      
      setQuizData(mockData);
      setTotalItems(25); // Mock total
      setLoading(false);
    };

    fetchQuizHistory();
  }, []);

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    // Implement pagination logic here
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Search term:", searchTerm);
    // Implement search logic here
  };

  return (
    <QuizHistory
      data={quizData}
      totalItems={totalItems}
      loading={loading}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
    />
  );
}
