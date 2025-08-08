"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { UserProfile } from "@/types";
import { API_ENDPOINTS } from "@/utils/constants";

const ProfilePage: React.FC = () => {
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
      <ProtectedRoute>
        <div className="flex justify-center items-center fixed top-0 left-0 z-[1000] w-full h-full">
          <LoadingSpinner size="md" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.firstName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.lastName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.gender || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.dateOfBirth || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Religion
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.religion || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mother Tongue
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.motherTongue || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Height
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.height || 0} cm
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.weight || 0} kg
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Complexion
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.complexion || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Body Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.bodyType || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disability Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.disabilityStatus || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  About Me
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.aboutMe || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Emails
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.alternateEmails?.join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.country || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.state || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.city || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Residency Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.residencyStatus || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Family Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.familyType || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Family Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.familyStatus || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Father Occupation
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.fatherOccupation || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mother Occupation
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.motherOccupation || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brothers
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.brothers ?? 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sisters
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.sisters ?? 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brothers Married
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.brothersMarried ?? 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sisters Married
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.sistersMarried ?? 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Family Values
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.familyValues || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education Level
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.educationLevel || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education Field
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.educationField || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupation
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.occupation || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Annual Income
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.annualIncome || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Diet
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.diet || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Smoking Habit
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.smokingHabit || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Drinking Habit
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.drinkingHabit || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hobbies
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.hobbies?.join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interests
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.interests?.join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.maritalStatus || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Children
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.children ?? 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.profilePicture || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photos
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.profilePhotos?.length
                    ? profileData.profilePhotos.join(", ")
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visibility
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.visibility || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Premium
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.isPremium ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Verified
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.verification?.phone ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Verified
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.verification?.email ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Verified
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.verification?.id ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Review Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.verification?.profileReview || "pending"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.createdAt || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {profileData?.updatedAt || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
