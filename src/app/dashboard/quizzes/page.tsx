"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import calendar from "@/../public/assets/icons/dark/calendar.png";
import calendarLight from "@/../public/assets/icons/calendar.png";
import medal05 from "@/../public/assets/icons/medal05.png";
import clock from "@/../public/assets/icons/dark/clock.png";
import clockLight from "@/../public/assets/icons/clock.png";
import brain02 from "@/../public/assets/icons/brain02.png";
import useUserStore from "@/../core/userState";
import usePublicQuizStore from "@/../core/publicQuizStore";
import { ChatService, Chat } from "@/../services/chat.service";
import QuizHistory from "@/components/QuizHistory";
import QuizModal from "@/../components/Quiz/QuizModal";
import type { PublicQuizListItem } from "@/../types/quizzes.types";

export default function QuizzesPage() {
  const { user, theme } = useUserStore();
  const router = useRouter();
  const myQuizzes = usePublicQuizStore((s) => s.myQuizzes);
  const publicQuizzes = usePublicQuizStore((s) => s.publicQuizzes);
  const quizError = usePublicQuizStore((s) => s.quizError);
  const fetchPublicQuizzes = usePublicQuizStore((s) => s.fetchPublicQuizzes);
  const fetchMyQuizzes = usePublicQuizStore((s) => s.fetchMyQuizzes);

  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(true);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const chatService = new ChatService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        setChatsLoading(true);
        const chatList = await chatService.getHistory(user.id);
        setChats(
          chatList.sort(
            (a: Chat, b: Chat) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          ),
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setChatsLoading(false);
      }
    };

    void fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    setListsLoading(true);
    void (async () => {
      try {
        await Promise.all([
          fetchPublicQuizzes({ limit: 50, sort: "recent" }),
          fetchMyQuizzes({ limit: 30 }),
        ]);
      } finally {
        if (!cancelled) setListsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchPublicQuizzes, fetchMyQuizzes]);

  const testedChats = chats.filter((chat) => !chat.tested);

  const handleOpenPublishedQuiz = (quizId: string) => {
    router.push(`/dashboard/quizzes/${quizId}`);
  };

  const handleStartQuiz = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsQuizModalOpen(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizModalOpen(false);
    setSelectedChatId("");
  };

  const renderPublishedCard = (quiz: PublicQuizListItem, narrow?: boolean) => (
    <div
      key={quiz.id}
      className={`${narrow ? "min-w-[280px] shrink-0" : ""} p-4 rounded-xl border flex flex-col justify-between min-h-[200px] ${
        theme === "dark"
          ? "bg-[#131313] border-[#2E3033]"
          : "bg-gray-50 border-[#E0E7F0]"
      }`}
    >
      <div>
        <div className="flex items-center mb-3">
          <Image
            src={brain02}
            alt=""
            width={20}
            height={20}
            className="rounded-full"
          />
          <p
            className={`text-base ml-2 font-medium truncate ${
              theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
            }`}
          >
            {quiz.title || "Quiz"}
          </p>
        </div>

        {quiz.description ? (
          <p
            className={`text-sm mb-4 line-clamp-3 ${
              theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
            }`}
          >
            {quiz.description}
          </p>
        ) : null}

        <p
          className={`text-sm mb-4 ${
            theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
          }`}
        >
          Published {new Date(quiz.createdAt).toLocaleDateString()}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Image src={medal05} alt="" width={16} height={16} className="mr-1" />
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
              }`}
            >
              {quiz.attemptCount} attempts
            </p>
          </div>

          <div className="flex items-center">
            <Image
              src={theme === "dark" ? clock : clockLight}
              alt=""
              width={16}
              height={16}
              className="mr-1"
            />
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
              }`}
            >
              {quiz.viewCount} views
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleOpenPublishedQuiz(quiz.id)}
        className={`w-full rounded-lg py-2 px-4 text-sm font-medium transition-colors ${
          theme === "dark"
            ? "bg-[#00FF80] text-black hover:bg-[#00CC66]"
            : "bg-black text-[#00FF80] hover:bg-gray-800"
        }`}
      >
        Start
      </button>
    </div>
  );

  return (
    <div
      className={`${theme === "dark" ? "bg-[#0D0D0D]" : "bg-[#F9FBFC]"} min-h-screen overflow-x-hidden`}
    >
      <div className="px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div className="flex flex-col">
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
              }`}
            >
              Your Quiz Hub
            </h1>
            <p
              className={`text-sm sm:text-base mt-1 ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#2D3C52]"
              }`}
            >
              Practice what you&apos;ve learned. Earn XP. Get smarter.
            </p>
          </div>
          <div
            className={`flex items-center rounded-lg border gap-2 py-2 px-3 ${
              theme === "dark"
                ? "bg-[#131313] border-[#2E3033]"
                : "bg-white border-[#EDF3FC]"
            }`}
          >
            <Image
              src={theme === "dark" ? calendar : calendarLight}
              alt=""
              width={16}
              height={16}
            />
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
              }`}
            >
              {new Date().toDateString()}
            </p>
          </div>
        </div>
      </div>

      {quizError ? (
        <div className="px-4 sm:px-6 pb-4">
          <p className="text-sm text-red-400">{quizError}</p>
        </div>
      ) : null}

      <div className="px-4 sm:px-6 pb-6 space-y-6">
        <div
          className={`rounded-2xl border p-4 sm:p-6 ${
            theme === "dark"
              ? "bg-[#131313] border-[#2E3033]"
              : "bg-white border-[#E0E7F0]"
          }`}
        >
          <h2
            className={`text-lg sm:text-xl font-semibold mb-6 ${
              theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
            }`}
          >
            From your AI sessions
          </h2>

          {listsLoading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]" />
            </div>
          ) : myQuizzes.length > 0 ? (
            <div className="w-full">
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myQuizzes.slice(0, 12).map((q) => renderPublishedCard(q))}
              </div>
              <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {myQuizzes.map((q) => renderPublishedCard(q, true))}
              </div>
            </div>
          ) : (
            <div
              className={`text-center w-full py-8 ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
              }`}
            >
              <p className="text-base">No published quizzes yet.</p>
              <p className="text-sm mt-2">
                Publish a quiz from chat or explore community quizzes below.
              </p>
            </div>
          )}
        </div>

        <div
          className={`rounded-2xl border p-4 sm:p-6 ${
            theme === "dark"
              ? "bg-[#131313] border-[#2E3033]"
              : "bg-white border-[#E0E7F0]"
          }`}
        >
          <h2
            className={`text-lg sm:text-xl font-semibold mb-6 ${
              theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
            }`}
          >
            Community quizzes
          </h2>

          {listsLoading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]" />
            </div>
          ) : publicQuizzes.length > 0 ? (
            <div className="w-full">
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicQuizzes.slice(0, 12).map((q) => renderPublishedCard(q))}
              </div>
              <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {publicQuizzes.map((q) => renderPublishedCard(q, true))}
              </div>
            </div>
          ) : (
            <div
              className={`text-center py-8 ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
              }`}
            >
              No community quizzes yet.
            </div>
          )}
        </div>

        <div
          className={`rounded-2xl border p-4 sm:p-6 ${
            theme === "dark"
              ? "bg-[#131313] border-[#2E3033]"
              : "bg-white border-[#E0E7F0]"
          }`}
        >
          <h2
            className={`text-lg sm:text-xl font-semibold mb-2 ${
              theme === "dark" ? "text-[#E0E0E0]" : "text-[#2D3C52]"
            }`}
          >
            Generate quiz from a chat
          </h2>
          <p
            className={`text-sm mb-6 ${
              theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
            }`}
          >
            Quick AI-generated quiz from your conversation (separate from published quizzes).
          </p>

          {chatsLoading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]" />
            </div>
          ) : testedChats.length > 0 ? (
            <div className="w-full">
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testedChats.slice(0, 3).map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between min-h-[200px] ${
                      theme === "dark"
                        ? "bg-[#131313] border-[#2E3033]"
                        : "bg-gray-50 border-[#E0E7F0]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center mb-3">
                        <Image
                          src={brain02}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <p
                          className={`text-base ml-2 font-medium truncate ${
                            theme === "dark"
                              ? "text-[#E0E0E0]"
                              : "text-[#2D3C52]"
                          }`}
                        >
                          {chat.title || "Untitled Chat"}
                        </p>
                      </div>

                      <p
                        className={`text-sm mb-4 ${
                          theme === "dark"
                            ? "text-[#B3B3B3]"
                            : "text-[#61728C]"
                        }`}
                      >
                        From your chat on{" "}
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Image
                            src={medal05}
                            alt=""
                            width={16}
                            height={16}
                            className="mr-1"
                          />
                          <p
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-[#E0E0E0]"
                                : "text-[#2D3C52]"
                            }`}
                          >
                            Earn up to 5 XP
                          </p>
                        </div>

                        <div className="flex items-center">
                          <Image
                            src={theme === "dark" ? clock : clockLight}
                            alt=""
                            width={16}
                            height={16}
                            className="mr-1"
                          />
                          <p
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-[#E0E0E0]"
                                : "text-[#2D3C52]"
                            }`}
                          >
                            ~ 1 min
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartQuiz(chat.id)}
                      className={`w-full rounded-lg py-2 px-4 text-sm font-medium transition-colors ${
                        theme === "dark"
                          ? "bg-[#00FF80] text-black hover:bg-[#00CC66]"
                          : "bg-black text-[#00FF80] hover:bg-gray-800"
                      }`}
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>

              <div className="sm:hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                  {testedChats.slice(0, 3).map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex-shrink-0 w-[280px] p-4 rounded-xl border flex flex-col justify-between min-h-[180px] ${
                        theme === "dark"
                          ? "bg-[#1A1A1A] border-[#2E3033]"
                          : "bg-gray-50 border-[#E0E7F0]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center mb-3">
                          <Image
                            src={brain02}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <p
                            className={`text-[18px] leading-[26px] ml-2 font-medium truncate ${
                              theme === "dark"
                                ? "text-[#E0E0E0]"
                                : "text-[#2D3C52]"
                            }`}
                          >
                            {chat.title || "Untitled Chat"}
                          </p>
                        </div>

                        <p
                          className={`text-[16px] leading-[24px] font-[400] mb-4 ${
                            theme === "dark"
                              ? "text-[#B3B3B3]"
                              : "text-[#61728C]"
                          }`}
                        >
                          From your chat on{" "}
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <Image
                              src={medal05}
                              alt=""
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            <p
                              className={`text-[14px] leading-[24px] font-[500] ${
                                theme === "dark"
                                  ? "text-[#E0E0E0]"
                                  : "text-[#2D3C52]"
                              }`}
                            >
                              Earn up to 5 XP
                            </p>
                          </div>

                          <div className="flex items-center">
                            <Image
                              src={theme === "dark" ? clock : clockLight}
                              alt=""
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            <p
                              className={`text-[14px] leading-[24px] font-[500] ${
                                theme === "dark"
                                  ? "text-[#E0E0E0]"
                                  : "text-[#2D3C52]"
                              }`}
                            >
                              ~ 1 min
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartQuiz(chat.id)}
                        className={`w-full rounded-[8px] py-[10px] px-[16px] text-[14px] font-[500] transition-colors leading-[24px] ${
                          theme === "dark"
                            ? "bg-[#00FF80] text-black hover:bg-[#00CC66]"
                            : "bg-black text-[#00FF80] hover:bg-gray-800"
                        }`}
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`text-center w-full py-12 ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#61728C]"
              }`}
            >
              <p className="text-lg">No chats available for quick quiz.</p>
              <p className="text-sm mt-2">
                Start chatting with AI to generate quizzes from a conversation.
              </p>
            </div>
          )}
        </div>
      </div>

      <QuizHistory />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={handleCloseQuiz}
        chatId={selectedChatId}
      />

      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #00ff80;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #00cc66;
        }
      `}</style>
    </div>
  );
}
