import React from "react";
import Link from "next/link";
import { UserCardSidebarItemType } from "@/types";

function UserCardSidebarItem({
  name,
  profileId,
  profileImage,
}: UserCardSidebarItemType) {
  return (
    <Link
      href="/profile"
      className="flex rounded-md shadow-xs overflow-hidden border border-gray-100 items-center px-2"
    >
      <div className="w-[50px] h-[50px] relative flex-none">
        <img
          className="w-[50px] h-[50px] object-cover rounded-md"
          src={profileImage}
          alt={name}
        />
      </div>
      <div className="py-2 px-4 flex-auto">
        <h3 className="text-sm font-medium text-black m-0">{name}</h3>
        <span className="text-xs text-gray-700 ">{profileId}</span>
      </div>
    </Link>
  );
}

export default UserCardSidebarItem;
