import httpClient from "../utils/httpClient";
import type { Agent, createAgentRequest } from "../types/agent.types";

export class AgentService {
  async createAgent(request: createAgentRequest): Promise<Agent> {
    const response = await httpClient.post<Agent>("/agent", request);
    return response.data;
  }

  async getAgent(agentId: string): Promise<Agent> {
    const response = await httpClient.get<Agent>(`/agent/${agentId}`);
    return response.data;
  }

  async getUserAgent(userId: string): Promise<Agent> {
    const response = await httpClient.get<Agent>(`/agent/user/${userId}`);
    return response.data;
  }

  async uploadAgentProfilePicture(
    agentId: string,
    file: File | Blob,
    filename = "photo.jpg",
  ): Promise<{ profile_picture_url: string }> {
    const formData = new FormData();
    formData.append("image", file, filename);
    const response = await httpClient.post<{ profile_picture_url: string }>(
      `/agent/${agentId}/profile-picture/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }
}
