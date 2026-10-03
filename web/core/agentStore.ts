import { AgentService } from "../services/agent.service";
import type { Agent, createAgentRequest } from "../types/agent.types";
import { create } from "zustand";

const agentService = new AgentService();

export interface AgentStore {
  agent: Agent | null;
  userHasAgent: boolean;
  isLoading: boolean;
  error: string | null;
  fetchUserAgent: (userId: string) => Promise<void>;
  fetchAgent: (agentId: string) => Promise<void>;
  createAgent: (request: createAgentRequest) => Promise<Agent | undefined>;
  uploadAgentProfilePicture: (
    agentId: string,
    file: File | Blob,
    filename?: string,
  ) => Promise<{ profile_picture_url: string }>;
  resetState: () => void;
}

const useAgentStore = create<AgentStore>((set) => ({
  agent: null,
  userHasAgent: false,
  isLoading: false,
  error: null,

  fetchUserAgent: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const agent = await agentService.getUserAgent(userId);
      set({ agent, userHasAgent: true, isLoading: false });
    } catch {
      set({
        agent: null,
        userHasAgent: false,
        isLoading: false,
        error: "Failed to load agent",
      });
    }
  },

  fetchAgent: async (agentId: string) => {
    try {
      set({ isLoading: true, error: null });
      const agent = await agentService.getAgent(agentId);
      set({ agent, userHasAgent: true, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Failed to load agent" });
    }
  },

  createAgent: async (request: createAgentRequest) => {
    try {
      set({ isLoading: true, error: null });
      const agent = await agentService.createAgent(request);
      set({ agent, userHasAgent: true, isLoading: false });
      return agent;
    } catch {
      set({ isLoading: false, error: "Failed to create agent" });
      return undefined;
    }
  },

  uploadAgentProfilePicture: async (
    agentId: string,
    file: File | Blob,
    filename?: string,
  ) => {
    try {
      const result = await agentService.uploadAgentProfilePicture(
        agentId,
        file,
        filename,
      );
      set((state) => ({
        agent:
          state.agent?.id === agentId
            ? { ...state.agent, profile_picture_url: result.profile_picture_url }
            : state.agent,
      }));
      return result;
    } catch {
      set({ error: "Failed to upload agent photo" });
      throw new Error("Failed to upload agent photo");
    }
  },

  resetState: () => {
    set({
      agent: null,
      userHasAgent: false,
      isLoading: false,
      error: null,
    });
  },
}));

export default useAgentStore;
