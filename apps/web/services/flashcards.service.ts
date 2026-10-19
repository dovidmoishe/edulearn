import httpClient from "../utils/httpClient";
import type {
  Flashcard,
  FlashcardDeck,
  FlashcardDeckResponse,
  FlashcardDeckWithFlashcards,
} from "../types/flashcards.types";

export class FlashcardsService {
  async getFlashcardDecks(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<FlashcardDeck[]> {
    const q = new URLSearchParams({ userId });
    if (options?.limit != null) q.set("limit", String(options.limit));
    if (options?.offset != null) q.set("offset", String(options.offset));
    const response = await httpClient.get<FlashcardDeckResponse>(
      `/ai/flashcards?${q.toString()}`,
    );
    return response.data?.decks ?? [];
  }

  async getFlashcards(deckId: string, userId: string): Promise<Flashcard[]> {
    const q = new URLSearchParams({ userId });
    const response = await httpClient.get<
      FlashcardDeckWithFlashcards & { cards?: Flashcard[] }
    >(`/ai/flashcards/${encodeURIComponent(deckId)}?${q.toString()}`);
    const body = response.data;
    if (!body) throw new Error("No flashcard deck data returned");
    const list = body.flashcards ?? body.cards;
    return Array.isArray(list) ? list : [];
  }
}
