import React from "react";
import Link from "next/link";
import { MatchCardProps } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import { ROUTES } from "@/utils/constants";
import { Ban, Bookmark, CircleCheck, Eye } from "lucide-react";
import Avatar from "./Avatar";

function UserCard(props: MatchCardProps) {
  const {
    _id,
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
    onAddToShortlist,
    onRemove,
    onCancelRequest,
    onAcceptRequest,
    onDeclineRequest,
  } = props;

  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

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
          {/* <Link
            href={`${ROUTES.PROFILE}/${profileId}`}
            className="flex items-center text-xs cursor-pointer py-1 px-2 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300 rounded-sm gap-1"
          >
            <Eye size={14} className="flex-1" />
            <span className="whitespace-nowrap">View</span>
          </Link> */}
          {onAddToShortlist && (
            <button
              onClick={() => onAddToShortlist?.(_id!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors duration-300 rounded-sm gap-1"
            >
              <Bookmark size={14} className="flex-1" />
              <span className="whitespace-nowrap">Add to Shortlist</span>
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove?.(_id!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-300 rounded-sm gap-1"
            >
              <Ban size={14} className="flex-1" />
              <span className="whitespace-nowrap">Remove</span>
            </button>
          )}
          {onCancelRequest && (
            <button
              onClick={() => onCancelRequest?.(_id!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-300 rounded-sm gap-1"
            >
              <Ban size={14} className="flex-1" />
              <span className="whitespace-nowrap">Cancel Request</span>
            </button>
          )}
          {onAcceptRequest && (
            <button
              onClick={() => onAcceptRequest?.(_id!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-300 rounded-sm gap-1"
            >
              <CircleCheck size={14} className="flex-1" />
              <span className="whitespace-nowrap">Accept Request</span>
            </button>
          )}
          {onDeclineRequest && (
            <button
              onClick={() => onDeclineRequest?.(_id!?.toString())}
              className="flex items-center text-xs cursor-pointer py-1 px-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-300 rounded-sm gap-1"
            >
              <Ban size={14} className="flex-1" />
              <span className="whitespace-nowrap">Decline Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
