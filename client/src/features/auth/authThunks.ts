import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/features/auth/api";
import Storage from "@/lib/storage";
import { TOKEN_KEYS } from "@/utils/constants";
import {
  LoginCredentials,
  RegisterPayloads,
  EmailField,
  ResetPasswordCredentials,
  User,
} from "@/types";

// Initialize Auth (check token, refresh if needed)
export const initializeAuthThunk = createAsyncThunk<User | null>(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const token = Storage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (!token) return null;

    try {
      const user = await authService.getMe();
      return user;
    } catch {
      try {
        await authService.refreshToken();
        const user = await authService.getMe();
        return user;
      } catch {
        await authService.logout();
        return rejectWithValue(null);
      }
    }
  }
);

// Login
export const loginThunk = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    await authService.login(credentials);
    const user = await authService.getMe();
    return user;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed, please try again.";
    return rejectWithValue(msg);
  }
});

// Register
export const registerThunk = createAsyncThunk<
  void,
  RegisterPayloads,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    await authService.register(credentials);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed.";
    return rejectWithValue(msg);
  }
});

// Logout
export const logoutThunk = createAsyncThunk<
  void, // success payload type
  void, // argument type
  { rejectValue: string } // rejected payload type
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || error?.message || "Logout failed";
    return rejectWithValue(msg);
  }
});

// Forgot Password
export const forgotPasswordThunk = createAsyncThunk<
  void,
  EmailField,
  { rejectValue: string }
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    await authService.forgotPassword(payload);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || error?.message || "Request failed.";
    return rejectWithValue(msg);
  }
});

// Reset Password
export const resetPasswordThunk = createAsyncThunk<
  void,
  ResetPasswordCredentials,
  { rejectValue: string }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    await authService.resetPassword(payload);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || error?.message || "Reset failed.";
    return rejectWithValue(msg);
  }
});
