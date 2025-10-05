"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { API_ENDPOINTS } from "@/utils/constants";
import UpgradePremiumCard from "@/components/profile/UpgradePremiumCard";
import InfoSidebarCard from "@/components/profile/InfoSidebarCard";
import SafeTipsSidebarCard from "@/components/profile/SafeTipsSidebarCard";
import EventsCalendar from "@/components/profile/EventsCalendar";
import InteractionList from "@/components/matchList/InteractionList";

const NewMatchesPage: React.FC = () => {
  const { user } = useAuth();

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
            <InteractionList
              title="Shortlisted"
              endpoint={API_ENDPOINTS.SHORTLIST.GET_LIST}
              paginationPath="/dashboard/shortlisted"
              onRemove={(e: any) => {
                console.log(e);
              }}
            />
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

export default NewMatchesPage;
