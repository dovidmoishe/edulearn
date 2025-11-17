"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Trophy from '@/../public/assets/icons/Trophy.png';
import TrophyRed from '@/../public/assets/icons/Trophy-red.png';
import medal05 from '@/../public/assets/icons/medal05.png';
import useUserStore from '@/../core/userState';
import useActivityStore from '@/../core/activityState';
import { AIService } from '@/../services/ai.service';
import { ChatService } from '@/../services/chat.service';
import { ActivityService } from '@/../services/activity.service';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface UserAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, chatId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(80);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewAnswers, setReviewAnswers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<(string | null)[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, theme } = useUserStore();
  const { addActivity } = useActivityStore();

  const aiService = new AIService();
  const chatService = new ChatService();
  const activityService = new ActivityService();

  const handleFinishQuizRef = useRef<(() => Promise<void>) | undefined>(undefined);

  useEffect(() => {
    if (questions.length > 0 && !loading && !error && !timerStarted && !quizCompleted) {
      const delayTimer = setTimeout(() => {
        setTimerStarted(true);
      }, 2000);

      return () => clearTimeout(delayTimer);
    }
  }, [questions.length, loading, error, timerStarted, quizCompleted]);

  useEffect(() => {
    if (quizCompleted || !timerStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleFinishQuizRef.current?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted, timerStarted]);

  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const chat = await chatService.getChatById(chatId);
          if (chat && chat.title) {
            setChatTitle(chat.title);
          } else {
            setChatTitle("Quiz");
          }
        } catch (chatError) {
          console.error("Error fetching chat:", chatError);
          setChatTitle("Quiz");
        }

        const response = await aiService.generateQuiz({
          chatId,
          userId: user.id,
        });

        if (Array.isArray(response) && response.length > 0) {
          setQuestions(response);
          setQuestionAnswers(new Array(response.length).fill(null));
        } else {
          console.error("No questions returned from API");
          setError("No quiz questions could be generated from this conversation. Please ensure you had an educational discussion and try again.");
        }

        setLoading(false);
      } catch (error: unknown) {
        console.error("Error fetching quiz questions:", error);
        setLoading(false);
        
        const err = error as { name?: string; message?: string };
        if (err.name === 'QuizGenerationError' && err.message) {
          setError(err.message);
        } else {
          setError("Something went wrong while generating your quiz. Please try again later.");
        }
      }
    };

    fetchQuestions();
  }, [isOpen, chatId, user?.id, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setTimeLeft(60);
      setUserAnswers([]);
      setSelectedOption(null);
      setChatTitle("");
      setQuizCompleted(false);
      setScore(0);
      setReviewAnswers(false);
      setError(null);
      setQuestionAnswers([]);
      setTimerStarted(false);
      setRetryCount(0);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}M : ${secs < 10 ? "0" : ""}${secs}S`;
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    const updatedAnswers = [...questionAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setQuestionAnswers(updatedAnswers);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedOption(questionAnswers[currentQuestionIndex - 1]);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(questionAnswers[currentQuestionIndex + 1] || null);
    }
  };

  const handleFinishQuiz = async () => {
    if (!questions.length || isSubmitting) return;

    setIsSubmitting(true);

    const quizAnswers = questions.map((question, index) => ({
      question: question.question,
      selectedAnswer: questionAnswers[index] || '',
      correctAnswer: question.correctAnswer,
    }));

    try {
      const result = await activityService.submitQuiz({
        userId: user?.id as string,
        chatId: chatId,
        title: chatTitle || "Quiz",
        answers: quizAnswers,
      });

      const userAnswersList: UserAnswer[] = result.validatedAnswers.map((answer: { question: string; selectedAnswer: string; correctAnswer: string; isCorrect: boolean }) => ({
        question: answer.question,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect,
      }));

      setUserAnswers(userAnswersList);
      setScore(result.score);
      setQuizCompleted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setQuizCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    handleFinishQuizRef.current = handleFinishQuiz;
  }, [handleFinishQuiz]);

  const calculateProgress = () => {
    if (!questions.length) return 0;
    const progress = (currentQuestionIndex + 1) / questions.length;
    return Math.min(Math.max(progress, 0), 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-xl mx-4 max-h-[85vh] flex flex-col rounded-2xl ${
        theme === "dark" ? "bg-[#0D0D0D]" : "bg-white"
      }`}>
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === "dark" ? "border-[#2E3033]" : "border-[#E0E7F0]"
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === "dark" ? "hover:bg-[#1A1A1A]" : "hover:bg-gray-100"
              }`}
            >
              <X className={`w-5 h-5 ${theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"}`} />
            </button>
            <h2 className={`text-xl font-semibold ${
              theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
            }`}>
              {quizCompleted ? "Quiz Results" : "Quiz"}
            </h2>
          </div>
          
          {!quizCompleted && questions.length > 0 && (
            <div className={`text-sm font-medium ${
              timeLeft < 10 ? "text-red-500" : theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
            }`}>
              Time Left: {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {!quizCompleted && questions.length > 0 && (
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"}`}>
                Question
              </span>
              <span className={`text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"}`}>
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              theme === "dark" ? "bg-[#2E3033]" : "bg-[#EDF3FC]"
            }`}>
              <div 
                className="h-2 rounded-full bg-[#00FF80] transition-all duration-300"
                style={{ width: `${calculateProgress() * 100}%` }}
              />
            </div>
          </div>
        )}

        
        <div className="flex-1 p-4 overflow-y-auto min-h-0 custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80] mb-4"></div>
              <p className={`text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"}`}>
                Loading quiz questions...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <p className={`text-sm mb-2 ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"}`}>
                {error}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    theme === "dark" 
                      ? "bg-[#00FF80] text-black hover:bg-[#00E673]" 
                      : "bg-[#00FF80] text-black hover:bg-[#00E673]"
                  }`}
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    theme === "dark" 
                      ? "bg-[#131313] text-[#E0E0E0] border border-[#2E3033] hover:bg-[#1A1A1A]" 
                      : "bg-white text-[#2D3C52] border border-[#E0E7F0] hover:bg-gray-50"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!loading && !error && questions.length > 0 && !quizCompleted && (
            <div className="pb-4">
              <div className={`p-4 rounded-xl ${
                theme === "dark" ? "bg-[#131313] border border-[#2E3033]" : "bg-[#F9FBFC] border border-[#E0E7F0]"
              }`}>
                <h3 className={`text-lg font-medium mb-4 ${
                  theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                }`}>
                  {questions[currentQuestionIndex]?.question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestionIndex]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all ${
                        selectedOption === option
                          ? theme === "dark"
                            ? "bg-[#00FF80]/10 border-2 border-[#00FF80]"
                            : "bg-[#00FF80]/10 border-2 border-[#00FF80]"
                          : theme === "dark"
                            ? "bg-[#131313] border border-[#2E3033] hover:bg-[#1A1A1A]"
                            : "bg-white border border-[#E0E7F0] hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option
                          ? "border-[#00FF80] bg-[#00FF80]"
                          : theme === "dark"
                            ? "border-[#B3B3B3]"
                            : "border-[#61728C]"
                      }`}>
                        {selectedOption === option && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                      }`}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {quizCompleted && (
            <div className="text-center pb-4">
              {!reviewAnswers ? (
                <>
                  <Image
                    src={score >= questions.length / 2 ? Trophy : TrophyRed}
                    alt="Trophy"
                    width={120}
                    height={120}
                    className="mx-auto mb-6"
                  />
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    Quiz Result
                  </h3>
                  
                  {score < questions.length / 2 && (
                    <p className={`text-sm mb-6 ${
                      theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                    }`}>
                      Don&apos;t worry, learning is a journey.
                    </p>
                  )}

                  <div className="mb-6">
                    <p className={`text-sm mb-2 ${theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"}`}>
                      Your Score
                    </p>
                    <p className={`text-4xl font-bold ${
                      theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                    }`}>
                      {score}/{questions.length}
                    </p>
                  </div>

                  <p className={`text-sm mb-6 max-w-md mx-auto ${
                    theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
                  }`}>
                    {score >= questions.length / 2
                      ? "You're one step closer to your next badge. Keep the momentum going! Want to sharpen your skills even more? Try a follow-up quiz or review your answers."
                      : `You got ${score} out of ${questions.length}, which means there's room to grow. You still earned ${score} XP just for trying, and now you know where to improve. Review your answers and give it another go. You've got this!`}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Image src={medal05} alt="XP" width={24} height={24} />
                    <span className={`text-lg font-semibold ${
                      theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                    }`}>
                      +{score}XP
                    </span>
                  </div>
                </>
              ) : (
                <div className={`p-6 rounded-xl ${
                  theme === "dark" ? "bg-[#131313] border border-[#2E3033]" : "bg-[#F9FBFC] border border-[#E0E7F0]"
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                  }`}>
                    Your Answers:
                  </h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userAnswers.map((answer, index) => (
                      <div key={index} className={`p-4 rounded-lg ${
                        theme === "dark" ? "bg-[#0D0D0D] border border-[#2E3033]" : "bg-white border border-[#E0E7F0]"
                      }`}>
                        <p className={`text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
                        }`}>
                          {index + 1}. {answer.question}
                        </p>
                        <div className="space-y-1">
                          <p className={`text-sm ${
                            answer.isCorrect ? "text-[#00FF80]" : "text-red-500"
                          }`}>
                            Your answer: {answer.selectedAnswer ? answer.selectedAnswer : <span className="italic opacity-60">Not answered</span>}
                          </p>
                          {!answer.isCorrect && (
                            <p className="text-sm text-[#00FF80]">
                              Correct answer: {answer.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!loading && !error && questions.length > 0 && (
          <div className={`flex-shrink-0 p-4 border-t ${
            theme === "dark" ? "border-[#2E3033]" : "border-[#E0E7F0]"
          }`}>
            {!quizCompleted ? (
              <div className="flex gap-3">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    currentQuestionIndex === 0
                      ? theme === "dark"
                        ? "bg-[#131313] text-[#666] cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "bg-[#131313] text-[#00FF80] border border-[#00FF80] hover:bg-[#1A1A1A]"
                        : "bg-white text-[#00FF80] border border-[#00FF80] hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 inline mr-2 text-[#00FF80]" />
                  Previous
                </button>
                
                <button
                  onClick={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : handleFinishQuiz}
                  disabled={!selectedOption || isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    !selectedOption || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-[#00FF80] text-black hover:bg-[#00E673]"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
                  {!isSubmitting && <ChevronRight className="w-4 h-4 inline ml-2" />}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewAnswers(!reviewAnswers)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    theme === "dark"
                      ? "bg-[#131313] text-[#E0E0E0] border border-[#2E3033] hover:bg-[#1A1A1A]"
                      : "bg-white text-[#2D3C52] border border-[#E0E7F0] hover:bg-gray-50"
                  }`}
                >
                  {reviewAnswers ? "Hide Answers" : "Review Answers"}
                </button>
                
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-[#00FF80] text-black hover:bg-[#00E673] transition-all"
                >
                  Return to Quizzes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#2E3033" : "#EDF3FC"};
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00FF80;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00CC66;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #00FF80 ${theme === "dark" ? "#2E3033" : "#EDF3FC"};
        }
      `}</style>
    </div>
  );
};

export default QuizModal;
