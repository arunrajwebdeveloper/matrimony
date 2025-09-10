type UserProfileType = {
  profilePicture: string | null;
  coverImage: string | null;
  profilePhotos: string[];
  isPremium: boolean;
  visibility: string;
};

export interface User {
  _id?: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  profile: UserProfileType;
  gender: string;
  profileId?: string;
}

export interface EmailField {
  email: string;
}
export interface LoginCredentials extends EmailField {
  password: string;
}

export interface ResetPasswordCredentials {
  password: string;
  confirmPassword?: string;
  token: string;
}

export interface RegisterPayloads extends LoginCredentials {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
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
  register: (credentials: RegisterPayloads) => Promise<AuthResult>;
  forgotPassword: (credentials: EmailField) => Promise<AuthResult>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<AuthResult>;
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

  REGISTER_START = "REGISTER_START",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_FAILURE = "REGISTER_FAILURE",

  REQUEST_PASSWORD_RESET_LINK_START = "REQUEST_PASSWORD_RESET_LINK_START",
  REQUEST_PASSWORD_RESET_LINK_SUCCESS = "REQUEST_PASSWORD_RESET_LINK_SUCCESS",
  REQUEST_PASSWORD_RESET_LINK_FAILURE = "REQUEST_PASSWORD_RESET_LINK_FAILURE",

  RESET_PASSWORD_START = "RESET_PASSWORD_START",
  RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS",
  RESET_PASSWORD_FAILURE = "RESET_PASSWORD_FAILURE",

  LOGOUT = "LOGOUT",
  SET_LOADING = "SET_LOADING",
  SET_USER = "SET_USER",
  CLEAR_ERROR = "CLEAR_ERROR",
}

export type AuthAction =
  | { type: AuthActionType.LOGIN_START }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: { user: User } }
  | { type: AuthActionType.LOGIN_FAILURE; payload: string }
  | { type: AuthActionType.REGISTER_START }
  | { type: AuthActionType.REGISTER_SUCCESS }
  | { type: AuthActionType.REGISTER_FAILURE; payload: string }
  | { type: AuthActionType.REQUEST_PASSWORD_RESET_LINK_START }
  | { type: AuthActionType.REQUEST_PASSWORD_RESET_LINK_SUCCESS }
  | {
      type: AuthActionType.REQUEST_PASSWORD_RESET_LINK_FAILURE;
      payload: string;
    }
  | { type: AuthActionType.RESET_PASSWORD_START }
  | { type: AuthActionType.RESET_PASSWORD_SUCCESS }
  | {
      type: AuthActionType.RESET_PASSWORD_FAILURE;
      payload: string;
    }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.SET_LOADING; payload: boolean }
  | { type: AuthActionType.SET_USER; payload: User | null }
  | { type: AuthActionType.CLEAR_ERROR };
