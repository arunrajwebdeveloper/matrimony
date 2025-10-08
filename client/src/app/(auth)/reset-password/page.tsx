"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useAppSelector } from "@/hooks";

const ResetPasswordPage: React.FC = () => {
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

  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
