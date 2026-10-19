import { create } from "zustand";
import { surveyService } from "../services/survey.service";
import type {
  PublicSurvey,
  SubmitSurveyAnswer,
  SubmitSurveyResponseResult,
} from "../types/survey.types";

interface SurveyState {
  activeSurvey: PublicSurvey | null;
  surveysBySlug: Record<string, PublicSurvey>;
  submittedResponse: SubmitSurveyResponseResult | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadActiveSurvey: (options?: { force?: boolean }) => Promise<void>;
  loadSurveyBySlug: (
    slug: string,
    options?: { force?: boolean },
  ) => Promise<void>;
  submitSurveyResponse: (
    surveyId: string,
    answers: SubmitSurveyAnswer[],
  ) => Promise<void>;
  resetSubmission: () => void;
}

const useSurveyStore = create<SurveyState>((set, get) => ({
  activeSurvey: null,
  surveysBySlug: {},
  submittedResponse: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadActiveSurvey: async (options) => {
    if (!options?.force && get().activeSurvey) return;

    try {
      set({ isLoading: true, error: null });
      const survey = await surveyService.getActiveSurvey();
      set((state) => ({
        activeSurvey: survey,
        surveysBySlug: { ...state.surveysBySlug, [survey.slug]: survey },
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the survey right now",
      });
    }
  },

  loadSurveyBySlug: async (slug, options) => {
    if (!options?.force && get().surveysBySlug[slug]) return;

    try {
      set({ isLoading: true, error: null });
      const survey = await surveyService.getSurveyBySlug(slug);
      set((state) => ({
        surveysBySlug: { ...state.surveysBySlug, [slug]: survey },
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the survey right now",
      });
    }
  },

  submitSurveyResponse: async (surveyId, answers) => {
    if (get().isSubmitting) return;

    try {
      set({ isSubmitting: true, error: null });
      const response = await surveyService.submitSurveyResponse(surveyId, {
        answers,
      });
      set({
        submittedResponse: response,
        isSubmitting: false,
      });
    } catch (error) {
      set({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit your survey response",
      });
    }
  },

  resetSubmission: () => {
    set({ submittedResponse: null, error: null, isSubmitting: false });
  },
}));

export default useSurveyStore;
