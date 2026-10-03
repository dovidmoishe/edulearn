"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Lock, Play, X } from "lucide-react";
import useRoadmapStore from "../../../../../core/roadmapStore";
import useUserStore from "../../../../../core/userState";
import type {
  RoadmapStep,
  RoadmapSubStep,
  RoadmapVerificationQuestion,
  RoadmapWithSteps,
  StartRoadmapVerificationResponse,
} from "../../../../../interfaces/Roadmap";

type VerificationResult = {
  score: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
};

const getActiveSubStepId = (steps: RoadmapStep[]) => {
  for (const step of steps) {
    const next = step.subSteps.find((subStep) => !subStep.done);
    if (next) return next.id;
  }
  return null;
};

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0] ?? "";
  const user = useUserStore((s) => s.user);
  const theme = useUserStore((s) => s.theme);
  const fetchRoadmapById = useRoadmapStore((s) => s.fetchRoadmapById);
  const startRoadmapStep = useRoadmapStore((s) => s.startRoadmapStep);
  const startSubStepVerification = useRoadmapStore(
    (s) => s.startSubStepVerification,
  );
  const submitSubStepVerification = useRoadmapStore(
    (s) => s.submitSubStepVerification,
  );
  const cached = useRoadmapStore((s) =>
    id ? s.roadmapWithStepsById[id] : undefined,
  );
  const [data, setData] = useState<RoadmapWithSteps | undefined>(cached);
  const [loading, setLoading] = useState(!cached);
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);
  const [startingStepId, setStartingStepId] = useState<string | null>(null);
  const [verification, setVerification] =
    useState<StartRoadmapVerificationResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [verifyingSubStepId, setVerifyingSubStepId] = useState<string | null>(
    null,
  );
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [submittingVerification, setSubmittingVerification] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const fromStore = useRoadmapStore.getState().roadmapWithStepsById[id];
      if (fromStore) {
        setData(fromStore);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await fetchRoadmapById(id);
      if (!cancelled) {
        setData(res ?? undefined);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchRoadmapById]);

  const openChat = useCallback(() => {
    const chatId = data?.roadmap.chatId;
    if (chatId) router.push(`/dashboard/chat/${chatId}`);
  }, [data?.roadmap.chatId, router]);

  const activeSubStepId = useMemo(
    () => (data ? getActiveSubStepId(data.steps) : null),
    [data],
  );

  const refreshRoadmap = useCallback(async () => {
    if (!id) return;
    const res = await fetchRoadmapById(id);
    setData(res ?? undefined);
  }, [id, fetchRoadmapById]);

  const startStep = useCallback(
    async (stepId: string) => {
      if (!user?.id) return;
      setStartingStepId(stepId);
      try {
        const response = await startRoadmapStep(stepId, user.id);
        if ("status" in response) {
          setQueuedMessage(response.message);
          return;
        }
        openChat();
      } catch {
        alert("Could not start step");
      } finally {
        setStartingStepId(null);
      }
    },
    [user?.id, startRoadmapStep, openChat],
  );

  const beginVerification = useCallback(
    async (subStep: RoadmapSubStep) => {
      if (!user?.id) return;
      setVerifyingSubStepId(subStep.id);
      setVerificationError(null);
      setVerificationResult(null);
      setSelectedAnswers({});
      try {
        const response = await startSubStepVerification(subStep.id, user.id);
        setVerification(response);
      } catch (error) {
        setVerificationError(
          error instanceof Error
            ? error.message
            : "Could not start verification",
        );
      } finally {
        setVerifyingSubStepId(null);
      }
    },
    [user?.id, startSubStepVerification],
  );

  const submitVerification = useCallback(async () => {
    if (!verification || !user?.id) return;
    setSubmittingVerification(true);
    setVerificationError(null);
    try {
      const response = await submitSubStepVerification(
        verification.quiz.id,
        user.id,
        verification.quiz.questions.map((_, index) => ({
          questionIndex: index,
          selectedAnswer: selectedAnswers[index] ?? "",
        })),
      );
      setVerificationResult(response);
      if (response.passed) {
        await refreshRoadmap();
      }
    } catch (error) {
      setVerificationError(
        error instanceof Error ? error.message : "Could not submit verification",
      );
    } finally {
      setSubmittingVerification(false);
    }
  }, [
    verification,
    user?.id,
    selectedAnswers,
    submitSubStepVerification,
    refreshRoadmap,
  ]);

  const closeVerification = () => {
    setVerification(null);
    setVerificationResult(null);
    setVerificationError(null);
    setSelectedAnswers({});
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-6 text-[#E0E0E0]">
        Invalid roadmap.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#00FF80]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-6 text-[#B3B3B3]">
        Roadmap not found.
      </div>
    );
  }

  const { roadmap, steps, progress } = data;
  const dark = theme === "dark";

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-8 ${
        dark ? "bg-[#0D0D0D] text-[#E0E0E0]" : "bg-[#F9FBFC] text-[#2D3C52]"
      }`}
    >
      <Link
        href="/dashboard/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#00FF80] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <main className="mx-auto max-w-4xl">
        <section className="border-b border-[#2E3033] pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{roadmap.title}</h1>
              <p className="mt-2 max-w-2xl text-[#B3B3B3]">
                {roadmap.description}
              </p>
            </div>
            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00FF80] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00E070]"
            >
              <Play className="h-4 w-4" />
              Open chat
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-[#B3B3B3]">
              <span>
                {progress.completedSubSteps}/{progress.totalSubSteps} checkpoints
              </span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="h-3 rounded-full bg-[#2E3033]">
              <div
                className="h-3 rounded-full bg-[#00FF80] transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {queuedMessage ? (
            <p className="mt-4 rounded-lg border border-[#00FF80]/40 bg-[#00FF80]/10 px-3 py-2 text-sm text-[#00FF80]">
              {queuedMessage}
            </p>
          ) : null}
        </section>

        <section className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <article
              key={step.id}
              className="rounded-lg border border-[#2E3033] bg-[#131313] p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00FF80]/20 text-sm font-bold text-[#00FF80]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-medium">{step.title}</h2>
                      <p className="mt-1 text-sm text-[#B3B3B3]">
                        {step.description}
                      </p>
                    </div>
                    {!step.done ? (
                      <button
                        type="button"
                        onClick={() => startStep(step.id)}
                        disabled={startingStepId === step.id}
                        className="rounded-lg border border-[#00FF80] px-3 py-1.5 text-sm font-medium text-[#00FF80] hover:bg-[#00FF80]/10 disabled:opacity-50"
                      >
                        {startingStepId === step.id ? "Starting..." : "Start lesson"}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#00FF80]">
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </span>
                    )}
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-[#2E3033]">
                    <div
                      className="h-2 rounded-full bg-[#00FF80]"
                      style={{ width: `${step.progress.percentage}%` }}
                    />
                  </div>

                  <ul className="mt-4 space-y-3">
                    {step.subSteps.map((subStep) => {
                      const active = activeSubStepId === subStep.id;
                      const locked = !subStep.done && !active;
                      return (
                        <li
                          key={subStep.id}
                          className={`rounded-lg border px-4 py-3 ${
                            subStep.done
                              ? "border-[#00FF80]/30 bg-[#00FF80]/10"
                              : active
                                ? "border-[#00FF80]/50 bg-[#1A1A1A]"
                                : "border-[#2E3033] bg-[#1A1A1A]/60"
                          }`}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex gap-3">
                              {subStep.done ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00FF80]" />
                              ) : locked ? (
                                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#777]" />
                              ) : (
                                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#00FF80]" />
                              )}
                              <div>
                                <p className="font-medium">{subStep.title}</p>
                                <p className="mt-1 text-sm text-[#B3B3B3]">
                                  {subStep.description}
                                </p>
                              </div>
                            </div>
                            {!subStep.done ? (
                              <button
                                type="button"
                                onClick={() => beginVerification(subStep)}
                                disabled={locked || verifyingSubStepId === subStep.id}
                                className="rounded-lg bg-[#00FF80] px-3 py-1.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {verifyingSubStepId === subStep.id
                                  ? "Loading..."
                                  : "Verify"}
                              </button>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {verification ? (
        <VerificationModal
          verification={verification}
          selectedAnswers={selectedAnswers}
          result={verificationResult}
          error={verificationError}
          submitting={submittingVerification}
          onSelect={(index, value) =>
            setSelectedAnswers((current) => ({ ...current, [index]: value }))
          }
          onSubmit={submitVerification}
          onClose={closeVerification}
        />
      ) : null}
    </div>
  );
}

function VerificationModal({
  verification,
  selectedAnswers,
  result,
  error,
  submitting,
  onSelect,
  onSubmit,
  onClose,
}: {
  verification: StartRoadmapVerificationResponse;
  selectedAnswers: Record<number, string>;
  result: VerificationResult | null;
  error: string | null;
  submitting: boolean;
  onSelect: (index: number, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const questions = verification.quiz.questions;
  const allAnswered = questions.every((_, index) => selectedAnswers[index]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#2E3033] bg-[#131313] p-5 text-[#E0E0E0] shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Checkpoint verification</h2>
            <p className="mt-1 text-sm text-[#B3B3B3]">
              Score {verification.passingScore}/{verification.totalQuestions} to pass.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#B3B3B3] hover:bg-[#2E3033]"
            aria-label="Close verification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        {result ? (
          <div
            className={`mt-5 rounded-lg border p-4 ${
              result.passed
                ? "border-[#00FF80]/40 bg-[#00FF80]/10 text-[#00FF80]"
                : "border-red-400/40 bg-red-500/10 text-red-300"
            }`}
          >
            <p className="font-semibold">
              {result.passed ? "Passed" : "Try again"}: {result.score}/
              {result.totalQuestions}
            </p>
            <p className="mt-1 text-sm">
              {result.passed
                ? "Checkpoint completed."
                : `You need ${result.passingScore} correct answers to complete this checkpoint.`}
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {questions.map((question: RoadmapVerificationQuestion, index) => (
              <div key={question.question} className="rounded-lg bg-[#1A1A1A] p-4">
                <p className="font-medium">
                  {index + 1}. {question.question}
                </p>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onSelect(index, option)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm ${
                        selectedAnswers[index] === option
                          ? "border-[#00FF80] bg-[#00FF80]/10"
                          : "border-[#2E3033] hover:border-[#555]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#2E3033] px-4 py-2 text-sm"
          >
            {result?.passed ? "Done" : "Close"}
          </button>
          {!result ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!allAnswered || submitting}
              className="rounded-lg bg-[#00FF80] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
