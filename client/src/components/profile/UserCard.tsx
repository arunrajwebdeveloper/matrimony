import React from "react";
import Link from "next/link";
import { UserCardType } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import { ROUTES } from "@/utils/constants";
import { Ban, Bookmark, Eye } from "lucide-react";
import Avatar from "./Avatar";

function UserCard({
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
}: UserCardType) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

  return (
    <div className="flex overflow-hidden">
      <div className="w-[130px] relative flex-none group rounded-full">
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
          className="absolute rounded-full inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
