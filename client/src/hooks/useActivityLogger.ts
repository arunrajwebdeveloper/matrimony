import api from "@/lib/api";
import { ActivityVerb } from "@/utils/activity.enum";
import { API_ENDPOINTS } from "@/utils/constants";
import { useCallback } from "react";

const useActivityLogger = () => {
  const logActivity = useCallback(
    async (verb: ActivityVerb, targetId: string) => {
      try {
        await api.post(API_ENDPOINTS.ACTIVITY_LOG, {
          verb,
          targetId,
        });
        console.log(`Activity logged: ${verb} on ${targetId}`);
      } catch (error) {
        console.error(`Failed to log activity (${verb}):`, error);
      }
    },
    []
  );

  return logActivity;
};

export default useActivityLogger;
