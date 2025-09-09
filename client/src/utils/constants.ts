export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const API_ENDPOINTS = {
  // AUTH
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  REFRESH: "/api/auth/refresh",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  LOGOUT: "/api/auth/logout",

  // PROFILE
  ME: "/api/users/me",
  PROFILE: "/api/profiles/my-profile",
  USER_BY_PROFILE_ID: "/api/profiles",
  PREFERRED_MATCHES_LIST: "/api/matches/preferred",
  NEW_MATCHES_LIST: "/api/matches/new",

  PROFILE_PICTURE_UPLOAD: "/api/users/profile-picture",
  PROFILE_COVER_UPLOAD: "/api/users/profile-cover",
  PROFILE_IMAGES_UPLOAD: "/api/users/profile-photos",

  // ACTIVITIES

  ACTIVITY_LOG: "/api/activities/log",
  ACTIVITY_RECENT_GET: "/api/activities/recent",
  ACTIVITY_ALL_GET: "/api/activities/all",

  // FILE UPLOAD

  UPLOAD: {
    SINGLE: "/api/upload/profile-picture",
    MULTIPLE: "/api/upload/profile-photos",
    COVER: "/api/upload/cover-image",
  },
} as const;

export const TOKEN_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const ROUTES = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  PROFILE_ME: "/dashboard/profile/me",
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
  SETTINGS: {
    DEFAULT: "/dashboard/settings/security",
    SECURITY: "/dashboard/settings/security",
    NOTIFICATION: "/dashboard/settings/notification",
    DELETE_ACCOUNT: "/dashboard/settings/delete-account",
  },
  ACCEPTED: "/dashboard/accepted-requests",
  RECENTLY_VIEWED: "/dashboard/recently-viewed",
  SHORTLISTED: "/dashboard/shortlisted",
  SENT_REQUESTS: "/dashboard/sent-requests",
  DECLINED_REQUESTS: "/dashboard/declined-requests",
  BLOCKED: "/dashboard/blocked",
} as const;

export const FOLDER_TYPES = {
  PROFILE_PICTURES: "profile-pictures",
  PROFILE_PHOTOS: "profile-photos",
  COVER_IMAGES: "cover-images",
} as const;

export type FolderType = (typeof FOLDER_TYPES)[keyof typeof FOLDER_TYPES];
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type TokenKey = (typeof TOKEN_KEYS)[keyof typeof TOKEN_KEYS];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
