import httpClient from "../utils/httpClient";

interface Reward {
  id: string;
  type: 'certificate' | 'points';
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
  ipfs?: string;
}

interface UserRewardWithDetails {
  id: string;
  type: 'certificate' | 'points';
  title: string;
  description: string;
  earnedAt: string;
  signature?: string;
}

export class RewardsService {
  async claimReward(userId: string, rewardId: string): Promise<any> {
    try {
      const response = await httpClient.post('/rewards/claim', { userId, rewardId });
      return response.data;
    } catch (error: any) {
      console.error(`Error claiming reward ${rewardId} for user ${userId}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to claim reward';
      throw new Error(errorMessage);
    }
  }

  async getAllRewards(): Promise<Reward[]> {
    try {
      const response = await httpClient.get('/rewards');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching rewards:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch rewards';
      throw new Error(errorMessage);
    }
  }

  async getRewardById(id: string): Promise<Reward> {
    try {
      const response = await httpClient.get(`/rewards/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching reward with ID ${id}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch reward';
      throw new Error(errorMessage);
    }
  }
  async getUserRewards(userId: string): Promise<UserRewardWithDetails[]> {
    try {
      const response = await httpClient.get(`/rewards/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching rewards for user ${userId}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch user rewards';
      throw new Error(errorMessage);
    }
  }

  async getUserCertificateCount(userId: string): Promise<number> {
    try {
      const response = await httpClient.get(`/rewards/user/${userId}/certificate-count`);
      return response.data.count;
    } catch (error: any) {
      console.error(`Error fetching certificate count for user ${userId}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch certificate count';
      throw new Error(errorMessage);
    }
  }

  async getUsersWithReward(rewardId: string): Promise<any[]> {
    try {
      const response = await httpClient.get(`/rewards/recipients/${rewardId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching users with reward ${rewardId}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch reward recipients';
      throw new Error(errorMessage);
    }
  }
}
