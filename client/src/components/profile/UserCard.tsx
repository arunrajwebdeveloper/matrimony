import React from "react";
import Link from "next/link";
import { UserCardType } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";
import { dateOfBirthFormat } from "@/lib/dateOfBirthFormat";

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
}: UserCardType) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

  return (
    <Link
      href="/profile"
      className="flex rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="w-[100px] relative flex-none">
        <img
          className="w-[100px] h-[100px] object-cover"
          src={profilePicture}
          alt={profileId}
        />
      </div>
      <div className="py-4 px-5 flex-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-2 items-center">
            <h3 className="text-md font-medium text-black">{fullName}</h3>
            <span className="text-sm text-gray-700">{profileId}</span>
          </div>
          <div className="flex gap-0.5 items-center">
            <OnlineStatusDot isOnline={isOnline!} />
            <span className="font-normal text-xs text-gray-700">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600">{`${height} cm, ${dateOfBirthFormat(
          dateOfBirth
        )}, ${motherTongue}`}</p>
        <p className="text-xs text-gray-600">{`${
          occupation ?? ""
        }, ${city}, ${state}`}</p>
      </div>
    </Link>
  );
}

export default UserCard;
