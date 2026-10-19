"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft } from "lucide-react";
import Trophy from "@/../public/assets/icons/Trophy.png";
import usePublicQuizStore from "../../../../../core/publicQuizStore";
import useUserStore from "../../../../../core/userState";

type QuestionShape = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

type UserAnswer = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export default function PublicQuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId =
    typeof params?.id === "string" ? params.id : params?.id?.[0] ?? "";

  const userId = useUserStore((s) => s.user?.id);
  const theme = useUserStore((s) => s.theme);
  const updateUserPointsFromQuiz = useUserStore(
    (s) => s.updateUserPointsFromQuiz,
  );

  const fetchQuiz = usePublicQuizStore((s) => s.fetchQuiz);
  const joinQuiz = usePublicQuizStore((s) => s.joinQuiz);
  const submitQuiz = usePublicQuizStore((s) => s.submitQuiz);
  const quizMap = usePublicQuizStore((s) => s.quiz);
  const quizLoading = usePublicQuizStore((s) => s.quizLoading);
  const quizError = usePublicQuizStore((s) => s.quizError);
  const clearParticipation = usePublicQuizStore((s) => s.clearParticipation);

  const detail = quizId ? quizMap[quizId] : undefined;
  const loading = quizId ? quizLoading[quizId] : false;

  const questions: QuestionShape[] = useMemo(() => {
    const list = detail?.questions;
    if (!list?.length) return [];
    return list.map((q) => ({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  }, [detail]);

  const [sessionReady, setSessionReady] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    [],
  );
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resultScore, setResultScore] = useState(0);
  const [resultXp, setResultXp] = useState(0);
  const [resultUserAnswers, setResultUserAnswers] = useState<UserAnswer[]>(
    [],
  );

  const initRef = useRef<string | null>(null);
  const handleFinishRef = useRef<(() => Promise<void>) | undefined>(undefined);

  useEffect(() => {
    initRef.current = null;
  }, [quizId]);

  useEffect(() => {
    return () => {
      if (quizId) clearParticipation(quizId);
    };
  }, [quizId, clearParticipation]);

  useEffect(() => {
    if (!quizId || !userId) return;
    let cancelled = false;
    setSessionReady(false);
    (async () => {
      try {
        await fetchQuiz(quizId);
        if (cancelled) return;
        await joinQuiz(quizId);
        if (!cancelled) setSessionReady(true);
      } catch {
        if (!cancelled) setSessionReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId, userId, fetchQuiz, joinQuiz]);

  useEffect(() => {
    if (!quizId || !detail?.questions?.length) return;
    if (initRef.current === quizId) return;
    initRef.current = quizId;
    setSelectedAnswers(detail.questions.map(() => null));
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setReviewAnswers(false);
    setTimerStarted(false);
    setTimeLeft(90);
    setSubmitError(null);
    setResultUserAnswers([]);
  }, [quizId, detail]);

  useEffect(() => {
    if (
      questions.length > 0 &&
      sessionReady &&
      !loading &&
      !quizCompleted &&
      !timerStarted
    ) {
      const t = setTimeout(() => setTimerStarted(true), 1000);
      return () => clearTimeout(t);
    }
  }, [questions.length, sessionReady, loading, quizCompleted, timerStarted]);

  useEffect(() => {
    if (quizCompleted || !timerStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          void handleFinishRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizCompleted, timerStarted]);

  const selectAnswer = useCallback((option: string) => {
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = option;
      return next;
    });
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(
        Math.max(0, Math.min(index, questions.length - 1)),
      );
    },
    [questions.length],
  );

  const handleFinish = useCallback(async () => {
    if (
      !quizId ||
      !userId ||
      !questions.length ||
      isSubmitting ||
      quizCompleted
    )
      return;
    const participationId =
      usePublicQuizStore.getState().participationByQuiz[quizId];
    if (!participationId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await submitQuiz(quizId, {
        userId,
        participationId,
        answers: questions.map((_, i) => ({
          questionIndex: i,
          selectedAnswer: selectedAnswers[i] ?? "",
        })),
      });

      updateUserPointsFromQuiz(response.xpEarned);
      const ua: UserAnswer[] = response.results.map((r) => ({
        question: questions[r.questionIndex]?.question ?? "",
        selectedAnswer: r.selectedAnswer,
        correctAnswer: r.correctAnswer,
        isCorrect: r.isCorrect,
      }));
      setResultUserAnswers(ua);
      setResultScore(response.score);
      setResultXp(response.xpEarned);
      setQuizCompleted(true);
    } catch {
      setSubmitError(
        usePublicQuizStore.getState().quizError ?? "Could not submit quiz",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    quizId,
    userId,
    questions,
    isSubmitting,
    quizCompleted,
    selectedAnswers,
    submitQuiz,
    updateUserPointsFromQuiz,
  ]);

  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  const retryLoad = useCallback(async () => {
    if (!quizId || !userId) return;
    setSessionReady(false);
    try {
      await fetchQuiz(quizId);
      await joinQuiz(quizId);
      setSessionReady(true);
    } catch {
      setSessionReady(false);
    }
  }, [quizId, userId, fetchQuiz, joinQuiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}M : ${secs < 10 ? "0" : ""}${secs}S`;
  };

  const dark = theme === "dark";

  if (!quizId) {
    return (
      <div
        className={`min-h-screen p-6 ${dark ? "bg-[#0D0D0D] text-[#E0E0E0]" : ""}`}
      >
        Invalid quiz.
      </div>
    );
  }

  if (!userId) {
    return (
      <div
        className={`min-h-screen p-6 ${dark ? "bg-[#0D0D0D] text-[#E0E0E0]" : ""}`}
      >
        Sign in to take this quiz.
      </div>
    );
  }

  if (quizError && !sessionReady) {
    return (
      <div
        className={`min-h-screen px-4 py-8 ${dark ? "bg-[#0D0D0D]" : "bg-[#F9FBFC]"}`}
      >
        <div className="mx-auto max-w-lg rounded-2xl border border-[#2E3033] bg-[#131313] p-8 text-center">
          <p className="text-[#B3B3B3]">{quizError}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => retryLoad()}
              className="rounded-lg bg-[#00FF80] px-4 py-2 text-sm font-semibold text-black"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/quizzes")}
              className="rounded-lg border border-[#2E3033] px-4 py-2 text-sm text-[#E0E0E0]"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (
    !quizCompleted &&
    !quizError &&
    !isSubmitting &&
    (!detail || loading || !sessionReady)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#00FF80] border-t-transparent" />
          <p className="text-[#B3B3B3]">Loading quiz…</p>
        </div>
      </div>
    );
  }

  if (!loading && detail && !questions.length) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-6 text-[#B3B3B3]">
        No questions available.
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div
        className={`min-h-screen px-4 py-8 ${dark ? "bg-[#0D0D0D]" : "bg-[#F9FBFC]"}`}
      >
        <div className="mx-auto max-w-xl">
          <Link
            href="/dashboard/quizzes"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#00FF80]"
          >
            <ChevronLeft className="h-4 w-4" />
            Quizzes
          </Link>
          <div className="rounded-2xl border border-[#2E3033] bg-[#131313] p-8 text-center">
            <Image src={Trophy} alt="" width={64} height={64} className="mx-auto" />
            <h1 className="mt-4 text-2xl font-semibold text-[#E0E0E0]">
              Quiz Results
            </h1>
            <p className="mt-2 text-[#00FF80]">
              Score: {resultScore} / {questions.length}
            </p>
            <p className="mt-1 text-sm text-[#B3B3B3]">+{resultXp} XP</p>
            <button
              type="button"
              onClick={() => setReviewAnswers(!reviewAnswers)}
              className="mt-6 text-sm text-[#00FF80] underline"
            >
              {reviewAnswers ? "Hide review" : "Review answers"}
            </button>
            {reviewAnswers ? (
              <ul className="mt-6 space-y-4 text-left">
                {resultUserAnswers.map((a, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-[#2E3033] bg-[#1A1A1A] p-4 text-sm"
                  >
                    <p className="font-medium text-[#E0E0E0]">{a.question}</p>
                    <p className="mt-2 text-[#B3B3B3]">
                      Your answer: {a.selectedAnswer || "(none)"}
                    </p>
                    <p className="text-[#B3B3B3]">Correct: {a.correctAnswer}</p>
                    <p
                      className={
                        a.isCorrect ? "mt-2 text-[#00FF80]" : "mt-2 text-red-400"
                      }
                    >
                      {a.isCorrect ? "Correct" : "Incorrect"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
            <button
              type="button"
              onClick={() => router.push("/dashboard/quizzes")}
              className="mt-8 w-full rounded-lg bg-[#00FF80] py-3 font-semibold text-black"
            >
              Back to quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestionIndex];
  const progress = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  return (
    <div
      className={`min-h-screen px-4 py-6 ${dark ? "bg-[#0D0D0D]" : "bg-[#F9FBFC]"}`}
    >
      <div className="mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-2 text-sm text-[#00FF80]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <span
            className={`text-sm ${timeLeft < 10 ? "text-red-500" : "text-[#E0E0E0]"}`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>

        {submitError ? (
          <p className="mb-4 text-center text-sm text-red-400">{submitError}</p>
        ) : null}

        <div className="mb-4 rounded-xl border border-[#2E3033] bg-[#131313] px-4 py-3">
          <div className="mb-2 flex justify-between text-xs text-[#B3B3B3]">
            <span>
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#2E3033]">
            <div
              className="h-2 rounded-full bg-[#00FF80] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {q ? (
          <div className="rounded-2xl border border-[#2E3033] bg-[#131313] p-6">
            <h2 className="text-lg font-medium text-[#E0E0E0]">{q.question}</h2>
            <div className="mt-6 space-y-3">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectAnswer(opt)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    selectedAnswers[currentQuestionIndex] === opt
                      ? "border-[#00FF80] bg-[#00FF80]/10 text-[#E0E0E0]"
                      : "border-[#2E3033] bg-[#1A1A1A] text-[#E0E0E0] hover:border-[#444]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                className="flex-1 rounded-lg border border-[#2E3033] py-3 text-[#E0E0E0] disabled:opacity-40"
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  className="flex-1 rounded-lg bg-[#00FF80] py-3 font-semibold text-black"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinish()}
                  className="flex-1 rounded-lg bg-[#00FF80] py-3 font-semibold text-black disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting…" : "Finish"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[#B3B3B3]">Loading…</p>
        )}
      </div>
    </div>
  );
}
