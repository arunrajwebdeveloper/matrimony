import React, { useEffect } from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import { useInfiniteProfiles } from "@/features/profile/useInfiniteProfiles";
import UserCard from "../profile/UserCard";
import {
  InfiniteMatchListProps,
  ProfileListProps,
  UserMatchType,
} from "@/types";
import UserListSkeleton from "../skeleton/UserListSkeleton";
import { useInView } from "react-intersection-observer"; // Used for scroll detection

function MatchList({
  data,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  ...rest
}: InfiniteMatchListProps) {
  // 1. Intersection Observer Hook
  const { ref, inView } = useInView();

  // 2. Auto-fetch logic
  useEffect(() => {
    // If the sentinel element is visible, there's a next page, and we're not currently fetching
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the array of pages into a single array of users
  const allUsers: UserMatchType[] =
    data?.pages.flatMap((page) => page.data) || [];

  if (error) {
    return (
      <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
        {error.message}
      </div>
    );
  }

  // Initial loading state (only show skeletons if no data has been fetched yet)
  if (isLoading && allUsers.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, index) => (
          <UserListSkeleton key={`initial-profiles-skel-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Render all fetched items */}
      {allUsers.length !== 0 ? (
        allUsers.map((user) => {
          return <UserCard key={user._id} {...user} {...rest} />;
        })
      ) : (
        <p className="text-sm text-slate-500 m-0">No items found</p>
      )}

      {/* 3. Sentinel Element and Loading Indicator */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage ? (
          // Skeleton loaders for the next page fetch
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <UserListSkeleton key={`fetching-skel-${index}`} />
            ))}
          </div>
        ) : hasNextPage ? (
          // Fallback manual 'Load More' button
          <button
            onClick={() => fetchNextPage()}
            className="text-slate-500 font-medium text-xs py-2 px-6 rounded-4xl inline-block bg-slate-100 hover:bg-slate-200 transition duration-300"
          >
            Load More Profiles
          </button>
        ) : (
          // End of list
          allUsers.length > 0 && (
            <p className="text-sm text-slate-500 m-0">All profiles loaded.</p>
          )
        )}
      </div>
    </div>
  );
}

function ProfileList({
  title,
  itemPerPage = 10,
  endpoint,
  ...rest
}: ProfileListProps) {
  // Destructure all necessary infinite query properties
  const {
    data,
    isPending, // status for initial loading
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProfiles(endpoint, itemPerPage);

  // We are removing the old pagination logic and component here

  return (
    <ProfileCard title={title} className="mb-5">
      <MatchList
        data={data}
        isLoading={isPending} // Use isPending for initial loading
        error={error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        {...rest}
      />
    </ProfileCard>
  );
}

export default ProfileList;
