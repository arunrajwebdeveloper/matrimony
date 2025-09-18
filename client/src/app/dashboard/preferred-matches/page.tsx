"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileCard from "@/components/cards/ProfileCard";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { API_ENDPOINTS, ROUTES } from "@/utils/constants";
import SidebarCard from "@/components/cards/SidebarCard";
import UserCardSidebarItem from "@/components/profile/UserCardSidebarItem";
import UpgradePremiumCard from "@/components/profile/UpgradePremiumCard";
import InfoSidebarCard from "@/components/profile/InfoSidebarCard";
import SafeTipsSidebarCard from "@/components/profile/SafeTipsSidebarCard";
import MatchList from "@/components/dashboard/MatchList";
import { ApiResponse, MatchResult, MatchState } from "@/types";
import api from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import { searchParamsToObject } from "@/utils/searchParamsToObject";
import { useSearchParams } from "next/navigation";
import EventsCalendar from "@/components/profile/EventsCalendar";

const PreferredMatchesPage: React.FC = () => {
  const { user } = useAuth();

  const searchParams = useSearchParams();

  const [state, setState] = useState<MatchState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchPreferredMatches = async (): Promise<void> => {
    try {
      const response = await api.get<ApiResponse<MatchResult>>(
        API_ENDPOINTS.PREFERRED_MATCHES_LIST,
        { params: searchParamsToObject(searchParams) }
      );
      setState({
        data: response?.data?.result as MatchResult,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setState({
        data: null,
        isLoading: false,
        error: "Failed to load Preferred matches data",
      });
      console.error("Preferred matches fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPreferredMatches();
  }, []);

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
              <h3 className="font-semibold text-black text-md mb-6">Main</h3>
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[50%] px-2">
          <div className="mt-5">
            {/* LISTS */}

            {/* Preferred Matches: Highly compatible profiles (85%+ match) based on 
            advanced algorithms considering lifestyle, values, interests, and detailed preferences. */}
            <ProfileCard title="Preferred Matches" className="mb-5">
              <MatchList
                users={state?.data?.result!}
                isLoading={state?.isLoading}
                error={state?.error}
                onAddToShortlist={(e) => {
                  console.log(e);
                }}
                onRemove={(e) => {
                  console.log(e);
                }}
              />
            </ProfileCard>
            {!state?.isLoading && (
              <Pagination
                page={state?.data?.page as number}
                lastPage={state?.data?.totalPages as number}
                path="/dashboard/preferred-matches"
              />
            )}
          </div>
        </div>
        <div className="w-[25%] px-2">
          <div className="mt-5">
            {/* <div className="mb-3">
              <ProfileCompletionCard />
            </div> */}

            <div className="mb-6">
              <EventsCalendar />
            </div>

            {!user?.profile?.isPremium && (
              <div className="mb-6">
                <UpgradePremiumCard />
              </div>
            )}

            <div className="mb-6">
              <InfoSidebarCard />
            </div>

            <div className="mb-6">
              <SafeTipsSidebarCard />
            </div>

            {/* Sidebar items */}

            {/* <SidebarCard title="Interests Sent" link="/" className="mb-3">
              <div className="flex flex-col gap-3">
                {users?.map((user) => {
                  return <UserCardSidebarItem key={user.name} {...user} />;
                })}
              </div>
            </SidebarCard>

            <SidebarCard title="Interests Received" link="/" className="mb-3">
              <div className="flex flex-col gap-3">
                {users?.map((user) => {
                  return <UserCardSidebarItem key={user.name} {...user} />;
                })}
              </div>
            </SidebarCard>

            <SidebarCard title="Shortlisted" link="/" className="mb-3">
              <div className="flex flex-col gap-3">
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

export default PreferredMatchesPage;
