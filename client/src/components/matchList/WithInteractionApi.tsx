"use client";

import React, { useEffect, useState } from "react";
import { ApiResponse, MatchResult, MatchState } from "@/types";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { searchParamsToObject } from "@/utils/searchParamsToObject";
import { useProfiles } from "@/features/profile/useProfiles";
import UserListSkeleton from "../skeleton/UserListSkeleton";

function WithInteractionApi(WrappedComponent: any) {
  return (props: any) => {
    const { endpoint, itemPerPage, ...rest } = props;
    const searchParams = useSearchParams();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(itemPerPage || 20);

    // const response = await api.get<ApiResponse<MatchResult>>(endpoint, {
    //   params: searchParamsToObject(searchParams),
    // });

    const { data, isLoading, error } = useProfiles(
      endpoint,
      page,
      limit,
      searchParams
    );

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
      <WrappedComponent
        {...rest}
        data={data}
        isLoading={isLoading}
        error={error}
      />
    );
  };
}

export default WithInteractionApi;
