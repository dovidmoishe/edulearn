import httpClient from "../utils/httpClient";

export interface User {
    id: string;
    email: string;
    name: string;
    level: string;
    xp: number;
    referralCode: string;
    referralCount: number;
    referredBy: string | null;
    credits: number;
    address: string | null;
    streak: number;
    username: string;
    quizCompleted: number;
    isPremium: boolean;
    learning?: string;
    lastLoggedIn?: string | Date;
    isVerified?: boolean;
    profilePictureURL: string | null;
}

export class UserService {
    private resolveClientTimeZone(): string {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return tz || "UTC";
        } catch {
            return "UTC";
        }
    }

    async initUser(): Promise<User> {
        try {
            const response = await httpClient.post('/auth/init', {}, {
                headers: {
                    'x-timezone': this.resolveClientTimeZone(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error initializing user:", error);
            throw error;
        }
    }

    async getUser(email: string): Promise<User> {
        try {
            const response = await httpClient.get(`/auth/email/${email}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            const response = await httpClient.get(`/auth/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }

    async createUser(userData: Partial<User>): Promise<User> {
        try {
            
            const response = await httpClient.post('/auth/signup', userData);
            return response.data;
        } catch (error: any) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async editUser(userData: { name: string; email: string; username: string; learning?: string }): Promise<User> {
        try {
            const response = await httpClient.put('/auth/edit', userData);
            return response.data;
        } catch (error) {
            console.error("Error editing user:", error);
            throw error;
        }
    }

    async uploadProfilePicture(
        file: File | Blob,
        filename: string = "photo.jpg"
    ): Promise<{ profilePictureURL: string }> {
        try {
            const formData = new FormData();
            formData.append("image", file, filename);
            const response = await httpClient.post('/auth/profile-picture/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            throw error;
        }
    }

    async updateUserAddress(email: string, address: string): Promise<User> {
        try {
            const response = await httpClient.put(`/auth/address?email=${email}&address=${address}`);
            return response.data;
        } catch (error) {
            console.error("Error updating user address:", error);
            throw error;
        }
    }

    async useReferralCode(code: string): Promise<{ referrer: string }> {
        try {
            const response = await httpClient.post(`/auth/referral?code=${code}`);
            return response.data;
        } catch (error) {
            console.error("Error using referral code:", error);
            throw error;
        }
    }

    async deductCredits(userId: string): Promise<{ credits: number }> {
        try {
            const response = await httpClient.put(`/auth/deduct-credits/${userId}`, {});
            return response.data;
        } catch (error) {
            console.error("Error deducting credits:", error);
            throw error;
        }
    }

    async incrementCredits(userId: string, amount: number): Promise<{ credits: number }> {
        try {
            const response = await httpClient.put(`/auth/credits/${userId}`, { 
                credits: amount 
            });
            return response.data;
        } catch (error) {
            console.error("Error incrementing credits:", error);
            throw error;
        }
    }
    
    async getLeaderboard(): Promise<{ users: User[] }> {
        try {
            const response = await httpClient.get('/auth/leaderboard');
            return response.data;
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            throw error;
        }
    }

    async searchUsers(username: string, limit: number = 10): Promise<User[]> {
        try {
            const response = await httpClient.get(`/auth/search?username=${encodeURIComponent(username)}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error searching users:", error);
            throw error;
        }
    }

    async updateUserXP(userId: string, xp: number): Promise<User> {
        try {
            const response = await httpClient.put(`/auth/xp/${userId}`, { xp });
            return response.data;
        } catch (error) {
            console.error("Error updating user XP:", error);
            throw error;
        }
    }

    async updateUserLevel(userId: string, level: string): Promise<User> {
        try {
            const response = await httpClient.put(`/auth/level/${userId}`, {
                level
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user level:", error);
            throw error;
        }
    }

    async updateUserStreak(userId: string, streak: number): Promise<User> {
        try {
            const response = await httpClient.put(`/auth/streak/${userId}`, {
                streak
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user streak:", error);
            throw error;
        }
    }

    async getUserWalletBalance(_pubKey: string): Promise<{ balance: {sol: number, tokenAccount: number} }> {
        return { balance: { sol: 0, tokenAccount: 0 } };
    }

    async upgradeToPremium(userId: string): Promise<{ message: string, result: any }> {
        try {
            const response = await httpClient.post(`/wallet/upgrade/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error upgrading to premium:", error);
            throw error;
        }
    }

    async updateUserLearning(userData: { name: string; email: string; username: string; learning: string }): Promise<User> {
        try {
            const response = await httpClient.put('/auth/edit', userData);
            return response.data;
        } catch (error) {
            console.error("Error updating user learning:", error);
            throw error;
        }
    }
    async deleteUser(userId: string, supabaseUserId: string): Promise<{ message: string; deletionStarted: boolean }> {
        try {
            const response = await httpClient.delete(`/auth/user/${userId}?supabaseUserId=${supabaseUserId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
}
 
