"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="w-[50%] px-2">
        <div className="mt-5">fhfghf</div>
      </div>
      <div className="w-[25%] px-2">
        <div className="mt-5">
          <ProfileCompletionCard />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
