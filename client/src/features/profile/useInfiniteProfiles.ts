// src/features/profile/useInfiniteProfiles.ts
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { profileApi } from "./api";
import { ProfileListResult } from "@/types";

type ProfileQueryKey = ["profiles", { endpoint: string; limit: number }];

export const useInfiniteProfiles = (endpoint: string, limit: number) => {
  return useInfiniteQuery<
    ProfileListResult, // TQueryFnData: Single page data type
    Error, // TError
    InfiniteData<ProfileListResult, number>, // TData: The CORRECT type for the 'data' property
    ProfileQueryKey, // TQueryKey
    number // TPageParam
  >({
    queryKey: ["profiles", { endpoint, limit }],
    initialPageParam: 1,

    queryFn: ({ pageParam = 1, queryKey }) => {
      const [, { endpoint: queryEndpoint, limit: queryLimit }] = queryKey;
      return profileApi.getProfiles({
        endpoint: queryEndpoint,
        page: pageParam,
        limit: queryLimit,
      });
    },

    getNextPageParam: (lastPage: ProfileListResult) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
};
