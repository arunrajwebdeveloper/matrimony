export * from "./auth";
export * from "./api";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
