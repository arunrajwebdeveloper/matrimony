import React from "react";
import UserCard from "../profile/UserCard";
import { UserCardType } from "@/types";
import UserListSkeleton from "../skeleton/UserListSkeleton";

interface MatchListProps {
  users: UserCardType[];
  isLoading: boolean;
  error: string | null;
}

function MatchList({
  users = [],
  isLoading = false,
  error = null,
}: MatchListProps) {
  if (isLoading) {
    return <UserListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {!isLoading && users?.length !== 0 ? (
        users?.map((user) => {
          return <UserCard key={user.profileId} {...user} />;
        })
      ) : (
        <p className="text-sm text-slate-500 m-0">No items found</p>
      )}
    </div>
  );
}

export default MatchList;
