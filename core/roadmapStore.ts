import { RoadmapService } from "../services/roadmap.service";
import type {
  Roadmap,
  RoadmapSubStep,
  RoadmapWithSteps,
  StartRoadmapVerificationResponse,
  StartRoadmapStepResponse,
  SubmitRoadmapVerificationResponse,
} from "../interfaces/Roadmap";
import { create } from "zustand";

interface RoadmapState {
  roadmaps: Roadmap[];
  roadmapsUserId: string | null;
  roadmapWithStepsById: Record<string, RoadmapWithSteps>;
  isLoading: boolean;
  error: string | null;

  fetchRoadmaps: (userId: string) => Promise<void>;
  fetchRoadmapById: (roadmapId: string) => Promise<RoadmapWithSteps | undefined>;
  startRoadmapStep: (
    stepId: string,
    userId: string,
  ) => Promise<StartRoadmapStepResponse>;
  startSubStepVerification: (
    subStepId: string,
    userId: string,
  ) => Promise<StartRoadmapVerificationResponse>;
  submitSubStepVerification: (
    quizId: string,
    userId: string,
    answers: Array<{ questionIndex: number; selectedAnswer: string }>,
  ) => Promise<SubmitRoadmapVerificationResponse>;
  resetState: () => void;
}

const roadmapService = new RoadmapService();

const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmaps: [],
  roadmapsUserId: null,
  roadmapWithStepsById: {},
  isLoading: false,
  error: null,

  fetchRoadmaps: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const roadmaps = await roadmapService.getUserRoadmaps(userId);
      set({
        roadmaps,
        roadmapsUserId: userId,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch roadmaps",
      });
    }
  },

  fetchRoadmapById: async (roadmapId: string) => {
    try {
      const data = await roadmapService.getRoadmapById(roadmapId);
      set((state) => ({
        roadmapWithStepsById: {
          ...state.roadmapWithStepsById,
          [roadmapId]: data,
        },
      }));
      return data;
    } catch (error) {
      console.error("Failed to fetch roadmap by ID:", error);
      return undefined;
    }
  },
  startRoadmapStep: async (stepId: string, userId: string) => {
    try {
      const response = await roadmapService.startRoadmapStep(stepId, {
        userId,
        mode: "background",
      });
      return response;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to start roadmap step",
      });
      throw error;
    }
  },
  startSubStepVerification: async (subStepId: string, userId: string) => {
    try {
      set({ error: null });
      return await roadmapService.startSubStepVerification(subStepId, userId);
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to start checkpoint verification",
      });
      throw error;
    }
  },
  submitSubStepVerification: async (quizId, userId, answers) => {
    try {
      set({ error: null });
      const response = await roadmapService.submitSubStepVerification(quizId, {
        userId,
        answers,
      });
      if (response.passed && response.subStep) {
        set((state) => {
          const updated = { ...state.roadmapWithStepsById };
          for (const key of Object.keys(updated)) {
            const roadmap = updated[key];
            const nextSteps = roadmap.steps.map((step) => {
              if (step.id !== response.subStep?.stepId) return step;
              const subSteps = step.subSteps.map((subStep: RoadmapSubStep) =>
                subStep.id === response.subStep?.id
                  ? { ...subStep, ...response.subStep, done: true }
                  : subStep,
              );
              const completedSubSteps = subSteps.filter((item) => item.done).length;
              const totalSubSteps = subSteps.length;
              return {
                ...step,
                done: totalSubSteps > 0 && completedSubSteps === totalSubSteps,
                subSteps,
                progress: {
                  completedSubSteps,
                  totalSubSteps,
                  percentage: totalSubSteps
                    ? Math.round((completedSubSteps / totalSubSteps) * 100)
                    : 0,
                },
              };
            });
            const totalSubSteps = nextSteps.reduce(
              (sum, step) => sum + step.subSteps.length,
              0,
            );
            const completedSubSteps = nextSteps.reduce(
              (sum, step) =>
                sum + step.subSteps.filter((subStep) => subStep.done).length,
              0,
            );
            updated[key] = {
              ...roadmap,
              steps: nextSteps,
              progress: {
                completedSubSteps,
                totalSubSteps,
                completedSteps: nextSteps.filter((step) => step.done).length,
                totalSteps: nextSteps.length,
                percentage: totalSubSteps
                  ? Math.round((completedSubSteps / totalSubSteps) * 100)
                  : 0,
              },
            };
          }
          return { roadmapWithStepsById: updated };
        });
      }
      return response;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit checkpoint verification",
      });
      throw error;
    }
  },

  resetState: () => {
    set({
      roadmaps: [],
      roadmapsUserId: null,
      roadmapWithStepsById: {},
      isLoading: false,
      error: null,
    });
  },
}));

export default useRoadmapStore;
