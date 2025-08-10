import React from "react";
import VerifiedIcon from "../ui/VerifiedIcon";
import PremiumIcon from "../ui/PremiumIcon";

interface UserSummaryProps {
  avatar?: string;
  username: string;
  email: string;
}

function UserSummaryDisplay({ avatar, username, email }: UserSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-md w-[50px] h-[50px] flex-none relative">
        <img
          src={avatar}
          alt=""
          className="object-cover w-[50px] h-[50px] rounded-md overflow-hidden"
          loading="lazy"
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm">{username}</p>
          <VerifiedIcon size={18} color="#2042f4" />
        </div>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
    </div>
  );
}

export default UserSummaryDisplay;
