import { ActivityService } from "../services/activity.service";
import type {
  CreateActivityRequest,
  XpActivity,
} from "../types/activity.types";
import { create } from "zustand";

interface ActivityState {
  activities: XpActivity[];
  activitiesUserId: string | null;
  quizActivities: XpActivity[];
  quizActivitiesUserId: string | null;
  quizXpTotal: number;
  quizXpTotalUserId: string | null;
  isLoading: boolean;
  error: string | null;
  
  fetchActivities: (userId: string, options?: { force?: boolean }) => Promise<void>;
  fetchQuizActivities: (userId: string, options?: { force?: boolean }) => Promise<void>;
  fetchQuizXpTotal: (userId: string, options?: { force?: boolean }) => Promise<void>;
  
  addActivity: (activity: CreateActivityRequest) => Promise<void>;
  
  resetState: () => void;
}

const activityService = new ActivityService();

const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  activitiesUserId: null,
  quizActivities: [],
  quizActivitiesUserId: null,
  quizXpTotal: 0,
  quizXpTotalUserId: null,
  isLoading: false,
  error: null,
  
  fetchActivities: async (userId: string, options?: { force?: boolean }) => {
    if (!options?.force && get().activitiesUserId === userId) return;
    try {
      set({ isLoading: true, error: null });
      const activities = await activityService.getActivitiesByUser(userId);
      set({ activities, activitiesUserId: userId, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch activities' 
      });
    }
  },
  
  fetchQuizActivities: async (userId: string, options?: { force?: boolean }) => {
    if (!options?.force && get().quizActivitiesUserId === userId) return;
    try {
      set({ isLoading: true, error: null });
      const quizActivities = await activityService.getQuizActivitiesByUser(userId);
      set({ quizActivities, quizActivitiesUserId: userId, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch quiz activities:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch quiz activities' 
      });
    }
  },
  
  fetchQuizXpTotal: async (userId: string, options?: { force?: boolean }) => {
    if (!options?.force && get().quizXpTotalUserId === userId) return;
    try {
      set({ isLoading: true, error: null });
      const { total } = await activityService.getQuizXpTotal(userId);
      set({ quizXpTotal: total || 0, quizXpTotalUserId: userId, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch quiz XP total:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch quiz XP total' 
      });
    }
  },
  
  addActivity: async (activityData) => {
    try {
      set({ isLoading: true, error: null });
      const newActivity = await activityService.createActivity(activityData);
      
      if (activityData.type === 'quiz') {
        set(state => ({
          quizActivities: [newActivity, ...state.quizActivities],
          quizXpTotal: state.quizXpTotal + activityData.xpEarned,
          quizActivitiesUserId: activityData.userId,
          quizXpTotalUserId: activityData.userId,
        }));
      }
      
      set(state => ({
        activities: [newActivity, ...state.activities],
        activitiesUserId: activityData.userId,
        isLoading: false
      }));
      
    } catch (error) {
      console.error('Failed to add activity:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to add activity' 
      });
    }
  },
  
  resetState: () => {
    set({
      activities: [],
      activitiesUserId: null,
      quizActivities: [],
      quizActivitiesUserId: null,
      quizXpTotal: 0,
      quizXpTotalUserId: null,
      isLoading: false,
      error: null
    });
  }
}));

export default useActivityStore;
