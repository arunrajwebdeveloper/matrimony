export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export enum AuthActionType {
  LOGIN_START = "LOGIN_START",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  SET_LOADING = "SET_LOADING",
  SET_USER = "SET_USER",
  CLEAR_ERROR = "CLEAR_ERROR",
}

export type AuthAction =
  | { type: AuthActionType.LOGIN_START }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: { user: User } }
  | { type: AuthActionType.LOGIN_FAILURE; payload: string }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.SET_LOADING; payload: boolean }
  | { type: AuthActionType.SET_USER; payload: User | null }
  | { type: AuthActionType.CLEAR_ERROR };
