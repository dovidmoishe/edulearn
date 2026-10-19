import { PublicQuizService } from "../services/publicQuiz.service";
import type {
  ListMyPublicQuizzesResponse,
  ListPublicQuizzesResponse,
  ListQuizzesQuery,
  PublicQuizDetail,
  PublicQuizListItem,
  PublishPublicQuizRequest,
  StartPublicQuizParticipationResponse,
  SubmitPublicQuizRequest,
  SubmitPublicQuizResponse,
} from "../types/quizzes.types";
import { create } from "zustand";

interface PublicQuizStoreState {
  quizzes: PublicQuizListItem[];
  quiz: Record<string, PublicQuizDetail>;
  quizLoading: Record<string, boolean>;
  participationByQuiz: Record<string, string>;
  publicQuizzes: ListPublicQuizzesResponse;
  myQuizzes: ListMyPublicQuizzesResponse;
  quizError: string | null;

  fetchPublicQuizzes: (query?: ListQuizzesQuery) => Promise<void>;
  fetchMyQuizzes: (
    query?: Pick<ListQuizzesQuery, "limit" | "offset">,
  ) => Promise<void>;
  fetchQuiz: (quizId: string) => Promise<void>;
  publishQuiz: (payload: PublishPublicQuizRequest) => Promise<void>;
  joinQuiz: (quizId: string) => Promise<StartPublicQuizParticipationResponse>;
  submitQuiz: (
    quizId: string,
    payload: SubmitPublicQuizRequest,
  ) => Promise<SubmitPublicQuizResponse>;
  clearParticipation: (quizId: string) => void;

  resetState: () => void;
}

const quizService = new PublicQuizService();

const syncListWithDetail = (
  list: PublicQuizListItem[],
  detail: PublicQuizDetail,
): PublicQuizListItem[] =>
  list.map((item) =>
    item.id === detail.id
      ? {
          ...item,
          attemptCount: detail.attemptCount,
          viewCount: detail.viewCount,
        }
      : item,
  );

const emptyLists = (): Pick<
  PublicQuizStoreState,
  | "quizzes"
  | "quiz"
  | "quizLoading"
  | "participationByQuiz"
  | "publicQuizzes"
  | "myQuizzes"
  | "quizError"
> => ({
  quizzes: [],
  quiz: {},
  quizLoading: {},
  participationByQuiz: {},
  publicQuizzes: [],
  myQuizzes: [],
  quizError: null,
});

const usePublicQuizStore = create<PublicQuizStoreState>((set, get) => ({
  ...emptyLists(),

  fetchPublicQuizzes: async (query) => {
    try {
      set({ quizError: null });
      const data = await quizService.listPublicQuizzes(query);
      set({ publicQuizzes: data, quizzes: data });
    } catch (error) {
      set({
        quizError:
          error instanceof Error ? error.message : "Failed to load quizzes",
      });
    }
  },

  fetchMyQuizzes: async (query) => {
    try {
      set({ quizError: null });
      const data = await quizService.listMyQuizzes(query);
      set({ myQuizzes: data });
    } catch (error) {
      set({
        quizError:
          error instanceof Error
            ? error.message
            : "Failed to load your quizzes",
      });
    }
  },

  fetchQuiz: async (quizId) => {
    try {
      set((s) => ({
        quizError: null,
        quizLoading: { ...s.quizLoading, [quizId]: true },
      }));
      const detail = await quizService.getQuizById(quizId);
      set((s) => ({
        quiz: { ...s.quiz, [quizId]: detail },
        quizLoading: { ...s.quizLoading, [quizId]: false },
        publicQuizzes: syncListWithDetail(s.publicQuizzes, detail),
        myQuizzes: syncListWithDetail(s.myQuizzes, detail),
        quizzes: syncListWithDetail(s.quizzes, detail),
      }));
    } catch (error) {
      set((s) => ({
        quizError:
          error instanceof Error ? error.message : "Failed to load quiz",
        quizLoading: { ...s.quizLoading, [quizId]: false },
      }));
    }
  },

  publishQuiz: async (payload) => {
    try {
      set({ quizError: null });
      await quizService.publishQuiz(payload);
      await get().fetchMyQuizzes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to publish quiz";
      set({ quizError: message });
      throw error;
    }
  },

  joinQuiz: async (quizId) => {
    try {
      set({ quizError: null });
      const data = await quizService.joinQuiz(quizId);
      if (!data?.participationId) throw new Error("Failed to join quiz");
      set((s) => ({
        participationByQuiz: {
          ...s.participationByQuiz,
          [quizId]: data.participationId,
        },
      }));
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to join quiz";
      set({ quizError: message });
      throw error;
    }
  },

  submitQuiz: async (quizId, payload) => {
    try {
      set({ quizError: null });
      const response = await quizService.submitQuiz(quizId, payload);
      if (!response) throw new Error("Failed to submit quiz");
      await get().fetchQuiz(quizId);
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit quiz";
      set({ quizError: message });
      throw error;
    }
  },

  clearParticipation: (quizId) => {
    set((s) => {
      const next = { ...s.participationByQuiz };
      delete next[quizId];
      return { participationByQuiz: next };
    });
  },

  resetState: () => {
    set(emptyLists());
  },
}));

export default usePublicQuizStore;
