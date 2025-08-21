"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { UserProfile } from "@/types";
import { API_ENDPOINTS } from "@/utils/constants";
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
import { dateOfBirthFormat } from "@/lib/dateOfBirthFormat";
import ProfileImagesGrid from "@/components/profile/ProfileImagesGrid";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useParams } from "next/navigation";
import ProfileUserCard from "@/components/profile/ProfileUserCard";
import SidebarCard from "@/components/cards/SidebarCard";
import UserCardSidebarItem from "@/components/profile/UserCardSidebarItem";
import useActivityLogger from "@/hooks/useActivityLogger";
import { ActivityVerb } from "@/utils/activity.enum";

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500 ">{label}</label>
    <p className="mt-1 text-sm font-semibold text-gray-800 ">{value}</p>
  </div>
);

const ProfilePage: React.FC = () => {
  // THIS NOT NEEDED - ITS FOR AVOID TWICE API CALL

  const logActivity = useActivityLogger();
  const { profileId } = useParams<{ profileId: string }>();

  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await api.get<UserProfile>(
          `${API_ENDPOINTS.USER_BY_PROFILE_ID}/${profileId}`
        );
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

  useEffect(() => {
    if (profileData) {
      logActivity(ActivityVerb.VIEWED_PROFILE, profileData?._id as string);
    }
  }, [profileData, logActivity]);

  const profileCompletionInfo = {
    firstName: profileData?.firstName,
    dateOfBirth: profileData?.dateOfBirth,
    profilePicture: profileData?.profilePicture,
    state: profileData?.state,
    city: profileData?.city,
    aboutMe: profileData?.aboutMe,
    phoneNumber: profileData?.phoneNumber,
    occupation: profileData?.occupation,
    verification: {
      phone: profileData?.verification?.phone,
      email: profileData?.verification?.email,
      id: profileData?.verification?.id,
    },
  };

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
          <div className="mt-5">
            <div className="py-4">
              {/* <h3 className="font-semibold text-black text-md mb-6">Profile</h3> */}
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[50%] px-2">
          <div className="mt-5">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <div className="px-6 py-4">
                <ProfileUserCard
                  profileData={profileData}
                  cover="/cover/cover-image-1.jpg"
                  currentUser={user}
                />
              </div>

              {/* -------- */}

              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <BookOpen size={20} className="mr-2 text-black" />
                  Basic Contacts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-500 flex gap-1 items-center">
                      <span>Email</span>
                      <span className="text-xs font-normal text-green-500 flex gap-1 items-center select-none">
                        <ShieldCheck size={18} color="white" fill="#00c951" />
                        <span>Verified</span>
                      </span>
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800 ">
                      {user?.email}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-500  flex gap-1 items-center">
                      <span>Phone Number</span>
                      <span className="text-xs font-normal text-red-500 flex gap-1 items-center select-none">
                        <ShieldCheck size={18} color="white" fill="#fb2c36" />
                        <span>Not verified</span>
                      </span>
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800 flex gap-1 items-center">
                      {user?.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <ProfileImagesGrid mediaItems={profileData?.profilePhotos} />
              {/* About me */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <BookOpen size={20} className="mr-2 text-black" />
                  {`About ${profileData?.firstName || "Me"}`}
                </h3>
                <div>
                  <p className="text-sm text-gray-600 font-normal leading-6">
                    {profileData?.aboutMe || "N/A"}
                  </p>
                </div>
              </div>
              {/* Personal Information */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <User size={20} className="mr-2 text-black" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="First Name"
                    value={profileData?.firstName || "N/A"}
                  />
                  <DetailRow
                    label="Last Name"
                    value={profileData?.lastName || "N/A"}
                  />
                  <DetailRow
                    label="Gender"
                    value={profileData?.gender || "N/A"}
                  />
                  <DetailRow
                    label="Date of Birth"
                    value={dateOfBirthFormat(profileData?.dateOfBirth)}
                  />
                  <DetailRow
                    label="Religion"
                    value={profileData?.religion || "N/A"}
                  />
                  <DetailRow
                    label="Mother Tongue"
                    value={profileData?.motherTongue || "N/A"}
                  />
                </div>
              </div>

              {/* Physical Attributes & Lifestyle */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <Pill size={20} className="mr-2  text-black" />
                  Physical & Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Height"
                    value={
                      profileData?.height ? `${profileData?.height} cm` : "N/A"
                    }
                  />
                  <DetailRow
                    label="Weight"
                    value={
                      profileData?.weight ? `${profileData?.weight} kg` : "N/A"
                    }
                  />
                  <DetailRow
                    label="Complexion"
                    value={profileData?.complexion || "N/A"}
                  />
                  <DetailRow
                    label="Body Type"
                    value={profileData?.bodyType || "N/A"}
                  />
                  <DetailRow
                    label="Disability Status"
                    value={profileData?.disabilityStatus || "N/A"}
                  />
                  <DetailRow label="Diet" value={profileData?.diet || "N/A"} />
                  <DetailRow
                    label="Smoking Habit"
                    value={profileData?.smokingHabit || "N/A"}
                  />
                  <DetailRow
                    label="Drinking Habit"
                    value={profileData?.drinkingHabit || "N/A"}
                  />
                </div>
              </div>

              {/* Family Details */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <Home size={20} className="mr-2  text-black" />
                  Family Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Family Type"
                    value={profileData?.familyType || "N/A"}
                  />
                  <DetailRow
                    label="Family Status"
                    value={profileData?.familyStatus || "N/A"}
                  />
                  <DetailRow
                    label="Family Values"
                    value={profileData?.familyValues || "N/A"}
                  />
                  <DetailRow
                    label="Father Occupation"
                    value={profileData?.fatherOccupation || "N/A"}
                  />
                  <DetailRow
                    label="Mother Occupation"
                    value={profileData?.motherOccupation || "N/A"}
                  />
                  <DetailRow
                    label="Brothers"
                    value={profileData?.brothers ?? "N/A"}
                  />
                  <DetailRow
                    label="Sisters"
                    value={profileData?.sisters ?? "N/A"}
                  />
                  <DetailRow
                    label="Brothers Married"
                    value={profileData?.brothersMarried ?? "N/A"}
                  />
                  <DetailRow
                    label="Sisters Married"
                    value={profileData?.sistersMarried ?? "N/A"}
                  />
                </div>
              </div>

              {/* Contact & Location */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <MapPin size={20} className="mr-2  text-black" />
                  Location & Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Phone Number"
                    value={profileData?.phoneNumber || "N/A"}
                  />
                  <DetailRow
                    label="Alternate Emails"
                    value={profileData?.alternateEmails?.join(", ") || "N/A"}
                  />
                  <DetailRow
                    label="Country"
                    value={profileData?.country || "N/A"}
                  />
                  <DetailRow
                    label="State"
                    value={profileData?.state || "N/A"}
                  />
                  <DetailRow label="City" value={profileData?.city || "N/A"} />
                  <DetailRow
                    label="Residency Status"
                    value={profileData?.residencyStatus || "N/A"}
                  />
                </div>
              </div>

              {/* Marital & Children Status */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <Heart size={20} className="mr-2  text-black" />
                  Marital Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Marital Status"
                    value={profileData?.maritalStatus || "N/A"}
                  />
                  <DetailRow
                    label="Children"
                    value={profileData?.children ?? "N/A"}
                  />
                </div>
              </div>

              {/* Education & Career */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <Briefcase size={20} className="mr-2  text-black" />
                  Education & Career
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Education Level"
                    value={profileData?.educationLevel || "N/A"}
                  />
                  <DetailRow
                    label="Education Field"
                    value={profileData?.educationField || "N/A"}
                  />
                  <DetailRow
                    label="Occupation"
                    value={profileData?.occupation || "N/A"}
                  />
                  <DetailRow
                    label="Annual Income"
                    value={profileData?.annualIncome ?? "N/A"}
                  />
                </div>
              </div>

              {/* Profile & Verification */}
              <div className="px-6 py-4">
                <h3 className="flex items-center font-semibold text-black text-md mb-6">
                  <ShieldCheck size={20} className="mr-2  text-black" />
                  Verification & Visibility
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Premium Member"
                    value={profileData?.isPremium ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Visibility"
                    value={profileData?.visibility || "N/A"}
                  />
                  <DetailRow
                    label="Phone Verified"
                    value={profileData?.verification?.phone ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Email Verified"
                    value={profileData?.verification?.email ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="ID Verified"
                    value={profileData?.verification?.id ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Profile Review"
                    value={profileData?.verification?.profileReview || "N/A"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[25%] px-2">
          <div className="mt-5">
            <div className="mb-3">
              <ProfileCompletionCard
                profileCompletionInfo={profileCompletionInfo}
              />
            </div>
            {/* <SidebarCard title="Similar Profiles" link="/" className="mb-3">
              <div className=" space-y-1">
                {users?.map((user) => {
                  return <UserCardSidebarItem key={user.name} {...user} />;
                })}
              </div>
            </SidebarCard> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
