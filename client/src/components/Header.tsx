"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Crown,
  CrownIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  MailOpen,
  Settings2,
  UserRound,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import UserDropdown from "./dropdowns/UserDropdown";
import { UserDropdownMenuType } from "@/types/menu";
import { useChat } from "@/hooks/useChat";
import LiveClock from "./liveClock";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logoutThunk } from "@/features/auth/authThunks";
import { useToast } from "@/contexts/ToastScope";

function Header() {
  const dispatch = useAppDispatch();
  const { showError } = useToast();
  const { isLoading, error, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { setIsOpenChat } = useChat();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    const result = await dispatch(logoutThunk());

    if (logoutThunk.fulfilled.match(result)) {
      router.push(ROUTES.LOGIN);
    } else if (logoutThunk.rejected.match(result)) {
      const errorMsg = result?.payload || "Failed to logout.";
      showError(errorMsg);
    }
  };

  const navItems: UserDropdownMenuType[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: ROUTES.DASHBOARD,
    },
    {
      label: "Profile",
      icon: UserRound,
      action: ROUTES.PROFILE,
    },
    {
      label: "Settings",
      icon: Settings2,
      action: ROUTES.SETTINGS.DEFAULT,
    },
    {
      label: "Logout",
      icon: LogOut,
      action: handleLogout,
    },
  ];

  return (
    <header className="fixed bg-white/0 top-0 left-0 z-[200] w-full border-b-[1px] border-gray-200/50 backdrop-blur-sm">
      <div className="px-4 flex justify-between items-center h-[60px]">
        <div className="matrimony-logo">
          <Link
            href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="font-bold text-base text-blue-600"
          >
            Matrimony
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Clock */}
            <LiveClock />

            {user?.profile?.isPremium ? (
              <div className="flex items-center gap-2 border-1 border-amber-500 px-2.5 py-1.5 rounded-full font-medium select-none">
                <CrownIcon size={16} color="#fe9a00" fill="#fe9a00" />
                <p className="text-xs text-amber-500">Premium</p>
              </div>
            ) : (
              <Link
                href="/"
                className="flex items-center justify-center border-2 border-blue-600 px-2.5 py-1.5 rounded-full text-blue-600 font-medium text-xs"
              >
                <span>Upgrade</span>
              </Link>
            )}
            <Link
              href={ROUTES.NEW_REQUESTS}
              className="w-[30px] h-[30px] flex items-center justify-center relative"
            >
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute top-0.5 right-0.5 z-20 pointer-events-none"></span>
              <Users size={18} />
            </Link>

            <button
              onClick={() => setIsOpenChat(true)}
              className="w-[30px] h-[30px] flex items-center justify-center relative  cursor-pointer"
            >
              {/* <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute top-0.5 right-0.5 z-20 pointer-events-none"></span> */}
              <MailOpen size={18} />
            </button>

            <button className="w-[30px] h-[30px] flex items-center justify-center relative cursor-pointer">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute top-0.5 right-0.5 z-20 pointer-events-none"></span>
              <Bell size={18} />
            </button>

            <div className="ms-4">
              <UserDropdown
                menu={navItems}
                avatar={user?.profile?.profilePicture!}
                firstname={`${user?.firstName || ""}`}
                lastname={`${user?.lastName || ""}`}
                email={user?.email || ""}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.LOGIN}
              className="flex items-center justify-center border-2 border-blue-600 px-2.5 py-1.5 rounded-full text-blue-600 font-medium text-xs"
            >
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
