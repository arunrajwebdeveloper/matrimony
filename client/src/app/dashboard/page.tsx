"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import ProfileCard from "@/components/cards/ProfileCard";
import UserCard from "@/components/profile/UserCard";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ROUTES } from "@/utils/constants";

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

const pageBreadcrumbs = [{ label: "Dashboard", href: ROUTES.DASHBOARD }];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

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
              <h3 className="font-semibold text-black text-md mb-6">Main</h3>
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[50%] px-2">
          <div className="mt-5">
            <ProfileCard title="Preferred Matches" link="/" className="mb-5">
              <div className="flex flex-col gap-5">
                {users?.map((user) => {
                  return <UserCard key={user.name} {...user} />;
                })}
              </div>
            </ProfileCard>
            <ProfileCard title="New Matches" link="/" className="mb-5">
              <div className="flex flex-col gap-5">
                {users?.map((user) => {
                  return <UserCard key={user.name} {...user} />;
                })}
              </div>
            </ProfileCard>
            <ProfileCard title="Recent profile visitors" link="/">
              <div className="flex flex-col gap-5">
                {users?.map((user) => {
                  return <UserCard key={user.name} {...user} />;
                })}
              </div>
            </ProfileCard>
          </div>
        </div>
        <div className="w-[25%] px-2">
          <div className="mt-5">
            <ProfileCompletionCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
