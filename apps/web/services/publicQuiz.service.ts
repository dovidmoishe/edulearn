import httpClient from "../utils/httpClient";
import type {
  ListMyPublicQuizzesResponse,
  ListPublicQuizzesResponse,
  ListQuizzesQuery,
  PublicQuizDetail,
  PublishPublicQuizRequest,
  PublishPublicQuizResponse,
  StartPublicQuizParticipationResponse,
  SubmitPublicQuizRequest,
  SubmitPublicQuizResponse,
} from "../types/quizzes.types";

export class PublicQuizService {
  async publishQuiz(payload: PublishPublicQuizRequest) {
    const response = await httpClient.post<PublishPublicQuizResponse>(
      "/quizzes/public",
      payload,
    );
    return response.data;
  }

  async listPublicQuizzes(query?: ListQuizzesQuery) {
    const response = await httpClient.get<ListPublicQuizzesResponse>(
      "/quizzes/public",
      { params: query },
    );
    return response.data;
  }

  async listMyQuizzes(query?: Pick<ListQuizzesQuery, "limit" | "offset">) {
    const response = await httpClient.get<ListMyPublicQuizzesResponse>(
      "/quizzes/mine",
      { params: query },
    );
    return response.data;
  }

  async getQuizById(quizId: string) {
    const response = await httpClient.get<PublicQuizDetail>(
      `/quizzes/public/${quizId}`,
    );
    return response.data;
  }

  async joinQuiz(quizId: string) {
    const response =
      await httpClient.post<StartPublicQuizParticipationResponse>(
        `/quizzes/public/${quizId}/participate`,
      );
    return response.data;
  }

  async submitQuiz(quizId: string, payload: SubmitPublicQuizRequest) {
    const response = await httpClient.post<SubmitPublicQuizResponse>(
      `/quizzes/public/${quizId}/attempt`,
      payload,
    );
    return response.data;
  }
}
