"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/hooks";

const HomePage: React.FC = () => {
  const router = useRouter();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Matrimony</h1>

        {isAuthenticated ? (
          <div>
            <p className="text-xl mb-6">
              Hello, {user?.firstName || user?.email}!
            </p>
            <div className="space-x-4">
              <Link
                href={ROUTES.DASHBOARD}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
              >
                Go to Dashboard
              </Link>
              <Link
                href={ROUTES.PROFILE}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 inline-block"
              >
                View Profile
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xl mb-6">Please log in to your account</p>
            <Link
              href={ROUTES.LOGIN}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
