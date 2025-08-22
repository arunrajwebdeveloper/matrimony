import React, { useEffect, useState } from "react";
import ActivityFeedItem from "../profile/ActivityFeedItem";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/utils/constants";
import { Activity } from "@/types/activity";

function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches activities from the backend using an API call.
   */
  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // We'll use a placeholder URL for the API endpoint.
      // You must replace this with your actual backend URL.
      const response = await api.get(API_ENDPOINTS.ACTIVITY_RECENT_GET);

      // Assuming your API returns an array of activities directly.

      setActivities(response.data);
    } catch (e) {
      console.error("Failed to fetch activities:", e);
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div>
      {loading && (
        <div className="text-sm text-slate-500 m-0">Loading activities...</div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && activities.length === 0 && (
        <div className="text-sm text-slate-500 m-0">
          No recent activities found.
        </div>
      )}

      {!loading &&
        !error &&
        activities?.map((activity) => (
          <ActivityFeedItem key={activity._id} activity={activity} />
        ))}
    </div>
  );
}

export default ActivityList;
