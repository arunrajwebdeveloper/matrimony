import React from "react";
import {
  MapPin,
  ShieldAlert,
  HeartIcon,
  Mail,
  Ban,
  BriefcaseBusiness,
  Cake,
  BadgeCheck,
  Edit,
  Settings2,
} from "lucide-react";
import OnlineStatusDot from "@/components/profile/OnlineStatusDot";
import { User, UserProfile } from "@/types";
import { dateOfBirthFormat } from "@/lib/dateOfBirthFormat";
import avatarSource from "@/utils/avatarSource";
import MoreDropdown from "../dropdowns/MoreDropdown";

function ProfileUserCard({
  profileData,
  cover,
  currentUser,
}: {
  profileData: UserProfile | null;
  cover: string;
  currentUser: User | null;
}) {
  const imageUrl = avatarSource({
    avatar: profileData?.profilePicture,
    gender: profileData?.gender,
  });

  const isCurrentUser = currentUser?.profileId === profileData?.profileId;

  return (
    <div>
      <div className="w-full h-[240px] overflow-hidden">
        <img
          className="w-full h-[240px] object-cover rounded-2xl"
          src={cover}
          alt=""
        />
      </div>
      <div className="-mt-20">
        <div className="w-[160px] h-[160px] rounded-[50%] relative mx-auto">
          <img
            className="w-[160px] h-[160px] object-cover rounded-[50%] overflow-hidden border-2 border-white"
            src={imageUrl}
            alt=""
          />
          <div className="absolute bottom-4.5 right-4.5 z-10">
            <OnlineStatusDot isOnline={true} size="md" />
          </div>
        </div>
        <div className="space-y-1 mx-auto text-center mt-4">
          <p className="text-xs text-slate-500">{profileData?.profileId}</p>
          <p className="text-lg font-semibold text-slate-700 flex gap-1 items-center justify-center">
            {`${profileData?.firstName} ${profileData?.lastName || ""}`}
            <BadgeCheck size={20} color="#fff" fill="#2042f4" />
          </p>
          <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <Cake size={16} />
            <span>{dateOfBirthFormat(profileData?.dateOfBirth)}</span>
          </p>
          <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <BriefcaseBusiness size={16} />
            <span>{profileData?.occupation}</span>
          </p>
          <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <MapPin size={16} />
            <span>{`${profileData?.city}, ${profileData?.state}, ${profileData?.country}`}</span>
          </p>
        </div>
      </div>
      {!isCurrentUser && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="h-[36px] px-2 font-medium text-xs flex items-center gap-2 rounded bg-pink-100 text-pink-600 cursor-pointer transition-colors hover:bg-pink-200">
            <HeartIcon size={18} color="#e60076" />
            <span>Send Interest</span>
          </button>
          <button className="h-[36px] px-2 font-medium text-xs flex items-center gap-2 rounded bg-green-100 text-green-600 cursor-pointer transition-colors hover:bg-green-200">
            <Mail size={18} color="#00a63e" />
            <span>Send Message</span>
          </button>
          {/* <button className="h-[36px] px-2 font-medium text-xs flex items-center gap-2 rounded bg-amber-100 text-amber-600 cursor-pointer transition-colors hover:bg-amber-200">
            <Ban size={18} color="#e17100" />
            <span>Block</span>
          </button>
          <button className="h-[36px] px-2 font-medium text-xs flex items-center gap-2 rounded bg-red-100 text-red-600 cursor-pointer transition-colors hover:bg-red-200">
            <ShieldAlert size={18} color="#e7000b" />
            <span>Report</span>
          </button> */}

          <MoreDropdown />
        </div>
      )}
      {isCurrentUser && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="h-[36px] px-2 font-medium text-xs flex items-center gap-2 rounded bg-blue-100 text-blue-600 cursor-pointer transition-colors hover:bg-blue-200">
            <Edit size={18} color="#155dfc" />
            <span>Edit profile</span>
          </button>
          <button className="h-[36px] px-2 font-medium text-xs flex items-center gap-2 rounded bg-slate-100 text-slate-600 cursor-pointer transition-colors hover:bg-slate-200">
            <Settings2 size={18} color="#45556c" />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileUserCard;
