"use client";

import useFlashCardStore from "@/../core/flashcardStore";
import useUserStore from "@/../core/userState";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function FlashcardsPage() {
  const user = useUserStore((s) => s.user);
  const decks = useFlashCardStore((s) => s.flashcardDecks);
  const isLoading = useFlashCardStore((s) => s.isLoading);
  const error = useFlashCardStore((s) => s.error);
  const fetchFlashcardDecks = useFlashCardStore((s) => s.fetchFlashcardDecks);

  useEffect(() => {
    if (!user?.id) return;
    void fetchFlashcardDecks(user.id, { force: true });
  }, [user?.id, fetchFlashcardDecks]);

  const sortedDecks = useMemo(
    () =>
      [...decks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [decks],
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-[#E0E0E0] text-[28px] font-[700]">Flashcards</h1>
        <p className="text-[#B3B3B3] text-[14px]">
          Review decks created from your AI learning sessions.
        </p>
      </div>
      {error ? (
        <p className="text-red-400 mb-3">{error}</p>
      ) : null}
      {isLoading ? (
        <div className="text-[#B3B3B3]">Loading flashcards...</div>
      ) : sortedDecks.length === 0 ? (
        <div className="text-[#B3B3B3]">No flashcard decks yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {sortedDecks.map((deck) => (
            <Link
              key={deck.id}
              href={`/dashboard/flashcards/${deck.id}`}
              className="rounded-[12px] border border-[#2E3033] bg-[#131313] p-4 hover:border-[#00FF80]/60 transition-colors"
            >
              <p className="text-[#E0E0E0] text-[16px] font-[600]">
                {deck.title || "Untitled deck"}
              </p>
              <p className="text-[#B3B3B3] text-[13px] mt-1">
                {deck.topic || "AI generated study cards"}
              </p>
              <p className="text-[#7D7D7D] text-[12px] mt-3">
                {new Date(deck.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
