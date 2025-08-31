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
import Greeting from "@/components/dashboard/Greeting";
import ActivityItem from "@/components/profile/ActivityFeedItem";
import ActivityList from "@/components/dashboard/ActivityList";

const statUsers = [
  "https://images.unsplash.com/photo-1754430543609-aae159c530ef?q=80&w=1000",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1000",
  "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?q=80&w=1000",
  "https://images.unsplash.com/photo-1629818385919-e6bfcd7f72cf?q=80&w=1000",
  "https://images.unsplash.com/photo-1604546689004-4ca31460dba1?q=80&w=1000",
  "https://images.unsplash.com/flagged/photo-1595523667797-051afce20d86?q=80&w=1000",
];

interface MatchState {
  data: UserCardType[];
  isLoading: boolean;
  error: string | null;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [newMatches, setNewMatches] = useState<MatchState>({
    data: [],
    isLoading: true,
    error: null,
  });

  const [preferredMatches, setPreferredMatches] = useState<MatchState>({
    data: [],
    isLoading: true,
    error: null,
  });

  const fetchPreferredMatches = async (): Promise<void> => {
    try {
      const response = await api.get<UserCardType>(
        API_ENDPOINTS.PREFERRED_MATCHES_LIST
      );
      setPreferredMatches({
        data: response?.data as any,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setPreferredMatches({
        data: [],
        isLoading: false,
        error: "Failed to load Preferred matches data",
      });
      console.error("Preferred matches fetch error:", err);
    }
  };

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
    fetchPreferredMatches();
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
            <div className="py-1 px-6">
              <Greeting username={user?.firstName || ""} />
            </div>

            {/* BASIC STAT INFOS */}
            <div className="py-4 px-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-black text-md">
                  Basic Statistics
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatisticsCard
                  value={30}
                  title="Profile Views"
                  label="This Week"
                  users={statUsers}
                />
                <StatisticsCard
                  value={7}
                  title="New Messages"
                  label="Unread"
                  users={statUsers}
                />
                <StatisticsCard
                  value={13}
                  title="Shortlisted"
                  label="By You"
                  users={statUsers}
                />
                <StatisticsCard
                  value={36}
                  title="Matches"
                  label="Available"
                  users={statUsers}
                />
              </div>
            </div>

            {/* LISTS */}

            {/* Preferred Matches: Highly compatible profiles (85%+ match) based on 
            advanced algorithms considering lifestyle, values, interests, and detailed preferences. */}
            <ProfileCard title="Preferred Matches" link="/" className="mb-5">
              <MatchList
                users={preferredMatches?.data}
                isLoading={preferredMatches?.isLoading}
                error={preferredMatches?.error}
              />
            </ProfileCard>

            {/* New Matches: Recently joined profiles that meet 
            your basic criteria like age, location, and education. */}

            <ProfileCard title="New Matches" link="/" className="mb-5">
              <MatchList
                users={newMatches?.data}
                isLoading={newMatches?.isLoading}
                error={newMatches?.error}
              />
            </ProfileCard>

            <ProfileCard title=" Recent Activity" link="/" className="mb-5">
              <ActivityList />
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

export default DashboardPage;
