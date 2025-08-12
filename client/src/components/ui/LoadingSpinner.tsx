import React from "react";
import { LoadingSpinnerProps } from "@/types";

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  return (
    <div className={`spinner-loader  ${className}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default LoadingSpinner;
