// src/components/ProfileListTeaser.tsx

import React from "react";
import Link from "next/link"; // Assuming you are using Next.js Link
import { useInfiniteProfiles } from "@/features/profile/useInfiniteProfiles";
import UserListSkeleton from "../skeleton/UserListSkeleton";
import { ProfileListTeaserProps, UserMatchType } from "@/types";
import ProfileCard from "../cards/ProfileCard";
import UserCard from "../profile/UserCard";

// Define fixed number of items for the teaser
const TEASER_LIMIT = 5;

function ProfileListTeaser({
  title,
  viewMoreLink,
  endpoint,
  itemPerPage,
  ...rest
}: ProfileListTeaserProps) {
  // Use the exact same infinite query hook
  const {
    data,
    isPending, // v5 status for initial loading
    error,
  } = useInfiniteProfiles(endpoint, itemPerPage); // This fetches only the first page (page 1)

  if (error) {
    return (
      <div className="p-3 text-sm text-red-700">Failed to load profiles.</div>
    );
  }

  // 1. Flatten the first page's data
  // We only access the first page of the 'pages' array (index 0)
  const allUsers: UserMatchType[] = data?.pages[0]?.data || [];

  // 2. Control the items to display
  const teaserUsers = allUsers.slice(0, TEASER_LIMIT);

  // 3. Initial Loading Skeleton
  if (isPending) {
    return (
      <ProfileCard title={title} className="mb-5">
        <div className="space-y-3">
          {[...Array(TEASER_LIMIT)].map((_, index) => (
            <UserListSkeleton key={`teaser-skel-${index}`} />
          ))}
        </div>
      </ProfileCard>
    );
  }

  // 4. No items found
  if (teaserUsers.length === 0) {
    return (
      <ProfileCard title={title}>
        <p className="text-sm text-slate-500 m-0">No new matches found.</p>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard title={title}>
      <div className="space-y-6">
        {/* Render only the fixed number of items */}
        {teaserUsers.map((user) => (
          <UserCard key={user._id} {...user} {...rest} />
        ))}
      </div>

      {/* 5. The View More Link */}
      <div className="mt-4 pt-4 text-center">
        <Link
          href={viewMoreLink}
          className="text-slate-500 font-medium text-xs py-2 px-6 rounded-4xl inline-block bg-slate-100 hover:bg-slate-200 transition duration-300"
        >
          View All Matches ({data?.pages[0]?.total || "..."})
        </Link>
      </div>
    </ProfileCard>
  );
}

export default ProfileListTeaser;
