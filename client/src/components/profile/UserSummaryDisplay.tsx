import React from "react";
import OnlineStatusDot from "./OnlineStatusDot";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import Avatar from "./Avatar";
import { trimText } from "@/utils/trimeText";

interface UserSummaryProps {
  avatar?: string | undefined;
  username: string;
  email: string;
}

function UserSummaryDisplay({ avatar, username, email }: UserSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-md w-[50px] h-[50px] flex-none relative">
        <Avatar src={avatar} />
        <div className="absolute bottom-0.5 right-0.5 z-10 w-[10px] h-[10px]">
          <OnlineStatusDot isOnline={true} />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <p className="text-sm">{username}</p>
          <BadgeCheck size={20} color="#fff" fill="#2042f4" />
        </div>
        <p className="text-xs text-gray-500">{trimText(email)}</p>
        <Link
          className="text-xs text-blue-600"
          href="/dashboard/profile/settings"
        >
          Edit profile
        </Link>
      </div>
    </div>
  );
}

export default UserSummaryDisplay;
