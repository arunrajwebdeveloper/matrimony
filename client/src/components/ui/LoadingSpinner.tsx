import React from "react";
import { LoadingSpinnerProps } from "@/types";

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
    xl: "h-32 w-32",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]} ${className}`}
    />
  );
};

export default LoadingSpinner;
