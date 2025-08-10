export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REFRESH: "/api/auth/refresh",
  ME: "/api/users/me",
  PROFILE: "/api/profiles/my-profile",
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
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type TokenKey = (typeof TOKEN_KEYS)[keyof typeof TOKEN_KEYS];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
