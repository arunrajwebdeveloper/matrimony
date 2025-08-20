export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const API_ENDPOINTS = {
  // AUTH
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  REFRESH: "/api/auth/refresh",
  LOGOUT: "/api/auth/logout",

  // PROFILE
  ME: "/api/users/me",
  PROFILE: "/api/profiles/my-profile",
  USER_BY_PROFILE_ID: "/api/profiles",
  PREFERRED_MATCHES_LIST: "/api/matches/preferred",
  NEW_MATCHES_LIST: "/api/matches/new",
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
  PROFILE_SETTINGS: {
    IMAGE_UPLOADS: "image-uploads",
    PERSONAL_DETAILS: "personal-details",
    EDUCATION_CAREER: "education-and-career",
    LOCATION_RESIDENCY: "location-and-residency",
    FAMILY_DETAILS: "family-details",
    LIFESTYLE: "lifestyle",
    HOROSCOPE_DETAILS: "horoscope-details",
    PARTNER_PREFERENCES: "partner-preferences",
    PROFILE_PRIVACY: "profile-privacy",
  },
  HOME: "/",
  SETTINGS: {
    DEFAULT: "/dashboard/settings/security",
    SECURITY: "/dashboard/settings/security",
    NOTIFICATION: "/dashboard/settings/notification",
    DELETE_ACCOUNT: "/dashboard/settings/delete-account",
  },
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type TokenKey = (typeof TOKEN_KEYS)[keyof typeof TOKEN_KEYS];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
