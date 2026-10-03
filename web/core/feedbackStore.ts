import { create } from "zustand";
import { feedbackService } from "../services/feedback.service";
import type {
  CreateFeedbackRequest,
  FeedbackResponse,
} from "../types/feedback.types";

interface FeedbackState {
  submittedFeedback: FeedbackResponse | null;
  isSubmitting: boolean;
  error: string | null;
  submitFeedback: (request: CreateFeedbackRequest) => Promise<void>;
  reset: () => void;
}

const useFeedbackStore = create<FeedbackState>((set, get) => ({
  submittedFeedback: null,
  isSubmitting: false,
  error: null,

  submitFeedback: async (request: CreateFeedbackRequest) => {
    if (get().isSubmitting) return;

    try {
      set({ isSubmitting: true, error: null });
      const result = await feedbackService.submitFeedback(request);
      set({
        submittedFeedback: result,
        isSubmitting: false,
        error: null,
      });
    } catch (error) {
      set({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit feedback right now",
      });
    }
  },

  reset: () => {
    set({
      submittedFeedback: null,
      isSubmitting: false,
      error: null,
    });
  },
}));

export default useFeedbackStore;
