import type {
  UnsubscribeRequest,
  UnsubscribeStatusResponse,
} from "../types/unsubscribe.types";
import httpClient from "../utils/httpClient";

export class UnsubscribeService {
  async getStatus(token: string): Promise<UnsubscribeStatusResponse> {
    const response = await httpClient.get<UnsubscribeStatusResponse>(
      "/resend/unsubscribe/status",
      {
        params: { token },
      },
    );
    return response.data;
  }

  async unsubscribe(
    request: UnsubscribeRequest,
  ): Promise<UnsubscribeStatusResponse> {
    const response = await httpClient.post<UnsubscribeStatusResponse>(
      "/resend/unsubscribe",
      request,
    );
    return response.data;
  }
}

export const unsubscribeService = new UnsubscribeService();

