"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import ProfileCard from "@/components/cards/ProfileCard";
import UserCard from "@/components/profile/UserCard";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ROUTES } from "@/utils/constants";
import SidebarCard from "@/components/cards/SidebarCard";
import UserCardSidebarItem from "@/components/profile/UserCardSidebarItem";
import Link from "next/link";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import UpgradePremiumCard from "@/components/profile/UpgradePremiumCard";
import InfoSidebarCard from "@/components/profile/InfoSidebarCard";
import SafeTipsSidebarCard from "@/components/profile/SafeTipsSidebarCard";

interface User {
  name: string;
  profileId: string;
  height: string;
  age: number;
  profession: string;
  location: string;
  motherTongue: string;
  isOnline: boolean;
  profileImage: string;
}

export const users: User[] = [
  {
    name: "John Doe",
    profileId: "MW-23456789",
    height: "5'9\"",
    age: 35,
    profession: "Software Engineer",
    location: "New York, USA",
    motherTongue: "English",
    isOnline: true,
    profileImage:
      "https://images.unsplash.com/photo-1543123820-ac4a5f77da38?q=80&w=500",
  },
  {
    name: "Emma Watson",
    profileId: "MW-23456790",
    height: "5'6\"",
    age: 32,
    profession: "Graphic Designer",
    location: "London, UK",
    motherTongue: "English",
    isOnline: false,
    profileImage:
      "https://images.unsplash.com/photo-1603072007571-7295a309e45f?q=80&w=500",
  },
  {
    name: "Michael Smith",
    profileId: "MW-23456791",
    height: "6'0\"",
    age: 38,
    profession: "Photographer",
    location: "Miami, USA",
    motherTongue: "English",
    isOnline: true,
    profileImage:
      "https://images.unsplash.com/photo-1689464090276-50bed9a6798f?q=80&w=500",
  },
  {
    name: "Sophia Brown",
    profileId: "MW-23456792",
    height: "5'5\"",
    age: 29,
    profession: "Marketing Manager",
    location: "Los Angeles, USA",
    motherTongue: "English",
    isOnline: false,
    profileImage:
      "https://images.unsplash.com/photo-1538472123780-aaf4aca79a16?q=80&w=500",
  },
  {
    name: "Liam Johnson",
    profileId: "MW-23456793",
    height: "5'10\"",
    age: 33,
    profession: "Data Analyst",
    location: "Toronto, Canada",
    motherTongue: "English",
    isOnline: true,
    profileImage:
      "https://images.unsplash.com/photo-1683921902999-d52fa6d6ec54?q=80&w=500",
  },
];

const statUsers = [
  "https://images.unsplash.com/photo-1754430543609-aae159c530ef?q=80&w=1000",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1000",
  "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?q=80&w=1000",
  "https://images.unsplash.com/photo-1629818385919-e6bfcd7f72cf?q=80&w=1000",
  "https://images.unsplash.com/photo-1604546689004-4ca31460dba1?q=80&w=1000",
  "https://images.unsplash.com/flagged/photo-1595523667797-051afce20d86?q=80&w=1000",
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

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
                  color="blue"
                />
                <StatisticsCard
                  value={7}
                  title="New Messages"
                  label="Unread"
                  users={statUsers}
                  color="orange"
                />
                <StatisticsCard
                  value={13}
                  title="Shortlisted"
                  label="By You"
                  users={statUsers}
                  color="green"
                />
                <StatisticsCard
                  value={36}
                  title="Matches"
                  label="Available"
                  users={statUsers}
                  color="violet"
                />
              </div>
            </div>

            {/* LISTS */}

            {/* New Matches: Recently joined profiles that meet 
            your basic criteria like age, location, and education. */}

            <ProfileCard title="New Matches" link="/" className="mb-5">
              <div className="flex flex-col gap-3">
                {users?.map((user) => {
                  return <UserCard key={user.name} {...user} />;
                })}
              </div>
            </ProfileCard>

            {/* Preferred Matches: Highly compatible profiles (85%+ match) based on 
            advanced algorithms considering lifestyle, values, interests, and detailed preferences. */}

            <ProfileCard title="Preferred Matches" link="/" className="mb-5">
              <div className="flex flex-col gap-3">
                {users?.map((user) => {
                  return <UserCard key={user.name} {...user} />;
                })}
              </div>
            </ProfileCard>

            <div className="py-4 px-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-black text-md">
                  Recent Activity
                </h2>
                <Link className="font-normal text-blue-500 text-xs" href={""}>
                  View all
                </Link>
              </div>
              <div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-slate-600 font-normal text-sm m-0">
                    Sneha K. viewed your profile
                  </p>
                  <p className="text-slate-500 font-normal text-xs m-0">
                    2 hours ago
                  </p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-slate-600 font-normal text-sm m-0">
                    New message from Amit
                  </p>
                  <p className="text-slate-500 font-normal text-xs m-0">
                    5 hours ago
                  </p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-slate-600 font-normal text-sm m-0">
                    Kavya R. shortlisted your profile
                  </p>
                  <p className="text-slate-500 font-normal text-xs m-0">
                    1 day ago
                  </p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-slate-600 font-normal text-sm m-0">
                    Meera sent interest
                  </p>
                  <p className="text-slate-500 font-normal text-xs m-0">
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
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
