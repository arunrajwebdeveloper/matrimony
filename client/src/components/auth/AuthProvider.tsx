"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthProviderProps } from "@/types";

const AuthProviderWrapper: React.FC<AuthProviderProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;
