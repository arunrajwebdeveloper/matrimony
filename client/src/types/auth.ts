export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  _id?: string;
  user?: string;
  firstName?: string;
  lastName?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string; // ISO format
  religion?: string;
  motherTongue?: string;
  height?: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;
  disabilityStatus?: string;
  aboutMe?: string;
  phoneNumber?: string;
  alternateEmails?: string[];
  country?: string;
  state?: string;
  city?: string;
  residencyStatus?: string;
  familyType?: string;
  familyStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  sisters?: number;
  brothersMarried?: number;
  sistersMarried?: number;
  familyValues?: string;
  educationLevel?: string;
  educationField?: string;
  occupation?: string;
  annualIncome?: number;
  diet?: string;
  smokingHabit?: "Yes" | "No" | "Occasionally";
  drinkingHabit?: "Yes" | "No" | "Occasionally";
  hobbies?: string[];
  interests?: string[];
  maritalStatus?: string;
  children?: number;
  profilePhotos?: string[];
  profilePicture?: string;
  visibility?: "public" | "private";
  isPremium?: boolean;
  verification?: {
    phone?: boolean;
    email?: boolean;
    id?: boolean;
    profileReview?: "pending" | "approved" | "rejected";
  };
  deletedAt?: string | null;
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
