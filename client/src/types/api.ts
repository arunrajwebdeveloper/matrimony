export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
