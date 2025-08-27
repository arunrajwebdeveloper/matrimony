import { Activity } from "@/types/activity";
import { ROUTES } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import Link from "next/link";
import React from "react";

// Define the activity verbs directly in the component as a constant object.
// This resolves the import error by keeping the enum definition self-contained.
const ActivityVerb = {
  VIEWED_PROFILE: "viewed_profile",
  SENT_INTEREST: "sent_interest",
  SENT_MESSAGE: "sent_message",
  SHORTLISTED_PROFILE: "shortlisted_profile",
  SENT_PHOTO_REQUEST: "sent_photo_request",
};

/**
 * A component to display a single activity feed item.
 * It translates the activity verb into a human-readable sentence.
 * @param activity The activity data object from the backend.
 */
const ActivityFeedItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const { actorId, verb, timestamp } = activity;
  const actorName = `${actorId.firstName} ${actorId.lastName ?? ""}`;

  // Use a map to store the sentence templates for each activity verb.
  // This is a clean way to handle multiple sentence types.
  const activityTemplates = {
    [ActivityVerb.VIEWED_PROFILE]: (
      <p className="text-slate-600 font-normal text-sm m-0">
        <Link
          href={`${ROUTES.PROFILE}/${actorId?.profileId}`}
          className="text-slate-800 font-medium me-1"
        >
          <span>{actorName}</span>
        </Link>
        viewed your profile.
      </p>
    ),

    [ActivityVerb.SENT_INTEREST]: (
      <p className="text-slate-600 font-normal text-sm m-0">
        <Link
          href={`${ROUTES.PROFILE}/${actorId?.profileId}`}
          className="text-slate-800 font-medium me-1"
        >
          <span>{actorName}</span>
        </Link>
        sent you an interest.
      </p>
    ),

    [ActivityVerb.SENT_MESSAGE]: (
      <p className="text-slate-600 font-normal text-sm m-0">
        <Link
          href={`${ROUTES.PROFILE}/${actorId?.profileId}`}
          className="text-slate-800 font-medium me-1"
        >
          <span>{actorName}</span>
        </Link>
        sent you a message.
      </p>
    ),

    [ActivityVerb.SHORTLISTED_PROFILE]: (
      <p className="text-slate-600 font-normal text-sm m-0">
        <Link
          href={`${ROUTES.PROFILE}/${actorId?.profileId}`}
          className="text-slate-800 font-medium me-1"
        >
          <span>{actorName}</span>
        </Link>
        shortlisted your profile.
      </p>
    ),

    [ActivityVerb.SENT_PHOTO_REQUEST]: (
      <p className="text-slate-600 font-normal text-sm m-0">
        <Link
          href={`${ROUTES.PROFILE}/${actorId?.profileId}`}
          className="text-slate-800 font-medium me-1"
        >
          <span>{actorName}</span>
        </Link>
        requested to view your photos.
      </p>
    ),
  };

  const sentence = activityTemplates[verb] || (
    <p className="text-slate-600 font-normal text-sm m-0">
      An unknown activity occurred.
    </p>
  );

  // const timeAgo = new Date(timestamp).toLocaleDateString("en-US", {
  //   month: "short",
  //   day: "numeric",
  // });

  const timeAgo = formatRelativeTime(timestamp);

  const profilePicture = actorId?.profile?.profilePicture;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Link
          href={`${ROUTES.PROFILE}/${actorId?.profileId}`}
          className="w-6.5 h-6.5 block"
        >
          <img
            className="w-6.5 h-6.5 rounded-full bg-slate-400"
            src={profilePicture ?? ""}
            alt="user avatar"
          />
        </Link>
        {sentence}
      </div>
      <p className="text-slate-500 font-normal text-xs m-0">{timeAgo}</p>
    </div>
  );
};

export default ActivityFeedItem;
