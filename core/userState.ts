import { User, UserService } from "../services/user.service";
import { ActivityService } from "../services/activity.service";
import { createClient } from "../utils/supabase/client";
import { create } from "zustand";

interface UserState {
  user: User | null;
  isLoading: boolean;
  walletBalance: {sol: number, tokenAccount: number} | null;
  walletBalanceLoading: boolean;
  theme: 'light' | 'dark';
  setUserAsync: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  updateUserPoints: ({userId, title, type, xpEarned}: {userId: string, title: string, type: "quiz" | "chat" | "streak", xpEarned: number}) => void;
  updateLevel: (
    level: "novice" | "beginner" | "intermediate" | "advanced" | "expert"
  ) => void;
  fetchWalletBalance: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  loadTheme: () => void;
}

const getSupabaseClient = () => {
  return createClient();
};

const calculateAndUpdateStreak = async (user: User, lastLoggedIn: string | Date | undefined): Promise<number> => {
  const userService = new UserService();
  const activityService = new ActivityService();
  
  if (!lastLoggedIn) {
    const newStreak = 1;
    await userService.updateUserStreak(user.id, newStreak);
    return newStreak;
  }
  
  try {
    const lastActive = new Date(lastLoggedIn);
    const now = new Date();
    
    const lastActiveDate = lastActive.toISOString().split('T')[0];
    const todayDate = now.toISOString().split('T')[0];
    
    const lastActiveDateObj = new Date(lastActiveDate);
    const todayDateObj = new Date(todayDate);
    const daysDiff = Math.floor((todayDateObj.getTime() - lastActiveDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    const previousStreak = user.streak || 0;
    let newStreak: number;
    
    if (daysDiff === 0) {
      newStreak = user.streak || 1;
    } else if (daysDiff === 1) {
      newStreak = (user.streak || 0) + 1;
    } else {
      newStreak = 1;
    }
    
    await userService.updateUserStreak(user.id, newStreak);
    

    if (newStreak > previousStreak && newStreak >= 3) {
      await activityService.createActivity({
        userId: user.id, 
        type: "streak", 
        title: `${newStreak}-day XP Streak Bonus`, 
        xpEarned: 1
      });
    }
    
    return newStreak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    const fallbackStreak = user.streak || 1;
    await userService.updateUserStreak(user.id, fallbackStreak);
    return fallbackStreak;
  }
};

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
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
      const userFromDB = await userService.getUser(authUser.email);
      
      if (!userFromDB) {
        console.log("User not found in database");
        set({ isLoading: false });
        return;
      }

      const updatedStreak = await calculateAndUpdateStreak(
        userFromDB,
        userFromDB.lastLoggedIn
      );

      set({
        user: {
          id: userFromDB.id,
          name: userFromDB.name || "User",
          email: authUser.email,
          address: userFromDB.address || null,
          credits: userFromDB.credits || 0,
          xp: userFromDB.xp || 0,
          streak: updatedStreak,
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
      
      await get().fetchWalletBalance();
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isLoading: false });
    }
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
    const currentUser = get().user;
    if (!currentUser || !currentUser.id) return;
    
    try {
      set({ walletBalanceLoading: true });
      const userService = new UserService();
      const { balance } = await userService.getUserWalletBalance(currentUser.address as string);
      set({ walletBalance: {sol: balance.sol, tokenAccount: balance.tokenAccount} });
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      set({ walletBalanceLoading: false });
    }
  },
  
  logout: async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem('isReviewer');
      }
      set({ user: null, walletBalance: null, isLoading: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  setTheme: (theme: 'light' | 'dark') => {
    if (typeof window !== "undefined") {
      localStorage.setItem('theme', theme);
    }
    set({ theme });
  },

  loadTheme: () => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem('theme');
      if (theme) {
        set({ theme: theme as 'light' | 'dark' });
      }
    }
  },
}));

export default useUserStore;
