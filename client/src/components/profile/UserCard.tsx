import React from "react";
import Link from "next/link";
import { MatchCardProps } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import { ROUTES } from "@/utils/constants";
import { Ban, Bookmark, CircleCheck, Eye, Heart, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import { useAppSelector } from "@/hooks/hooks";
import { useInteraction } from "@/features/interactions/useInteraction";
import CircleSpinner from "../ui/CircleSpinner";

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
    showRemove,
    showCancelRequest,
    showAcceptRequest,
    showDeclineRequest,
    showSendInterest,
    showIgnore,
  } = props;

  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

  const send = useInteraction("sendInterest");
  const cancelRequest = useInteraction("cancelSentInterest");
  const accept = useInteraction("acceptInterest");
  const block = useInteraction("blockUser");
  const decline = useInteraction("declineInterest");
  const shortlist = useInteraction("shortlistUser");
  const removeBlock = useInteraction("removeBlockedUser");
  const removeShortlist = useInteraction("removeShortlistUser");

  const isSending = send.isPending && send.variables === userId;
  const isCancellingRequest =
    cancelRequest.isPending && cancelRequest.variables === userId;
  const isAccepting = accept.isPending && accept.variables === userId;
  const isBlockLoading = block.isPending && block.variables === userId;
  const isDeclineLoading = decline.isPending && decline.variables === userId;
  const isShortlistLoading =
    shortlist.isPending && shortlist.variables === userId;
  const isRemoveBlockLoading =
    removeBlock.isPending && removeBlock.variables === userId;
  const isRemoveShortlistLoading =
    removeShortlist.isPending && removeShortlist.variables === userId;

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
              onClick={() => send.mutate(userId!?.toString())}
              disabled={isSending}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-green-200 text-green-800 hover:bg-green-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isSending ? (
                <CircleSpinner size={14} />
              ) : (
                <Heart size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">
                {isSending ? "Sending..." : "Send Interest"}
              </span>
            </button>
          )}
          {showAcceptRequest && (
            <button
              // onClick={() => onAcceptRequest?.(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-green-200 text-green-800 hover:bg-green-300 transition-colors duration-300 rounded-sm gap-1"
            >
              <CircleCheck size={14} className="flex-1" />
              <span className="whitespace-nowrap">Accept Request</span>
            </button>
          )}
          {showDeclineRequest && (
            <button
              // onClick={() => onDeclineRequest?.(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors duration-300 rounded-sm gap-1"
            >
              <Ban size={14} className="flex-1" />
              <span className="whitespace-nowrap">Decline Request</span>
            </button>
          )}
          {showRemove && (
            <button
              // onClick={() => onRemove?.(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-red-200 text-red-800 hover:bg-red-300 transition-colors duration-300 rounded-sm gap-1"
            >
              <Trash2 size={14} className="flex-1" />
              <span className="whitespace-nowrap">Remove</span>
            </button>
          )}
          {showCancelRequest && (
            <button
              // onClick={() => cancelRequest.mutate(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors duration-300 rounded-sm gap-1"
            >
              {isCancellingRequest ? (
                <CircleSpinner size={14} />
              ) : (
                <Ban size={14} className="flex-1" />
              )}
              <span className="whitespace-nowrap">
                {isCancellingRequest ? "Cancelling..." : "Cancel Request"}
              </span>
            </button>
          )}
          {showIgnore && (
            <button
              // onClick={() => onCancelRequest?.(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors duration-300 rounded-sm gap-1"
            >
              <Ban size={14} className="flex-1" />
              <span className="whitespace-nowrap">Ignore</span>
            </button>
          )}
          {showAddToShortlist && (
            <button
              onClick={() => shortlist.mutate(userId!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300 rounded-sm gap-1"
            >
              {isShortlistLoading ? (
                <CircleSpinner size={14} />
              ) : (
                <Bookmark size={14} className="flex-1" />
              )}
              {/* <span className="whitespace-nowrap">Add to Shortlist</span> */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
