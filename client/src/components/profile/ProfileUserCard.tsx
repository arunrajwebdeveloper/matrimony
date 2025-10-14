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
  Link,
  Bug,
  CircleAlert,
} from "lucide-react";
import OnlineStatusDot from "@/components/profile/OnlineStatusDot";
import { User, UserProfile } from "@/types";
import { dateOfBirthFormat } from "@/utils/dateOfBirthFormat";
import MoreDropdown from "../dropdowns/MoreDropdown";
import Avatar from "./Avatar";
import { usePathname } from "next/navigation";
import { useToast } from "@/contexts/ToastScope";

function ProfileUserCard({
  profileData,
  cover,
  currentUser,
}: {
  profileData: UserProfile | null;
  cover: string;
  currentUser: User | null;
}) {
  const pathname = usePathname();
  const { showSuccess } = useToast();

  const isCurrentUser = currentUser?.profileId === profileData?.profileId;

  const handleCopy = async () => {
    const fullUrl = `${window.location.origin}${pathname}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      showSuccess("Profile link copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const moreOptions = [
    {
      label: "Copy profile link",
      icon: Link,
      action: handleCopy,
      isShow: true,
    },
    {
      label: "Block",
      icon: Ban,
      action: () => {
        showSuccess("Block option will add soon!");
      },
      isShow: !isCurrentUser,
    },
    {
      label: "Report",
      icon: CircleAlert,
      action: () => {
        showSuccess("Report option will add soon!");
      },
      isShow: !isCurrentUser,
    },
    {
      label: "Report a bug",
      icon: Bug,
      action: () => {
        showSuccess("Report a bug option will add soon!");
      },
      isShow: true,
      className: "text-red-400 hover:bg-red-50 hover:text-red-500",
    },
  ];

  return (
    <div>
      <div className="w-full h-[240px] overflow-hidden relative group bg-slate-500 rounded-2xl">
        <img
          className="w-full h-[240px] object-cover rounded-2xl"
          src={profileData?.coverImage ?? cover ?? ""}
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
        <div className="w-[160px] h-[160px] rounded-full relative mx-auto bg-slate-500  ">
          <Avatar
            src={profileData?.profilePicture!}
            firstname={`${profileData?.firstName || ""}`}
            lastname={`${profileData?.lastName || ""}`}
            size={160}
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
          {(profileData?.city ||
            profileData?.state ||
            profileData?.country) && (
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <MapPin size={16} />
              <p className="text-sm text-slate-600">
                {profileData?.city && <span>{`${profileData?.city}`}</span>}
                {profileData?.state && <span>{`, ${profileData?.state}`}</span>}
                {profileData?.country && (
                  <span>{`, ${profileData?.country}`}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        {!isCurrentUser && (
          <>
            <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-rose-600 text-white cursor-pointer transition-colors hover:bg-rose-500">
              <HeartIcon size={18} />
              <span>Send Interest</span>
            </button>
            <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-emerald-600 text-white cursor-pointer transition-colors hover:bg-emerald-500">
              <Mail size={18} />
              <span>Send Message</span>
            </button>
          </>
        )}
        {isCurrentUser && (
          <>
            <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-blue-600 text-white cursor-pointer transition-colors hover:bg-blue-500">
              <Edit size={18} />
              <span>Edit profile</span>
            </button>
            <button className="h-[36px] px-4 font-medium text-xs flex items-center gap-2 rounded bg-slate-100 text-slate-600 cursor-pointer transition-colors hover:bg-slate-200">
              <Settings2 size={18} />
              <span>Settings</span>
            </button>
          </>
        )}
        <MoreDropdown options={moreOptions} />
      </div>
    </div>
  );
}

export default ProfileUserCard;
