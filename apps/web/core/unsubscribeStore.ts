import { create } from "zustand";
import { unsubscribeService } from "../services/unsubscribe.service";
import type { UnsubscribeStatus } from "../types/unsubscribe.types";

interface UnsubscribeState {
  token: string | null;
  status: UnsubscribeStatus | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchStatus: (token: string) => Promise<void>;
  unsubscribe: () => Promise<void>;
  reset: () => void;
}

const useUnsubscribeStore = create<UnsubscribeState>((set, get) => ({
  token: null,
  status: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchStatus: async (token: string) => {
    const current = get();
    if (current.isLoading) return;
    if (current.token === token && current.status && !current.error) return;

    try {
      set({ token, status: null, isLoading: true, error: null });
      const result = await unsubscribeService.getStatus(token);
      set({ status: result.status, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load unsubscribe status",
      });
    }
  },

  unsubscribe: async () => {
    const { token, isSubmitting } = get();
    if (!token || isSubmitting) return;

    try {
      set({ isSubmitting: true, error: null });
      const result = await unsubscribeService.unsubscribe({ token });
      set({ status: result.status, isSubmitting: false, error: null });
    } catch (error) {
      set({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to unsubscribe right now",
      });
    }
  },

  reset: () => {
    set({
      token: null,
      status: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },
}));

export default useUnsubscribeStore;

