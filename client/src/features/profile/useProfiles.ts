import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export const useProfiles = (endpoint: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["profiles", { endpoint, page, limit }],
    queryFn: () => profileApi.getProfiles({ endpoint, page, limit }),
  });
};
