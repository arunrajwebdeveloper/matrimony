import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export const useProfile = (profileId: string) => {
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => profileApi.getProfileById(profileId),
  });
};
