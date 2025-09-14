// T is a generic type parameter - it's a placeholder that represents "some type that will be specified later." Think of it as a variable for types.
export interface ApiResponse<T = any> {
  result: T;
  statusCode: number;
  status: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ResetPasswordResponse {
  message: string;
}
