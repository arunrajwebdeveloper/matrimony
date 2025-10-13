import React, { useEffect, useState } from "react";
import ActivityFeedItem from "../profile/ActivityFeedItem";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/utils/constants";
import { Activity } from "@/types/activity";
import ActivityListSkeleton from "../skeleton/ActivityListSkeleton";
import { ApiResponse } from "@/types";

function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<Activity[]>>(
        API_ENDPOINTS.ACTIVITY_RECENT_GET
      );
      setActivities(response?.data?.result);
    } catch (e) {
      console.error("Failed to fetch activities:", e);
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div>
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <ActivityListSkeleton key={`initial-activities-skel-${index}`} />
          ))}
        </div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && activities.length === 0 && (
        <div className="text-sm text-slate-500 m-0">
          No recent activities found.
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {activities?.map((activity) => (
            <ActivityFeedItem key={activity._id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityList;
