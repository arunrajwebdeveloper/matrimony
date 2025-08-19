import React from "react";
import Link from "next/link";
import { UserCardSidebarItemType } from "@/types";
import OnlineStatusDot from "./OnlineStatusDot";

function UserCardSidebarItem({
  name,
  profileId,
  profileImage,
}: UserCardSidebarItemType) {
  return (
    <Link
      href="/profile"
      className="flex rounded-lg overflow-hidden items-center p-2 hover:bg-slate-50 transition duration-300"
    >
      <div className="w-[50px] h-[50px] relative flex-none rounded-full">
        <img
          className="w-[50px] h-[50px] object-cover rounded-full"
          src={profileImage}
          alt={name}
        />
        <div className="absolute bottom-0.5 right-0.5 z-10 w-[10px] h-[10px]">
          <OnlineStatusDot isOnline={true} />
        </div>
      </div>
      <div className="px-4 flex-auto">
        <h3 className="text-sm font-medium text-black m-0">{name}</h3>
        <span className="text-xs text-gray-700 ">{profileId}</span>
      </div>
    </Link>
  );
}

export default UserCardSidebarItem;
