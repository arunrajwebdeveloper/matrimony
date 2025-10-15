import React from "react";
import Link from "next/link";
import { MatchCardProps } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import { ROUTES } from "@/utils/constants";
import { Ban, Bookmark, CircleCheck, Eye, Heart, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import { useInteraction } from "@/features/interactions/useInteraction";
import CircleSpinner from "../ui/CircleSpinner";
import { InteractionType } from "@/features/interactions/types";

type InteractionReturn = ReturnType<typeof useInteraction>;

type UseUserInteractionsReturn = {
  [K in InteractionType]: InteractionReturn;
} & {
  isSendLoading: boolean;
  isCancelRequestLoading: boolean;
  isAcceptLoading: boolean;
  isBlockLoading: boolean;
  isDeclineLoading: boolean;
  isShortlistLoading: boolean;
  isRemoveBlockLoading: boolean;
  isRemoveShortlistLoading: boolean;
  isRemoveDeclinedlistLoading: boolean;
  isRemoveAcceptedlistLoading: boolean;
  isIgnoreLoading: boolean;
};

function UserCard(props: MatchCardProps) {
  const {
    user: userId,
    firstName,
    lastName,
    profileId,
    dateOfBirth,
    occupation,
    city,
    state,
    motherTongue,
    isOnline = false,
    profilePicture,
    showAddToShortlist,
    showCancelRequest,
    showAcceptRequest,
    showDeclineRequest,
    showSendInterest,
    showIgnore,
    showRemoveFromDeclined,
    showRemoveFromAccepted,
    showRemoveFromShortlisted,
    showRemoveFromBlocked,
  } = props;

  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

  function useUserInteractions(userId: string): UseUserInteractionsReturn {
    const sendInterest = useInteraction("sendInterest");
    const cancelSentInterest = useInteraction("cancelSentInterest");
    const acceptInterest = useInteraction("acceptInterest");
    const blockUser = useInteraction("blockUser");
    const declineInterest = useInteraction("declineInterest");
    const shortlistUser = useInteraction("shortlistUser");
    const removeBlockedUser = useInteraction("removeBlockedUser");
    const removeShortlistUser = useInteraction("removeShortlistUser");
    const removeDeclinedlistUser = useInteraction("removeDeclinedlistUser");
    const removeAcceptedlistUser = useInteraction("removeAcceptedlistUser");
    const ignoreUser = useInteraction("ignoreUser");

    return {
      sendInterest,
      cancelSentInterest,
      acceptInterest,
      blockUser,
      declineInterest,
      shortlistUser,
      removeBlockedUser,
      removeShortlistUser,
      removeDeclinedlistUser,
      removeAcceptedlistUser,
      ignoreUser,

      isSendLoading:
        sendInterest.isPending && sendInterest.variables === userId,
      isCancelRequestLoading:
        cancelSentInterest.isPending && cancelSentInterest.variables === userId,
      isAcceptLoading:
        acceptInterest.isPending && acceptInterest.variables === userId,
      isBlockLoading: blockUser.isPending && blockUser.variables === userId,
      isDeclineLoading:
        declineInterest.isPending && declineInterest.variables === userId,
      isShortlistLoading:
        shortlistUser.isPending && shortlistUser.variables === userId,
      isRemoveBlockLoading:
        removeBlockedUser.isPending && removeBlockedUser.variables === userId,
      isRemoveShortlistLoading:
        removeShortlistUser.isPending &&
        removeShortlistUser.variables === userId,
      isRemoveDeclinedlistLoading:
        removeDeclinedlistUser.isPending &&
        removeDeclinedlistUser.variables === userId,
      isRemoveAcceptedlistLoading:
        removeAcceptedlistUser.isPending &&
        removeAcceptedlistUser.variables === userId,
      isIgnoreLoading: ignoreUser.isPending && ignoreUser.variables === userId,
    };
  }

  const {
    sendInterest,
    cancelSentInterest,
    acceptInterest,
    blockUser,
    declineInterest,
    shortlistUser,
    removeBlockedUser,
    removeShortlistUser,
    removeDeclinedlistUser,
    removeAcceptedlistUser,
    ignoreUser,

    isSendLoading,
    isCancelRequestLoading,
    isAcceptLoading,
    isBlockLoading,
    isDeclineLoading,
    isShortlistLoading,
    isRemoveBlockLoading,
    isRemoveShortlistLoading,
    isRemoveDeclinedlistLoading,
    isRemoveAcceptedlistLoading,
    isIgnoreLoading,
  } = useUserInteractions(userId);

  return (
    <div className="flex overflow-hidden group">
      <div className="w-[130px] relative flex-none rounded-full">
        <Avatar
          src={profilePicture!}
          firstname={`${firstName || ""}`}
          lastname={`${lastName || ""}`}
          size={130}
          // isCircle={false}
          // hasBorder={false}
        />
        <Link
          href={`${ROUTES.PROFILE}/${profileId}`}
          className="absolute rounded-full inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Eye size={16} />
          <span>View</span>
        </Link>
        <div className="absolute bottom-3.5 right-3.5 z-20">
          <OnlineStatusDot isOnline={isOnline} size="md" />
        </div>
      </div>
      <div className="py-3 px-5 flex-auto flex flex-col justify-center">
        <div className="flex gap-2 items-center mb-1">
          <h3 className="text-md font-medium text-black">{fullName}</h3>
          <span className="text-xs text-gray-700">{profileId}</span>
        </div>
        <p className="text-xs text-gray-600">{`${dateOfBirthFormat(
          dateOfBirth,
          "DD MMM YYYY"
        )}, ${motherTongue}`}</p>
        <p className="text-xs text-gray-600">{`${
          occupation ?? ""
        }, ${city}, ${state}`}</p>
        <div className="flex items-center gap-2 mt-3">
          {showSendInterest && (
            <button
              onClick={() => sendInterest.mutate(userId!?.toString())}
              disabled={isSendLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-green-200 text-green-800 hover:bg-green-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isSendLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Heart size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Send Interest</span>
            </button>
          )}
          {showAcceptRequest && (
            <button
              onClick={() => acceptInterest.mutate(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-green-200 text-green-800 hover:bg-green-300 transition-colors duration-300 rounded-sm gap-1"
              disabled={isAcceptLoading}
            >
              {isAcceptLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <CircleCheck size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Accept Request</span>
            </button>
          )}
          {showDeclineRequest && (
            <button
              onClick={() => declineInterest.mutate(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors duration-300 rounded-sm gap-1"
              disabled={isDeclineLoading}
            >
              {isDeclineLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Ban size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Decline Request</span>
            </button>
          )}
          {showCancelRequest && (
            <button
              onClick={() => cancelSentInterest.mutate(userId!?.toString())}
              disabled={isCancelRequestLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isCancelRequestLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Ban size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Cancel Request</span>
            </button>
          )}
          {showIgnore && (
            <button
              onClick={() => ignoreUser.mutate(userId!?.toString())}
              disabled={isIgnoreLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isIgnoreLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Ban size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Ignore</span>
            </button>
          )}
          {showRemoveFromDeclined && (
            <button
              onClick={() => removeDeclinedlistUser.mutate(userId!?.toString())}
              disabled={isRemoveDeclinedlistLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-red-200 text-red-800 hover:bg-red-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isRemoveDeclinedlistLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Trash2 size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Remove</span>
            </button>
          )}
          {showRemoveFromAccepted && (
            <button
              onClick={() => removeAcceptedlistUser.mutate(userId!?.toString())}
              disabled={isRemoveAcceptedlistLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-red-200 text-red-800 hover:bg-red-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isRemoveAcceptedlistLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Trash2 size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Remove</span>
            </button>
          )}
          {showRemoveFromShortlisted && (
            <button
              onClick={() => removeShortlistUser.mutate(userId!?.toString())}
              disabled={isRemoveShortlistLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-red-200 text-red-800 hover:bg-red-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isRemoveShortlistLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Trash2 size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Remove</span>
            </button>
          )}
          {showRemoveFromBlocked && (
            <button
              onClick={() => removeBlockedUser.mutate(userId!?.toString())}
              disabled={isRemoveBlockLoading}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-red-200 text-red-800 hover:bg-red-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isRemoveBlockLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Trash2 size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">Remove</span>
            </button>
          )}
          {showAddToShortlist && (
            <button
              onClick={() => shortlistUser.mutate(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300 rounded-sm gap-1"
              disabled={isShortlistLoading}
            >
              {isShortlistLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Bookmark size={14} className="flex-1" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
