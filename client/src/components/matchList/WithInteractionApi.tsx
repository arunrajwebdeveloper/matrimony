"use client";

import React, { useEffect, useState } from "react";
import { ApiResponse, MatchResult, MatchState } from "@/types";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { searchParamsToObject } from "@/utils/searchParamsToObject";

function WithInteractionApi(WrappedComponent: any) {
  return (props: any) => {
    const { endpoint, ...rest } = props;
    const searchParams = useSearchParams();

    const [state, setState] = useState<MatchState>({
      result: null,
      isLoading: true,
      error: null,
    });

    const fetchNewMatches = async (): Promise<void> => {
      try {
        const response = await api.get<ApiResponse<MatchResult>>(endpoint, {
          params: searchParamsToObject(searchParams),
        });
        setState({
          result: response?.data?.result as MatchResult,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        setState({
          result: null,
          isLoading: false,
          error: "Failed to load New matches data",
        });
        console.error("New matches fetch error:", err);
      }
    };

    useEffect(() => {
      fetchNewMatches();
    }, []);

    return <WrappedComponent {...rest} state={state} />;
  };
}

export default WithInteractionApi;
