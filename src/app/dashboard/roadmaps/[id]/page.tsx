"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import useRoadmapStore from "../../../../../core/roadmapStore";
import useUserStore from "../../../../../core/userState";
import type { RoadmapStep, RoadmapWithSteps } from "../../../../../interfaces/Roadmap";
import { RoadmapService } from "../../../../../services/roadmap.service";

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0] ?? "";
  const user = useUserStore((s) => s.user);
  const theme = useUserStore((s) => s.theme);
  const fetchRoadmapById = useRoadmapStore((s) => s.fetchRoadmapById);
  const cached = useRoadmapStore((s) =>
    id ? s.roadmapWithStepsById[id] : undefined,
  );
  const [data, setData] = useState<RoadmapWithSteps | undefined>(cached);
  const [loading, setLoading] = useState(!cached);
  const roadmapService = useMemo(() => new RoadmapService(), []);

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

  const startStep = useCallback(
    async (stepId: string) => {
      if (!user?.id) return;
      try {
        await roadmapService.startRoadmapStep(stepId, { userId: user.id });
        openChat();
      } catch {
        alert("Could not start step");
      }
    },
    [user?.id, roadmapService, openChat],
  );

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

  const { roadmap, steps } = data;
  const completed = steps.filter((step: RoadmapStep) => step.done).length;

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-8 ${
        theme === "dark" ? "bg-[#0D0D0D] text-[#E0E0E0]" : "bg-[#F9FBFC] text-[#2D3C52]"
      }`}
    >
      <Link
        href="/dashboard/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#00FF80] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <div className="mx-auto max-w-2xl rounded-2xl border border-[#2E3033] bg-[#131313] p-6">
        <h1 className="text-2xl font-semibold">{roadmap.title}</h1>
        <p className="mt-2 text-[#B3B3B3]">{roadmap.description}</p>
        <p className="mt-4 text-sm text-[#888]">
          Progress: {completed}/{steps.length} steps
        </p>
        <button
          type="button"
          onClick={openChat}
          className="mt-4 rounded-lg bg-[#00FF80] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00E070]"
        >
          Open roadmap chat
        </button>

        <ul className="mt-8 space-y-4">
          {steps.map((step: RoadmapStep, index: number) => (
            <li
              key={step.id}
              className="rounded-xl border border-[#2E3033] bg-[#1A1A1A] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00FF80]/20 text-sm font-bold text-[#00FF80]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium">{step.title}</h2>
                  <p className="mt-1 text-sm text-[#B3B3B3]">{step.description}</p>
                  <p className="mt-2 text-xs text-[#888]">~{step.time} min</p>
                  {step.done ? (
                    <span className="mt-2 inline-block text-xs font-semibold text-[#00FF80]">
                      Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startStep(step.id)}
                      className="mt-3 rounded-lg border border-[#00FF80] px-3 py-1.5 text-sm font-medium text-[#00FF80] hover:bg-[#00FF80]/10"
                    >
                      Start step
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
