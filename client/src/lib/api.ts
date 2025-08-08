import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  ROUTES,
  TOKEN_KEYS,
} from "@/utils/constants";
import { RefreshTokenResponse } from "@/types/api";
import Storage from "./storage";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// A global variable to track if a refresh is in progress
let isRefreshing = false;

// Interface to define the shape of a queued request promise
interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

// A queue to store failed requests waiting for a new token
let failedQueue: FailedRequestQueueItem[] = [];

// Helper function to process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      // If the refresh failed, reject all queued requests
      prom.reject(error);
    } else if (token) {
      // If refresh succeeded, resolve the queued promises with the new token
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add access token
api.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = Storage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Set a flag on the original request to prevent an infinite loop
      originalRequest._retry = true;

      // Create a promise to hold the failed request
      const retryOriginalRequest = new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      // If a refresh is not currently in progress, start one
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Try to refresh the token using our Next.js API route
          const refreshResponse = await axios.post<RefreshTokenResponse>(
            API_ENDPOINTS.REFRESH,
            {},
            { withCredentials: true }
          );

          const { accessToken } = refreshResponse.data;
          Storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

          // Update the default header for all subsequent requests
          // This is a good practice to ensure new requests use the new token immediately
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // Process the queue of failed requests with the new token
          processQueue(null, accessToken);
        } catch (refreshError) {
          // If the refresh token request fails, clear the queue and reject all requests
          processQueue(refreshError, null);
          Storage.clear();
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
          return Promise.reject(refreshError);
        } finally {
          // Regardless of success or failure, set the flag back to false
          isRefreshing = false;
        }
      }

      // If a refresh is already in progress, return the pending promise.
      // This promise will resolve or reject once the ongoing refresh is done.
      return retryOriginalRequest.then((token) => {
        // Update the header of the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        // Re-send the original request with the new token
        return api(originalRequest);
      });
    }

    // For any other error, just reject the promise
    return Promise.reject(error);
  }
);

export default api;
