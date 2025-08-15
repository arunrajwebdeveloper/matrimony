export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  REFRESH: "/api/auth/refresh",
  ME: "/api/users/me",
  PROFILE: "/api/profiles/my-profile",
  USER_BY_PROFILE_ID: "/api/profiles",
  LOGOUT: "/api/auth/logout",
} as const;

export const TOKEN_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const ROUTES = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  HOME: "/",
  SETTINGS: {
    DEFAULT: "/dashboard/settings/my-profile",
    MY_PROFILE: "/dashboard/settings/my-profile",
    SECURITY: "/dashboard/settings/security",
    NOTIFICATION: "/dashboard/settings/notification",
    DELETE_ACCOUNT: "/dashboard/settings/delete-account",
  },
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type TokenKey = (typeof TOKEN_KEYS)[keyof typeof TOKEN_KEYS];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
