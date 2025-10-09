import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { blockUserThunk, sendInterestThunk } from "./interactionThunks";

interface InteractionState {
  loadingMap: Record<string, string | null>; // { [userId]: 'sending' | 'accepting' | 'blocking' | null }
  error?: string | null;
}

const initialState: InteractionState = {
  loadingMap: {},
  error: null,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    resetLoading(state, action: PayloadAction<string>) {
      delete state.loadingMap[action.payload];
    },
  },
  extraReducers: (builder) => {
    // ---------- Send Interest ----------
    builder
      .addCase(sendInterestThunk.pending, (state, action) => {
        const userId = action.meta.arg;
        state.loadingMap[userId] = "sending";
      })
      .addCase(sendInterestThunk.fulfilled, (state, action) => {
        const userId = action.payload.targetUserId;
        state.loadingMap[userId] = null;
      })
      .addCase(sendInterestThunk.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.loadingMap[userId] = null;
        state.error = action.payload as string;
      });

    // ---------- Block User ----------
    builder
      .addCase(blockUserThunk.pending, (state, action) => {
        const userId = action.meta.arg;
        state.loadingMap[userId] = "blocking";
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        const userId = action.payload.targetUserId;
        state.loadingMap[userId] = null;
      })
      .addCase(blockUserThunk.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.loadingMap[userId] = null;
        state.error = action.payload as string;
      });
  },
});

export const { resetLoading } = interactionSlice.actions;
export default interactionSlice.reducer;
