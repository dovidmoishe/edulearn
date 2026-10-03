import httpClient from "../utils/httpClient";
import type {
  ActivityListResponse,
  ActivityType,
  CreateActivityRequest,
  QuizXpTotalResponse,
  SubmitQuizRequest,
  XpActivity,
} from "../types/activity.types";

export class ActivityService {
  private normalizeActivityList(
    response: ActivityListResponse,
    fallback?: { userId?: string; type?: ActivityType },
  ): XpActivity[] {
    const activities = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.activities)
          ? response.activities
          : [];

    return activities.map((activity) => ({
      id: activity.id,
      userId: activity.userId ?? fallback?.userId ?? "",
      type: activity.type ?? fallback?.type ?? "chat",
      title: activity.title ?? "Activity",
      xpEarned: activity.xpEarned ?? 0,
      createdAt: activity.createdAt,
    }));
  }

  async createActivity(data: CreateActivityRequest): Promise<XpActivity> {
    try { 
      const response = await httpClient.post<XpActivity>('/activity', data);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async submitQuiz(data: SubmitQuizRequest) {
    try {
      const response = await httpClient.post('/activity/submit-quiz', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async getActivitiesByUser(userId: string): Promise<XpActivity[]> {
    try {
      const response = await httpClient.get<ActivityListResponse>(`/activity/user/${userId}`);
      return this.normalizeActivityList(response.data, { userId });
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  }

  async getQuizActivitiesByUser(userId: string): Promise<XpActivity[]> {
    try {
      const response = await httpClient.get<ActivityListResponse>(`/activity/user/${userId}/quiz`);
      return this.normalizeActivityList(response.data, { userId, type: "quiz" });
    } catch (error) {
      console.error('Error fetching quiz activities:', error);
      throw error;
    }
  }

  async getQuizXpTotal(userId: string): Promise<{ total: number }> {
    try {
      const response = await httpClient.get<QuizXpTotalResponse>(`/activity/user/${userId}/xp/quiz`);
      return { total: response.data.total ?? response.data.totalXp ?? 0 };
    } catch (error) {
      console.error('Error fetching quiz XP total:', error);
      throw error;
    }
  }

  async getXpByType(userId: string, type: ActivityType): Promise<{ total: number }> {
    try {
      const response = await httpClient.get<QuizXpTotalResponse>(`/activity/user/${userId}/xp?type=${type}`);
      return { total: response.data.total ?? response.data.totalXp ?? 0 };
    } catch (error) {
      console.error(`Error fetching ${type} XP:`, error);
      throw error;
    }
  }

  async getUserWithActivities(userId: string) {
    try {
      const response = await httpClient.get(`/activity/user/${userId}/details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user with activities:', error);
      throw error;
    }
  }

  async getAllActivities() {
    try {
      const response = await httpClient.get<ActivityListResponse>('/activity');
      return this.normalizeActivityList(response.data);
    } catch (error) {
      console.error('Error fetching all activities:', error);
      throw error;
    }
  }
}
