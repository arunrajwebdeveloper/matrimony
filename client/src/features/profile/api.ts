import api from "@/lib/api";
import { ApiResponse, MatchResult, UserProfile } from "@/types";
import { API_ENDPOINTS } from "@/utils/constants";

export const profileApi = {
  getProfileById: async (profileId: string): Promise<UserProfile> => {
    try {
      const response = await api.get<ApiResponse<UserProfile>>(
        `${API_ENDPOINTS.USER_BY_PROFILE_ID}/${profileId}`
      );
      return response.data.result;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Profile not found");
      }
      throw new Error(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  },

  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<ApiResponse<UserProfile>>(
        API_ENDPOINTS.PROFILE
      );
      return response.data.result;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Profile not found");
      }
      throw new Error(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  },

  getProfiles: async ({
    endpoint,
    page = 1,
    limit = 10,
  }: {
    endpoint: string;
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }): Promise<MatchResult> => {
    try {
      const params = { page, limit };
      const response = await api.get<ApiResponse<MatchResult>>(endpoint, {
        params,
      });
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to load profiles"
      );
    }
  },
};
