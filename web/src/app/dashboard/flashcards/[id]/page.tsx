"use client";

import useFlashCardStore from "@/../core/flashcardStore";
import useUserStore from "@/../core/userState";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FlashcardDetailPage() {
  const params = useParams<{ id: string }>();
  const deckId = params?.id;
  const user = useUserStore((s) => s.user);
  const fetchFlashcardDeckById = useFlashCardStore((s) => s.fetchFlashcardDeckById);
  const payload = useFlashCardStore((s) =>
    deckId ? s.flashCardById[deckId] : undefined,
  );
  const isLoading = useFlashCardStore((s) => s.isLoading);
  const error = useFlashCardStore((s) => s.error);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!user?.id || !deckId) return;
    void fetchFlashcardDeckById(deckId, user.id, { force: true });
  }, [deckId, user?.id, fetchFlashcardDeckById]);

  const cards = useMemo(
    () => [...(payload?.flashcards || [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [payload?.flashcards],
  );

  useEffect(() => {
    setActive(0);
    setFlipped(false);
  }, [deckId]);

  const current = cards[active];

  return (
    <div className="w-full">
      <div className="mb-4">
        <Link href="/dashboard/flashcards" className="text-[#00FF80] text-[14px]">
          Back to decks
        </Link>
        <h1 className="text-[#E0E0E0] text-[24px] font-[700] mt-2">
          {payload?.deck.title || "Flashcards"}
        </h1>
        <p className="text-[#B3B3B3] text-[14px]">{payload?.deck.topic || ""}</p>
      </div>
      {error ? <p className="text-red-400">{error}</p> : null}
      {isLoading ? (
        <p className="text-[#B3B3B3]">Loading cards...</p>
      ) : !current ? (
        <p className="text-[#B3B3B3]">No cards in this deck yet.</p>
      ) : (
        <div className="max-w-2xl">
          <button
            onClick={() => setFlipped((v) => !v)}
            className="w-full rounded-[14px] border border-[#2E3033] bg-[#131313] p-6 text-left min-h-[220px]"
          >
            <p className="text-[#7D7D7D] text-[12px] mb-2">
              {flipped ? "Answer" : "Prompt"}
            </p>
            <p className="text-[#E0E0E0] text-[20px] font-[600]">
              {flipped ? current.back : current.front}
            </p>
          </button>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => {
                setActive((v) => Math.max(0, v - 1));
                setFlipped(false);
              }}
              disabled={active === 0}
              className="px-4 py-2 rounded-[8px] border border-[#2E3033] text-[#E0E0E0] disabled:opacity-40"
            >
              Previous
            </button>
            <p className="text-[#B3B3B3] text-[14px]">
              {active + 1} / {cards.length}
            </p>
            <button
              onClick={() => {
                setActive((v) => Math.min(cards.length - 1, v + 1));
                setFlipped(false);
              }}
              disabled={active >= cards.length - 1}
              className="px-4 py-2 rounded-[8px] border border-[#2E3033] text-[#E0E0E0] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
