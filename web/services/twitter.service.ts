import httpClient from "../utils/httpClient";

export interface TwitterProfile {
  id: string;
  name: string;
  username: string;
}

export class TwitterService {
  private clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!;
  private redirectUri: string;

  constructor() {
    if (typeof window !== 'undefined') {
      this.redirectUri = `${window.location.origin}/dashboard/twitter-callback`;
    } else {
      this.redirectUri = '';
    }
  }
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(digest));
  }
  private base64URLEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  async initiateAuth(): Promise<void> {
    try {
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      const stateToken = 'TWITTER_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('twitter_code_verifier', codeVerifier);
      sessionStorage.setItem('twitter_oauth_state', stateToken);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: 'tweet.read users.read offline.access',
        state: stateToken,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
      

      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  async handleCallback(code: string, state: string, userEmail: string): Promise<TwitterProfile> {
    try {
      const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
      const storedState = sessionStorage.getItem('twitter_oauth_state');
      
      if (!codeVerifier) {
        throw new Error('Code verifier not found. Please try connecting again.');
      }

      if (!storedState || storedState !== state) {
        throw new Error('Security validation failed. Please try connecting again.');
      }
      const response = await httpClient.post('/twitter/callback', {
        data: {
          code,
          userEmail,
          redirectUri: this.redirectUri,
          providedCodeVerifier: codeVerifier,
        }
      });
      sessionStorage.removeItem('twitter_code_verifier');
      sessionStorage.removeItem('twitter_oauth_state');

      return response.data;
    } catch (error: any) {
      console.error('Error handling Twitter callback:', error);
      sessionStorage.removeItem('twitter_code_verifier');
      sessionStorage.removeItem('twitter_oauth_state');
      throw new Error(
        error.response?.data?.message || 
        'Failed to connect Twitter account. Please try again.'
      );
    }
  }
  
  async checkVerificationStatus(userEmail: string): Promise<boolean> {
    try {
      const response = await httpClient.get(`/auth/email/${userEmail}`);
      return response.data.isVerified || false;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  }
}

