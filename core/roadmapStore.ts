import { RoadmapService } from "../services/roadmap.service";
import type { Roadmap, RoadmapWithSteps } from "../interfaces/Roadmap";
import { create } from "zustand";

interface RoadmapState {
  roadmaps: Roadmap[];
  roadmapsUserId: string | null;
  roadmapWithStepsById: Record<string, RoadmapWithSteps>;
  isLoading: boolean;
  error: string | null;

  fetchRoadmaps: (userId: string) => Promise<void>;
  fetchRoadmapById: (roadmapId: string) => Promise<RoadmapWithSteps | undefined>;
  startRoadmapStep: (stepId: string, userId: string) => Promise<void>;
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
      await roadmapService.startRoadmapStep(stepId, { userId });
      set((state) => {
        const updated = { ...state.roadmapWithStepsById };
        for (const key of Object.keys(updated)) {
          const roadmap = updated[key];
          updated[key] = {
            ...roadmap,
            steps: roadmap.steps.map((step) =>
              step.id === stepId ? { ...step, done: true } : step,
            ),
          };
        }
        return { roadmapWithStepsById: updated };
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to start roadmap step",
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
