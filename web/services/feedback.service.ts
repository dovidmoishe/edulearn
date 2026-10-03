import type {
  CreateFeedbackRequest,
  FeedbackResponse,
} from "../types/feedback.types";
import httpClient from "../utils/httpClient";

export class FeedbackService {
  async submitFeedback(
    request: CreateFeedbackRequest,
  ): Promise<FeedbackResponse> {
    const response = await httpClient.post<FeedbackResponse>(
      "/feedback",
      request,
    );
    return response.data;
  }
}

export const feedbackService = new FeedbackService();
