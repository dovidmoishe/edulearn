"use client";

import { useEffect, useState } from "react";
import useFlashCardStore from "../../core/flashcardStore";
import useUserStore from "../../core/userState";

type Props = { deckId: string };

export default function ChatFlashcardDeck({ deckId }: Props) {
  const user = useUserStore((s) => s.user);
  const payload = useFlashCardStore((s) => s.flashCardById[deckId]);
  const fetchFlashcardDeckById = useFlashCardStore((s) => s.fetchFlashcardDeckById);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const cached = useFlashCardStore.getState().flashCardById[deckId];
    if (cached) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await fetchFlashcardDeckById(deckId, user.id);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deckId, user?.id, fetchFlashcardDeckById]);

  if (!user?.id) return null;

  if (loading && !payload) {
    return (
      <div className="my-3 flex justify-center rounded-xl border border-[#2E3033] bg-[#131313] py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00FF80] border-t-transparent" />
      </div>
    );
  }

  const cards = payload?.flashcards ?? [];
  if (!cards.length) {
    return (
      <p className="my-3 text-sm text-[#B3B3B3]">No flashcards in this deck.</p>
    );
  }

  return (
    <div className="my-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#00FF80]">
        Flashcards · {payload?.deck.title ?? "Deck"}
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {cards.map((card) => (
          <div
            key={card.id}
            className="min-w-[240px] max-w-[268px] shrink-0 rounded-xl border border-[#2E3033] bg-gradient-to-br from-[#1E2A24] via-[#131A18] to-[#0D1210] p-4 shadow-inner"
          >
            <p className="text-sm font-medium text-[#E0E0E0]">{card.front}</p>
            <div className="my-3 border-t border-[#2E3033]" />
            <p className="text-sm text-[#B3B3B3]">{card.back}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
