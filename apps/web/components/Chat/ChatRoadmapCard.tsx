"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Map } from "lucide-react";
import useRoadmapStore from "../../core/roadmapStore";
import type { RoadmapWithSteps } from "../../interfaces/Roadmap";

type Props = { roadmapId: string };

export default function ChatRoadmapCard({ roadmapId }: Props) {
  const [roadmapData, setRoadmapData] = useState<RoadmapWithSteps | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchRoadmapById = useRoadmapStore((s) => s.fetchRoadmapById);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const cached = useRoadmapStore.getState().roadmapWithStepsById[roadmapId];
      if (cached) {
        setRoadmapData(cached);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchRoadmapById(roadmapId);
        if (!cancelled) setRoadmapData(data ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [roadmapId, fetchRoadmapById]);

  if (loading && !roadmapData) {
    return (
      <div className="my-3 rounded-xl border border-[#2E3033] bg-[#131313] p-4 animate-pulse">
        <div className="h-4 w-2/3 rounded bg-[#2E3033]" />
        <div className="mt-3 h-3 w-full rounded bg-[#2E3033]" />
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <p className="my-3 text-sm text-[#B3B3B3]">Could not load roadmap.</p>
    );
  }

  const { roadmap, steps } = roadmapData;
  const completed = roadmapData.progress?.completedSubSteps ?? steps.filter((s) => s.done).length;
  const total = roadmapData.progress?.totalSubSteps ?? steps.length;

  return (
    <div className="my-3 rounded-xl border border-[#2E3033] bg-gradient-to-br from-[#1A2420] to-[#131313] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00FF80]/15">
          <Map className="h-5 w-5 text-[#00FF80]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#00FF80]">
            Learning path
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#E0E0E0]">{roadmap.title}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-[#B3B3B3]">{roadmap.description}</p>
          <p className="mt-2 text-xs text-[#888]">
            {completed}/{total} checkpoints completed
          </p>
          <Link
            href={`/dashboard/roadmaps/${roadmapId}`}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-[#00FF80] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00E070]"
          >
            View roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
