"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { ApiResponse, UserProfile } from "@/types";
import { API_ENDPOINTS, ROUTES } from "@/utils/constants";
import {
  User,
  Home,
  Heart,
  MapPin,
  Briefcase,
  Pill,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import UserSummaryDisplay from "@/components/profile/UserSummaryDisplay";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import ProfileImagesGrid from "@/components/profile/ProfileImagesGrid";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { useAppSelector } from "@/hooks/hooks";

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500 ">{label}</label>
    <p className="mt-1 text-sm font-semibold text-gray-800 ">{value}</p>
  </div>
);

const settingsMenu = [
  { href: ROUTES.SETTINGS.SECURITY, label: "Security" },
  { href: ROUTES.SETTINGS.NOTIFICATION, label: "Notification" },
  { href: ROUTES.SETTINGS.DELETE_ACCOUNT, label: "Delete Account" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const { isLoading, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await api.get<ApiResponse<UserProfile>>(
          API_ENDPOINTS.PROFILE
        );
        setProfileData(response?.data?.result);
      } catch (err: any) {
        setError("Failed to load profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center fixed top-0 left-0 z-[1000] w-full h-full">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb />
      </div>

      <div className="flex">
        <div className="w-[25%] px-2">
          <div className="mt-5 sticky top-[70px]">
            <div className="py-4">
              <div className="mb-8">
                <UserSummaryDisplay
                  avatar={user?.profile?.profilePicture!}
                  firstname={`${user?.firstName || ""}`}
                  lastname={`${user?.lastName || ""}`}
                  email={user?.email || ""}
                />
              </div>
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[75%] px-2">
          <div className="mt-5">
            <div className="flex gap-2">
              <div className="w-[30%]">
                <div className="ps-4">
                  <h3 className="font-semibold text-black text-md mb-6">
                    Account Settings
                  </h3>
                  <div className="space-y-2">
                    {settingsMenu?.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item?.href}
                          className={`block px-3 py-2 font-normal text-sm transition rounded-md ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "hover:bg-slate-50 text-slate-600"
                          }`}
                          href={item?.href}
                        >
                          <span>{item?.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-[70%] ps-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
