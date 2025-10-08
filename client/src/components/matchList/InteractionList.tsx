import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import MatchList from "@/components/dashboard/MatchList";
import Pagination from "@/components/ui/Pagination";
import WithInteractionApi from "./WithInteractionApi";

function InteractionList({
  state,
  title,
  paginationPath,
  hasPagination = true,
  link,
  ...rest
}: {
  state: any;
  title: string;
  link?: string;
  paginationPath: string;
  hasPagination?: boolean;
}) {
  return (
    <>
      <ProfileCard title={title} link={link} className="mb-5">
        <MatchList
          users={state?.result?.data!}
          isLoading={state?.isLoading}
          error={state?.error}
          {...rest}
        />
      </ProfileCard>

      {!state?.isLoading &&
        hasPagination &&
        (state?.result?.hasNextPage || state?.result?.hasPrevPage) && (
          <Pagination
            page={state?.result?.page as number}
            lastPage={state?.result?.totalPages as number}
            path={paginationPath}
          />
        )}
    </>
  );
}

export default WithInteractionApi(InteractionList);
