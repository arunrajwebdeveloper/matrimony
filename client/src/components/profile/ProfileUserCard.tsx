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
  Image,
  ImagePlus,
} from "lucide-react";
import OnlineStatusDot from "@/components/profile/OnlineStatusDot";
import { User, UserProfile } from "@/types";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
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
      <div className="w-full h-[240px] overflow-hidden relative group bg-slate-500 rounded-2xl">
        <img
          className="w-full h-[240px] object-cover rounded-2xl"
          src={cover}
          alt=""
        />
        {isCurrentUser && (
          <button className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-1 z-20 top-2 right-2 bg-slate-50 text-slate-600 font-medium text-xs px-2 py-1 cursor-pointer rounded-sm">
            <ImagePlus size={16} />
            <span>Update Cover</span>
          </button>
        )}
      </div>
      <div className="-mt-20">
        <div className="w-[160px] h-[160px] rounded-[50%] relative mx-auto bg-slate-500">
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
          {profileData?.occupation && (
            <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <BriefcaseBusiness size={16} />
              <span>{profileData?.occupation}</span>
            </p>
          )}
          {profileData?.city && profileData?.state && profileData?.country && (
            <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <MapPin size={16} />
              {profileData?.city && <span>{`${profileData?.city}`}</span>}
              {profileData?.state && <span>{`, ${profileData?.state}`}</span>}
              {profileData?.country && (
                <span>{`, ${profileData?.country}`}</span>
              )}
            </p>
          )}
        </div>
      </div>
      {!isCurrentUser && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-pink-100 text-pink-600 cursor-pointer transition-colors hover:bg-pink-200">
            <HeartIcon size={18} color="#e60076" />
            <span>Send Interest</span>
          </button>
          <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-green-100 text-green-600 cursor-pointer transition-colors hover:bg-green-200">
            <Mail size={18} color="#00a63e" />
            <span>Send Message</span>
          </button>
          <MoreDropdown />
        </div>
      )}
      {isCurrentUser && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-blue-100 text-blue-600 cursor-pointer transition-colors hover:bg-blue-200">
            <Edit size={18} color="#155dfc" />
            <span>Edit profile</span>
          </button>
          <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-slate-100 text-slate-600 cursor-pointer transition-colors hover:bg-slate-200">
            <Settings2 size={18} color="#45556c" />
            <span>Settings</span>
          </button>
          <MoreDropdown />
        </div>
      )}
    </div>
  );
}

export default ProfileUserCard;
