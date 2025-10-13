import React, { useState } from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import { useSearchParams } from "next/navigation";
import Pagination from "../ui/Pagination";
import { useProfiles } from "@/features/profile/useProfiles";
import UserCard from "../profile/UserCard";
import { MatchListProps } from "@/types";
import UserListSkeleton from "../skeleton/UserListSkeleton";

function MatchList({
  users = [],
  isLoading = false,
  error = null,
  ...rest
}: MatchListProps) {
  if (error) {
    return (
      <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
        {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <UserListSkeleton />
        <UserListSkeleton />
        <UserListSkeleton />
        <UserListSkeleton />
        <UserListSkeleton />
        <UserListSkeleton />
        <UserListSkeleton />
        <UserListSkeleton />
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

function ProfileList({
  title,
  paginationPath,
  hasPagination = true,
  link,
  itemPerPage,
  endpoint,
  ...rest
}: {
  title: string;
  link?: string;
  itemPerPage?: number;
  paginationPath: string;
  hasPagination?: boolean;
  endpoint: string;
  showAcceptRequest?: boolean;
  showDeclineRequest?: boolean;
  showAddToShortlist?: boolean;
  showRemove?: boolean;
  showCancelRequest?: boolean;
  showSendInterest?: boolean;
}) {
  const searchParams = useSearchParams();

  // const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(itemPerPage || 10);

  const { data, isLoading, error } = useProfiles(
    endpoint,
    1,
    limit,
    searchParams
  );
  const showPagination =
    !isLoading &&
    data?.data?.length !== 0 &&
    hasPagination &&
    (data?.hasNextPage || data?.hasPrevPage);

  return (
    <ProfileCard title={title} link={link} className="mb-5">
      <MatchList
        users={data?.data!}
        isLoading={isLoading}
        error={error}
        {...rest}
      />

      {showPagination && (
        <Pagination
          page={data?.page as number}
          lastPage={data?.totalPages as number}
          path={paginationPath}
        />
      )}
    </ProfileCard>
  );
}

export default ProfileList;
