"use client";

import { useState, useEffect } from "react";
import QuizHistory, { QuizHistoryItem } from "./QuizHistory";

/**
 * Demo component showing how to use QuizHistory with real data
 * This is just an example - replace with your actual data fetching logic
 */
export default function QuizHistoryDemo() {
  const [quizData, setQuizData] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Example of how to fetch data from your API
  const fetchQuizHistory = async (page: number = 1, searchTerm: string = "") => {
    setLoading(true);
    try {
      // Replace this with your actual API call
      // const response = await fetch(`/api/quiz-history?page=${page}&search=${searchTerm}`);
      // const data = await response.json();
      
      // Mock data for demo
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
    } catch (error) {
      console.error("Error fetching quiz history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchQuizHistory(page);
  };

  const handleSearch = (searchTerm: string) => {
    fetchQuizHistory(1, searchTerm);
  };

  // Load initial data
  useEffect(() => {
    fetchQuizHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quiz History Demo</h2>
      <QuizHistory
        data={quizData}
        totalItems={totalItems}
        loading={loading}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
