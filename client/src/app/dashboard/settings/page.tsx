"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { UserProfile } from "@/types";
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
import { dateOfBirthFormat } from "@/lib/dateOfBirthFormat";
import ProfileImagesGrid from "@/components/profile/ProfileImagesGrid";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProfileSettings from "@/components/settings/ProfileSettings";
import Link from "next/link";

const pageBreadcrumbs = [
  { label: "Dashboard", href: ROUTES.DASHBOARD },
  { label: "Settings", href: "" },
];

const settingsMenu = [
  { label: "My Profile", href: "" },
  { label: "Security", href: "" },
  { label: "Notification", href: "" },
  { label: "Delete Account", href: "" },
];

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500 ">{label}</label>
    <p className="mt-1 text-sm font-semibold text-gray-800 ">{value}</p>
  </div>
);

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await api.get<UserProfile>(API_ENDPOINTS.PROFILE);
        setProfileData(response.data);
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
        <Breadcrumb breadcrumbs={pageBreadcrumbs} />
      </div>

      <div className="flex">
        <div className="w-[25%] px-2">
          <div className="mt-5">
            <div className="py-4">
              <div className="mb-8">
                <UserSummaryDisplay
                  avatar={user?.profile?.profilePicture}
                  username={user?.fullName || ""}
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
              <div className="w-[25%]">
                <div className="ps-4">
                  <h3 className="font-semibold text-black text-md mb-6">
                    Account Settings
                  </h3>
                  <div className="space-y-2">
                    {settingsMenu?.map((item, i) => {
                      const first = i === 0;
                      return (
                        <Link
                          key={item?.label}
                          className={`block px-3 py-2 font-normal text-sm transition rounded-md ${
                            first
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
              <div className="w-[75%]">
                <ProfileSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
