"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Brain } from "lucide-react";
import usePublicQuizStore from "../../core/publicQuizStore";

type Props = { quizId: string };

export default function ChatPublicQuizCard({ quizId }: Props) {
  const fetchQuiz = usePublicQuizStore((s) => s.fetchQuiz);
  const quizLoading = usePublicQuizStore((s) => s.quizLoading[quizId]);
  const detail = usePublicQuizStore((s) => s.quiz[quizId]);

  useEffect(() => {
    void fetchQuiz(quizId);
  }, [quizId, fetchQuiz]);

  if (quizLoading && !detail) {
    return (
      <div className="my-3 rounded-xl border border-[#2E3033] bg-[#131313] p-4 animate-pulse">
        <div className="h-4 w-3/4 rounded bg-[#2E3033]" />
        <div className="mt-3 h-8 w-full rounded bg-[#2E3033]" />
      </div>
    );
  }

  if (!detail) {
    return (
      <p className="my-3 text-sm text-[#B3B3B3]">Could not load quiz.</p>
    );
  }

  return (
    <div className="my-3 rounded-xl border border-[#2E3033] bg-[#1A1A1A] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00FF80]/15">
          <Brain className="h-5 w-5 text-[#00FF80]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#00FF80]">
            Public quiz
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#E0E0E0]">{detail.title}</h3>
          {detail.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-[#B3B3B3]">{detail.description}</p>
          ) : null}
          <p className="mt-2 text-xs text-[#888]">
            {detail.viewCount} views · {detail.attemptCount} attempts ·{" "}
            {detail.questions.length} questions
          </p>
          <Link
            href={`/dashboard/quizzes/${quizId}`}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-[#00FF80] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00E070]"
          >
            Start quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
