import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export const useProfiles = (
  endpoint: string,
  page: number,
  limit: number,
  filters: Record<string, any>
) => {
  return useQuery({
    queryKey: ["profiles", { endpoint, page, limit, filters }],
    queryFn: () => profileApi.getProfiles({ endpoint, page, limit, filters }),
  });
};
