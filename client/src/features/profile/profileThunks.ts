import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/utils/constants";
import { ApiResponse, UserProfile } from "@/types";
import api from "@/lib/api";

export const fetchProfileById = createAsyncThunk<
  UserProfile, // success payload type
  string, // argument type
  { rejectValue: string }
>("profile/fetchProfileById", async (profileId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<UserProfile>>(
      `${API_ENDPOINTS.USER_BY_PROFILE_ID}/${profileId}`
    );

    const result = response?.data?.result;

    if (!result) {
      // API returned 200 but no user
      return rejectWithValue("NOT_FOUND");
    }

    return result;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load profile data";
    return rejectWithValue(msg);
  }
});
