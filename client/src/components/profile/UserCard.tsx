import React from "react";
import Link from "next/link";
import { UserCardType } from "@/types";

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
      <div className="w-[100px] relative">
        <img
          className="w-[100px] h-[100px] object-cover"
          src={profileImage}
          alt={name}
        />
        {/* <span
          className={`w-[10px] h-[10px] rounded-[50px] absolute top-1 right-1 z-30 border border-white ${
            isOnline ? "bg-green-500" : "bg-yellow-500"
          }`}
        ></span> */}
      </div>
      <div className="py-4 px-5">
        <div className="flex gap-2 items-center mb-1">
          <h3 className="text-md font-medium text-black">{name}</h3>
          <span className="text-sm text-gray-700">{profileId}</span>
        </div>
        <p className="text-xs text-gray-600">{`${height}, ${age} Yrs, ${motherTongue}`}</p>
        <p className="text-xs text-gray-600">{`${profession}, ${location}`}</p>
      </div>
    </Link>
  );
}

export default UserCard;
