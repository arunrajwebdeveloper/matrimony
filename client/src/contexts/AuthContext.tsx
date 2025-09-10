"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { authService } from "@/lib/auth";
import Storage from "@/lib/storage";
import {
  AuthState,
  AuthContextType,
  AuthAction,
  AuthActionType,
  LoginCredentials,
  AuthResult,
  User,
  RegisterPayloads,
  EmailField,
  ResetPasswordCredentials,
} from "@/types";
import { TOKEN_KEYS } from "@/utils/constants";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AuthActionType.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AuthActionType.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionType.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionType.REGISTER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AuthActionType.REQUEST_PASSWORD_RESET_LINK_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionType.REQUEST_PASSWORD_RESET_LINK_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionType.REQUEST_PASSWORD_RESET_LINK_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AuthActionType.RESET_PASSWORD_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionType.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionType.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AuthActionType.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AuthActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };

    case AuthActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      const token = Storage.getItem(TOKEN_KEYS.ACCESS_TOKEN);

      if (token) {
        try {
          const user = await authService.getMe();
          dispatch({ type: AuthActionType.SET_USER, payload: user });
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            await authService.refreshToken();
            const user = await authService.getMe();
            dispatch({ type: AuthActionType.SET_USER, payload: user });
          } catch (refreshError) {
            dispatch({ type: AuthActionType.LOGOUT });
          }
        }
      } else {
        dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    dispatch({ type: AuthActionType.LOGIN_START });

    try {
      await authService.login(credentials);
      const user = await authService.getMe();

      if (!user) {
        throw new Error("No user data received");
      }

      dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: { user } });
      return { success: true };
    } catch (error: any) {
      console.error("❌ Login failed in context:", error);

      let errorMessage = "Login failed";

      if (error.response) {
        // Server responded with error status
        console.error("📡 Server error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error("🌐 Network error - no response:", error.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        console.error("⚠️ Other error:", error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }

      dispatch({ type: AuthActionType.LOGIN_FAILURE, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // register

  const register = async (
    credentials: RegisterPayloads
  ): Promise<AuthResult> => {
    dispatch({ type: AuthActionType.REGISTER_START });

    try {
      await authService.register(credentials);
      dispatch({ type: AuthActionType.REGISTER_SUCCESS });
      return { success: true };
    } catch (error: any) {
      console.error("❌ Register failed in context:", error);

      let errorMessage = "Register failed";

      if (error.response) {
        // Server responded with error status
        console.error("📡 Server error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error("🌐 Network error - no response:", error.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        console.error("⚠️ Other error:", error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }

      dispatch({
        type: AuthActionType.REGISTER_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: AuthActionType.LOGOUT });
    }
  };

  // Request password reset link
  const forgotPassword = async (payload: EmailField): Promise<AuthResult> => {
    dispatch({ type: AuthActionType.REQUEST_PASSWORD_RESET_LINK_START });

    try {
      await authService.forgotPassword(payload);
      dispatch({ type: AuthActionType.REQUEST_PASSWORD_RESET_LINK_SUCCESS });
      return { success: true };
    } catch (error: any) {
      console.error("❌ Reset password link request failed in context:", error);

      let errorMessage = "Reset password link request failed";

      if (error.response) {
        // Server responded with error status
        console.error("📡 Server error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error("🌐 Network error - no response:", error.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        console.error("⚠️ Other error:", error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }

      dispatch({
        type: AuthActionType.REQUEST_PASSWORD_RESET_LINK_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Reset password reset link
  const resetPassword = async (
    payload: ResetPasswordCredentials
  ): Promise<AuthResult> => {
    dispatch({ type: AuthActionType.RESET_PASSWORD_START });

    try {
      await authService.resetPassword(payload);
      dispatch({ type: AuthActionType.RESET_PASSWORD_SUCCESS });
      return { success: true };
    } catch (error: any) {
      console.error("❌ Reset password failed in context:", error);

      let errorMessage = "Reset password failed";

      if (error.response) {
        // Server responded with error status
        console.error("📡 Server error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error("🌐 Network error - no response:", error.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        console.error("⚠️ Other error:", error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }

      dispatch({
        type: AuthActionType.RESET_PASSWORD_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: AuthActionType.CLEAR_ERROR });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
