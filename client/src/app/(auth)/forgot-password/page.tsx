"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/utils/constants";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useAppSelector } from "@/hooks/hooks";

const ForgotPasswordPage: React.FC = () => {
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

  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
