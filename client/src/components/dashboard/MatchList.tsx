import React from "react";
import UserCard from "../profile/UserCard";
import { MatchListProps } from "@/types";

function MatchList({
  users = [],
  isLoading = false,
  error = null,
  ...rest
}: MatchListProps) {
  if (error) {
    return (
      <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isLoading && users?.length !== 0 ? (
        users?.map((user) => {
          return <UserCard key={user._id} {...user} {...rest} />;
        })
      ) : (
        <p className="text-sm text-slate-500 m-0">No items found</p>
      )}
    </div>
  );
}

export default MatchList;
