import type {
  PublicSurvey,
  SubmitSurveyResponseRequest,
  SubmitSurveyResponseResult,
} from "../types/survey.types";
import httpClient from "../utils/httpClient";

export class SurveyService {
  async getActiveSurvey(): Promise<PublicSurvey> {
    const response = await httpClient.get<PublicSurvey>("/surveys/active");
    return response.data;
  }

  async getSurveyBySlug(slug: string): Promise<PublicSurvey> {
    const response = await httpClient.get<PublicSurvey>(
      `/surveys/slug/${encodeURIComponent(slug)}`,
    );
    return response.data;
  }

  async submitSurveyResponse(
    surveyId: string,
    request: SubmitSurveyResponseRequest,
  ): Promise<SubmitSurveyResponseResult> {
    const response = await httpClient.post<SubmitSurveyResponseResult>(
      `/surveys/${surveyId}/responses`,
      request,
    );
    return response.data;
  }
}

export const surveyService = new SurveyService();
