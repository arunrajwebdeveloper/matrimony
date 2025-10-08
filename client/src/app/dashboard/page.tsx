"use client";

import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { API_ENDPOINTS, ROUTES } from "@/utils/constants";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import UpgradePremiumCard from "@/components/profile/UpgradePremiumCard";
import InfoSidebarCard from "@/components/profile/InfoSidebarCard";
import SafeTipsSidebarCard from "@/components/profile/SafeTipsSidebarCard";
import Greeting from "@/components/dashboard/Greeting";
import ActivityList from "@/components/dashboard/ActivityList";
import EventsCalendar from "@/components/profile/EventsCalendar";
import InteractionList from "@/components/matchList/InteractionList";
import { useAppSelector } from "@/hooks";

const statUsers = [
  "https://images.unsplash.com/photo-1754430543609-aae159c530ef?q=80&w=1000",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1000",
  "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?q=80&w=1000",
  "https://images.unsplash.com/photo-1629818385919-e6bfcd7f72cf?q=80&w=1000",
  "https://images.unsplash.com/photo-1604546689004-4ca31460dba1?q=80&w=1000",
  "https://images.unsplash.com/flagged/photo-1595523667797-051afce20d86?q=80&w=1000",
];

const DashboardPage: React.FC = () => {
  const { isLoading, error, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

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

            <InteractionList
              title="Preferred Matches"
              endpoint={`${API_ENDPOINTS.PREFERRED_MATCHES_LIST}?limit=5`}
              paginationPath="/dashboard/preferred-matches"
              link="/dashboard/preferred-matches"
              hasPagination={false}
              onSendInterest={(e: any) => {
                console.log(e);
              }}
              onAddToShortlist={(e: any) => {
                console.log(e);
              }}
              onRemove={(e: any) => {
                console.log(e);
              }}
            />

            {/* New Matches: Recently joined profiles that meet 
            your basic criteria like age, location, and education. */}

            <InteractionList
              title="New Matches"
              endpoint={`${API_ENDPOINTS.NEW_MATCHES_LIST}?limit=5`}
              paginationPath="/dashboard/new-matches"
              link="/dashboard/new-matches"
              hasPagination={false}
              onSendInterest={(e: any) => {
                console.log(e);
              }}
              onAddToShortlist={(e: any) => {
                console.log(e);
              }}
              onRemove={(e: any) => {
                console.log(e);
              }}
            />

            <ProfileCard title=" Recent Activities" link="/" className="mb-5">
              <ActivityList />
            </ProfileCard>
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

export default DashboardPage;
