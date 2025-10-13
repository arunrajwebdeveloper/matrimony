import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: () => profileApi.getMyProfile(),
  });
};
