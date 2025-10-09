import api from "@/lib/api";
import { API_ENDPOINTS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Example: Send interest
export const sendInterestThunk = createAsyncThunk(
  "interaction/sendInterest",
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_ENDPOINTS.SEND_INTEREST}/${targetUserId}`
      );
      return { targetUserId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Example: Block user
export const blockUserThunk = createAsyncThunk(
  "interaction/blockUser",
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/interactions/block`, {
        targetUserId,
      });
      return { targetUserId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
