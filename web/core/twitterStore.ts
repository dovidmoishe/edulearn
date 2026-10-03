import { TwitterService } from "../services/twitter.service";
import { create } from "zustand";

interface TwitterStore {
  isLoading: boolean;
  error: string | null;
  initiateAuth: () => Promise<void>;
  resetState: () => void;
}

const twitterService = new TwitterService();

const useTwitterStore = create<TwitterStore>((set) => ({
  isLoading: false,
  error: null,
  initiateAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      await twitterService.initiateAuth();
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to connect X",
      });
      throw error;
    }
  },
  resetState: () => set({ isLoading: false, error: null }),
}));

export default useTwitterStore;
