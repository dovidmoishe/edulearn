import { User, UserService } from "../services/user.service";
import { ActivityService } from "../services/activity.service";
import { createClient } from "../utils/supabase/client";
import { create } from "zustand";
import useAgentStore from "./agentStore";
import useFlashCardStore from "./flashcardStore";
import useRoadmapStore from "./roadmapStore";
import usePublicQuizStore from "./publicQuizStore";

interface UserState {
  user: User | null;
  isLoading: boolean;
  profileActionLoading: boolean;
  profileActionError: string | null;
  walletBalance: {sol: number, tokenAccount: number} | null;
  walletBalanceLoading: boolean;
  theme: 'light' | 'dark';
  setUserAsync: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  updateUserPointsFromQuiz: (xpEarned: number) => void;
  updateUserPoints: ({userId, title, type, xpEarned}: {userId: string, title: string, type: "quiz" | "chat" | "streak", xpEarned: number}) => void;
  updateLevel: (
    level: "novice" | "beginner" | "intermediate" | "advanced" | "expert"
  ) => void;
  fetchWalletBalance: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  loadTheme: () => void;
  editProfileFields: (data: {
    name: string;
    email: string;
    username: string;
    learning?: string;
  }) => Promise<void>;
  uploadProfilePicture: (file: File | Blob, filename?: string) => Promise<void>;
  deleteUserAccount: (userId: string, supabaseUserId: string) => Promise<void>;
}

const getSupabaseClient = () => {
  return createClient();
};

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  profileActionLoading: false,
  profileActionError: null,
  walletBalance: {sol: 0, tokenAccount: 0},
  walletBalanceLoading: false,
  theme: 'dark',
  
  setUserAsync: async () => {
    if (typeof window === "undefined") return;

    set({ isLoading: true });
    try {
      const supabase = getSupabaseClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser || !authUser.email) {
        set({ isLoading: false });
        return;
      }
      
      const userService = new UserService();
      const userFromDB = await userService.initUser();
      
      if (!userFromDB) {
        console.log("User not found in database");
        set({ isLoading: false });
        return;
      }

      set({
        user: {
          id: userFromDB.id,
          name: userFromDB.name || "User",
          email: userFromDB.email || authUser.email,
          address: userFromDB.address || null,
          credits: userFromDB.credits || 0,
          xp: userFromDB.xp || 0,
          streak: userFromDB.streak || 0,
          referralCode: userFromDB.referralCode || "",
          level: userFromDB.level || "beginner",
          referralCount: userFromDB.referralCount || 0,
          username: userFromDB.username || "User",
          referredBy: userFromDB.referredBy || null,
          quizCompleted: userFromDB.quizCompleted,
          isPremium: userFromDB.isPremium || false,
          learning: userFromDB.learning || undefined,
          isVerified: userFromDB.isVerified || false,
          profilePictureURL: userFromDB.profilePictureURL || null,
        },
        isLoading: false,
      });
      
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isLoading: false });
    }
  },
  
  updateUserPointsFromQuiz: (xpEarned: number) => {
    const currentUser = get().user;
    if (!currentUser?.email) return;
    set((state) => ({
      user: state.user
        ? { ...state.user, xp: (state.user.xp || 0) + xpEarned }
        : null,
    }));
  },

  updateUserPoints: ({type, title, xpEarned}: {type: "quiz" | "streak" | "chat"; title: string; xpEarned: number}) => {
    const currentUser = get().user;
    if (!currentUser || !currentUser.email) return;
    
    set((state) => ({
      user: state.user
        ? { ...state.user, xp: (state.user.xp || 0) + xpEarned }
        : null,
    }));
    
    const activityService = new ActivityService();
    activityService.createActivity({userId: currentUser?.id as string, title, type, xpEarned}).catch(error => 
      console.error("Failed to update XP in database:", error)
    );
  },
  
  updateLevel: (
    level: "novice" | "beginner" | "intermediate" | "advanced" | "expert"
  ) => {
    const currentUser = get().user;
    if (!currentUser || !currentUser.email) return;
    
    set((state) => ({
      user: state.user ? { ...state.user, level } : null,
    }));
    
    const userService = new UserService();
    userService.updateUserLevel(currentUser.id, level).catch(error => 
      console.error("Failed to update level in database:", error)
    );
  },
  
  setUser: (user: User) => {
    set({ user });
  },
  
  fetchWalletBalance: async () => {
    set({ walletBalanceLoading: false });
  },
  
  logout: async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem('isReviewer');
      }
      useAgentStore.getState().resetState();
      useFlashCardStore.getState().resetState();
      useRoadmapStore.getState().resetState();
      usePublicQuizStore.getState().resetState();
      set({ user: null, walletBalance: null, isLoading: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  setTheme: (theme: 'light' | 'dark') => {
    if (typeof window !== "undefined") {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },

  loadTheme: () => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const theme = storedTheme ?? 'dark';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      set({ theme });
    }
  },
  editProfileFields: async (data) => {
    const currentUser = get().user;
    if (!currentUser) return;
    try {
      set({ profileActionLoading: true, profileActionError: null });
      const userService = new UserService();
      const updated = await userService.editUser(data);
      set({
        user: {
          ...currentUser,
          name: updated.name,
          username: updated.username,
          learning: updated.learning,
        },
        profileActionLoading: false,
      });
    } catch (error) {
      set({
        profileActionLoading: false,
        profileActionError:
          error instanceof Error ? error.message : "Failed to update profile",
      });
      throw error;
    }
  },
  uploadProfilePicture: async (file, filename) => {
    const currentUser = get().user;
    if (!currentUser) return;
    try {
      set({ profileActionLoading: true, profileActionError: null });
      const userService = new UserService();
      const response = await userService.uploadProfilePicture(file, filename);
      set({
        user: {
          ...currentUser,
          profilePictureURL: response.profilePictureURL,
        },
        profileActionLoading: false,
      });
    } catch (error) {
      set({
        profileActionLoading: false,
        profileActionError:
          error instanceof Error
            ? error.message
            : "Failed to upload profile picture",
      });
      throw error;
    }
  },
  deleteUserAccount: async (userId, supabaseUserId) => {
    try {
      set({ profileActionLoading: true, profileActionError: null });
      const userService = new UserService();
      await userService.deleteUser(userId, supabaseUserId);
      set({ profileActionLoading: false });
    } catch (error) {
      set({
        profileActionLoading: false,
        profileActionError:
          error instanceof Error ? error.message : "Failed to delete account",
      });
      throw error;
    }
  },
}));

export default useUserStore;
