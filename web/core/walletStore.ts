import { WalletService } from "../services/wallet.service";
import { create } from "zustand";

type BurnResponse = {
  message: string;
  signature: string;
  transactionLink: string;
};

type SwapResponse = {
  response: string;
};

type DecryptResponse = {
  success: boolean;
  publicKey?: string;
  error?: string;
  privateKey?: string;
};

interface WalletStore {
  isLoading: boolean;
  error: string | null;
  swapSolToEDLN: (userId: string, amount: number) => Promise<SwapResponse>;
  burnEDLN: (userId: string, amount: number) => Promise<BurnResponse>;
  decryptPrivateKey: (userId: string) => Promise<DecryptResponse>;
  resetState: () => void;
}

const walletService = new WalletService();

const useWalletStore = create<WalletStore>((set) => ({
  isLoading: false,
  error: null,
  swapSolToEDLN: async (userId, amount) => {
    try {
      set({ isLoading: true, error: null });
      const result = await walletService.swapSolToEDLN(userId, amount);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to swap SOL to EDLN";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  burnEDLN: async (userId, amount) => {
    try {
      set({ isLoading: true, error: null });
      const result = await walletService.burnEDLN(userId, amount);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to burn EDLN";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  decryptPrivateKey: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const result = await walletService.decryptPrivateKey(userId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to decrypt private key";
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  resetState: () => {
    set({ isLoading: false, error: null });
  },
}));

export default useWalletStore;
