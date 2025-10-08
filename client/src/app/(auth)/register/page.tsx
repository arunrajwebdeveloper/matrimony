"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { ROUTES } from "@/utils/constants";
import { useAppSelector } from "@/hooks";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const { isLoading, error, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // or loading spinner
  }

  return <RegisterForm />;
};

export default LoginPage;
