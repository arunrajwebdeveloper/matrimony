import { AxiosError } from "axios";
import api from "./api";
import Storage from "./storage";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  LoginCredentials,
  AuthResponse,
  User,
  RefreshTokenResponse,
} from "@/types";
import { TOKEN_KEYS } from "@/utils/constants";

export const authService = {
  // Login function

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      const { accessToken, user } = response.data;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      if (!user) {
        throw new Error("No user data received");
      }

      Storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

      return { user, accessToken };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Login error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          baseURL: axiosError.config?.baseURL,
        },
      });
      throw axiosError;
    }
  },

  // Logout function
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Storage.clear();
    }
  },

  // Get user profile
  async getMe(): Promise<User> {
    try {
      const response = await api.get<User>(API_ENDPOINTS.ME);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Storage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    try {
      const response = await api.post<RefreshTokenResponse>(
        API_ENDPOINTS.REFRESH
      );
      const { accessToken } = response.data;
      Storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      return accessToken;
    } catch (error) {
      Storage.clear();
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
};
