"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import ProfileCard from "@/components/cards/ProfileCard";
import UserCard from "@/components/profile/UserCard";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { API_ENDPOINTS, ROUTES } from "@/utils/constants";
import SidebarCard from "@/components/cards/SidebarCard";
import UserCardSidebarItem from "@/components/profile/UserCardSidebarItem";
import Link from "next/link";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import UpgradePremiumCard from "@/components/profile/UpgradePremiumCard";
import InfoSidebarCard from "@/components/profile/InfoSidebarCard";
import SafeTipsSidebarCard from "@/components/profile/SafeTipsSidebarCard";
import MatchList from "@/components/dashboard/MatchList";
import { UserCardType } from "@/types";
import api from "@/lib/api";

interface MatchState {
  data: UserCardType[];
  isLoading: boolean;
  error: string | null;
}

const NewMatchesPage: React.FC = () => {
  const { user } = useAuth();

  const [newMatches, setNewMatches] = useState<MatchState>({
    data: [],
    isLoading: true,
    error: null,
  });

  const fetchNewMatches = async (): Promise<void> => {
    try {
      const response = await api.get<UserCardType>(
        API_ENDPOINTS.NEW_MATCHES_LIST
      );
      setNewMatches({
        data: response?.data as any,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setNewMatches({
        data: [],
        isLoading: false,
        error: "Failed to load New matches data",
      });
      console.error("New matches fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNewMatches();
  }, []);

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
              <h3 className="font-semibold text-black text-md mb-6">Main</h3>
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[50%] px-2">
          <div className="mt-5">
            {/* LISTS */}

            {/* New Matches: Recently joined profiles that meet 
            your basic criteria like age, location, and education. */}

            <ProfileCard title="Shortlisted" className="mb-5">
              <MatchList
                users={newMatches?.data}
                isLoading={newMatches?.isLoading}
                error={newMatches?.error}
              />
            </ProfileCard>
          </div>
        </div>
        <div className="w-[25%] px-2">
          <div className="mt-5">
            {/* <div className="mb-3">
              <ProfileCompletionCard />
            </div> */}

            <div className="mb-3">
              <UpgradePremiumCard />
            </div>

            <div className="mb-3">
              <InfoSidebarCard />
            </div>

            <div className="mb-3">
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

export default NewMatchesPage;
