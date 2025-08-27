import React from "react";
import Link from "next/link";
import { UserCardType } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import { ROUTES } from "@/utils/constants";
import { Ban, Bookmark, Eye } from "lucide-react";

function UserCard({
  firstName,
  lastName,
  profileId,
  height,
  dateOfBirth,
  occupation,
  city,
  state,
  motherTongue,
  isOnline,
  profilePicture,
  gender,
}: UserCardType) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

  return (
    <div className="flex rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
      <div className="w-[130px] relative flex-none group">
        <img
          className="w-[130px] h-[130px] object-cover"
          src={profilePicture}
          alt={profileId}
        />
        <Link
          href={`${ROUTES.PROFILE}/${profileId}`}
          className="absolute inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye size={16} />
          <span>View</span>
        </Link>
      </div>
      <div className="py-3 px-5 flex-auto flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-2 items-center">
            <h3 className="text-md font-medium text-black">{fullName}</h3>
            <span className="text-xs text-gray-700">{profileId}</span>
          </div>
          <div className="flex gap-0.5 items-center">
            <OnlineStatusDot isOnline={isOnline!} />
            <span className="font-normal text-xs text-gray-700">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600">{`${height} cm, ${dateOfBirthFormat(
          dateOfBirth,
          "DD MMM YYYY"
        )}, ${motherTongue}`}</p>
        <p className="text-xs text-gray-600">{`${
          occupation ?? ""
        }, ${city}, ${state}`}</p>
        <div className="flex items-center gap-2 mt-3">
          <Link
            href={`${ROUTES.PROFILE}/${profileId}`}
            className="flex items-center text-xs cursor-pointer py-1 px-2 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300 rounded-sm gap-1"
          >
            <Eye size={14} />
            <span>View</span>
          </Link>
          <button className="flex items-center text-xs cursor-pointer py-1 px-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors duration-300 rounded-sm gap-1">
            <Bookmark size={14} />
            <span>Add to Shortlist</span>
          </button>
          <button className="flex items-center text-xs cursor-pointer py-1 px-2 bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-300 rounded-sm gap-1">
            <Ban size={14} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
