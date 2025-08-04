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
      originalRequest._retry = true;

      try {
        // Try to refresh the token using our Next.js API route
        const refreshResponse = await axios.post<RefreshTokenResponse>(
          API_ENDPOINTS.REFRESH,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;
        Storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Storage.clear();
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
