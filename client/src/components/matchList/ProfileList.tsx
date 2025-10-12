import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import MatchList from "@/components/dashboard/MatchList";
import Pagination from "@/components/ui/Pagination";
import WithInteractionApi from "./WithInteractionApi";

function ProfileList({
  data,
  isLoading,
  title,
  paginationPath,
  hasPagination = true,
  link,
  error,
  ...rest
}: {
  data: any;
  isLoading: boolean;
  title: string;
  link?: string;
  error?: any;
  paginationPath: string;
  hasPagination?: boolean;
}) {
  return (
    <>
      <ProfileCard title={title} link={link} className="mb-5">
        <MatchList
          users={data?.data!}
          isLoading={isLoading}
          error={error}
          {...rest}
        />
      </ProfileCard>

      {!isLoading &&
        hasPagination &&
        (data?.hasNextPage || data?.hasPrevPage) && (
          <Pagination
            page={data?.page as number}
            lastPage={data?.totalPages as number}
            path={paginationPath}
          />
        )}
    </>
  );
}

export default WithInteractionApi(ProfileList);
