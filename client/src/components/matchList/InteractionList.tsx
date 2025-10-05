import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import MatchList from "@/components/dashboard/MatchList";
import Pagination from "@/components/ui/Pagination";
import WithInteractionApi from "./WithInteractionApi";

function InteractionList({
  state,
  title,
  paginationPath,
  ...rest
}: {
  state: any;
  title: string;
  paginationPath: string;
}) {
  return (
    <div>
      {/* LISTS */}

      <ProfileCard title={title} className="mb-5">
        <MatchList
          users={state?.result?.data!}
          isLoading={state?.isLoading}
          error={state?.error}
          {...rest}
        />
      </ProfileCard>
      {!state?.isLoading && (
        <Pagination
          page={state?.result?.page as number}
          lastPage={state?.result?.totalPages as number}
          path={paginationPath}
        />
      )}
    </div>
  );
}

export default WithInteractionApi(InteractionList);
