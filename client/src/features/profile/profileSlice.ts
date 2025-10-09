import { createSlice } from "@reduxjs/toolkit";
import { UserDetailState } from "@/types";
import { fetchProfileById, getMyProfile } from "./profileThunks";

const initialState: UserDetailState = {
  data: null,
  isLoading: false,
  error: null,
  notFound: false,
};

const usersSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearUserDetail: (state) => {
      state.data = null;
      state.error = null;
      state.notFound = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notFound = false;
        state.data = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload === "NOT_FOUND") {
          state.notFound = true;
        } else {
          state.error = action.payload || "Failed to fetch user";
        }
      });

    builder
      .addCase(getMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notFound = false;
        state.data = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload === "NOT_FOUND") {
          state.notFound = true;
        } else {
          state.error = action.payload || "Failed to fetch profile";
        }
      });
  },
});

export const { clearUserDetail } = usersSlice.actions;
export default usersSlice.reducer;
