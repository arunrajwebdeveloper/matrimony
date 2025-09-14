import { AxiosError } from "axios";
import api from "./api";
import Storage from "./storage";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  LoginCredentials,
  AuthResponse,
  User,
  RefreshTokenResponse,
  RegisterPayloads,
  EmailField,
  ResetPasswordCredentials,
  ApiResponse,
  ResetPasswordResponse,
} from "@/types";
import { TOKEN_KEYS } from "@/utils/constants";

export const authService = {
  // Login function

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      const { accessToken } = response?.data?.result;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      Storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

      return { accessToken };
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

  // Register

  async register(credentials: RegisterPayloads) {
    try {
      await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.REGISTER,
        credentials
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Register error:", {
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
      const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.ME);
      return response?.data?.result;
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
      const response = await api.post<ApiResponse<RefreshTokenResponse>>(
        API_ENDPOINTS.REFRESH
      );
      const { accessToken } = response?.data?.result;
      Storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      return accessToken;
    } catch (error) {
      Storage.clear();
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },

  // send password reset link
  async forgotPassword(payload: EmailField) {
    try {
      await api.post<ApiResponse<ResetPasswordResponse>>(
        API_ENDPOINTS.FORGOT_PASSWORD,
        payload
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },

  // reset password
  async resetPassword(payload: ResetPasswordCredentials) {
    try {
      await api.post<ApiResponse<ResetPasswordResponse>>(
        API_ENDPOINTS.RESET_PASSWORD,
        payload
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
};
