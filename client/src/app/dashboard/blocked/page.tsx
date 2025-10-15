"use client";

import React from "react";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { API_ENDPOINTS } from "@/utils/constants";
import UpgradePremiumCard from "@/components/profile/UpgradePremiumCard";
import InfoSidebarCard from "@/components/profile/InfoSidebarCard";
import SafeTipsSidebarCard from "@/components/profile/SafeTipsSidebarCard";
import EventsCalendar from "@/components/profile/EventsCalendar";
import ProfileList from "@/components/profileList/ProfileList";
import { useAppSelector } from "@/hooks/hooks";

const NewMatchesPage: React.FC = () => {
  const { isLoading, error, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  return (
    <div className="main-container">
      {/* Breadcrumb */}
      <div className="py-2  sticky top-[70px]">
        <Breadcrumb />
      </div>

      <div className="flex">
        <div className="w-[25%] px-2">
          <div className="mt-5 sticky top-[122px] sidebar-scroller">
            <div className="py-4">
              <h3 className="font-semibold text-black text-md mb-6">Main</h3>
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[50%] px-2">
          <div className="mt-5">
            <ProfileList
              title="Blocked Users"
              endpoint={API_ENDPOINTS.GET_BLOCKED_LIST}
              paginationPath="/dashboard/blocked"
              showRemoveFromBlocked={true}
            />
          </div>
        </div>
        <div className="w-[25%] px-2">
          <div className="mt-5  sticky top-[122px] sidebar-scroller">
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
