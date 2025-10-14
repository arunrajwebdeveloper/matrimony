import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useNavigationSummary() {
  return useQuery({
    queryKey: ["navigationSummary"],
    queryFn: async () => {
      const res = await api.get("/api/user-interactions/interaction-summary");
      return res.data;
    },
  });
}
