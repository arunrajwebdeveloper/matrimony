"use client";

import AuthBanner from "@/components/auth/AuthBanner";
import { useAppSelector } from "@/hooks";
import { ROUTES } from "@/utils/constants";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, error, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  return (
    <div className="flex h-dvh">
      <div className="h-dvh w-full relative flex items-center justify-center">
        <AuthBanner />
      </div>
      <div className="h-dvh w-[450px] flex-none overflow-y-auto py-10 px-16">
        <div className="mb-6">
          <Link
            href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
            className="font-bold text-lg text-blue-600"
          >
            Matrimony
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
