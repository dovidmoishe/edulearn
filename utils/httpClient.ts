import axios from 'axios';
import { createClient } from './supabase/client';


const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

httpClient.interceptors.request.use(
  async (config) => {
    
    const unauthenticatedEndpoints = ['/auth/signup'];
    const isUnauthenticatedEndpoint = unauthenticatedEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );

    if (isUnauthenticatedEndpoint) {
      return config;
    }

    const supabase = createClient();
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        } else {
        }
    } catch (error) {
      //silent
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
    } else if (error.request) {
    } else {
    }
    return Promise.reject(error);
  }
);

export default httpClient;
