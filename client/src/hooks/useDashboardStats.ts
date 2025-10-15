import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const res = await api.get("/api/user-interactions/dashboard-summary");
      return res.data;
    },
  });
}
