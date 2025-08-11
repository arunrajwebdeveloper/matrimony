import React from "react";
import Link from "next/link";
import { UserCardType } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";

function UserCard({
  name,
  profileId,
  height,
  age,
  profession,
  location,
  motherTongue,
  profileImage,
  isOnline,
}: UserCardType) {
  return (
    <Link
      href="/profile"
      className="flex rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="w-[100px] relative flex-none">
        <img
          className="w-[100px] h-[100px] object-cover"
          src={profileImage}
          alt={name}
        />
      </div>
      <div className="py-4 px-5 flex-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-2 items-center">
            <h3 className="text-md font-medium text-black">{name}</h3>
            <span className="text-sm text-gray-700">{profileId}</span>
          </div>
          <div className="flex gap-0.5 items-center">
            <OnlineStatusDot isOnline={isOnline} />
            <span className="font-normal text-xs text-gray-700">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600">{`${height}, ${age} Yrs, ${motherTongue}`}</p>
        <p className="text-xs text-gray-600">{`${profession}, ${location}`}</p>
      </div>
    </Link>
  );
}

export default UserCard;
