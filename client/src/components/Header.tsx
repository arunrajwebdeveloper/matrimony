"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Mail,
  UserRound,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import UserDropdown from "./dropdowns/UserDropdown";
import { UserDropdownMenuType } from "@/types/menu";
import PremiumIcon from "./ui/PremiumIcon";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push(ROUTES.LOGIN);
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
      label: "Logout",
      icon: LogOut,
      action: handleLogout,
    },
  ];

  return (
    <header className="fixed bg-white top-0 left-0 z-[200] w-full border-b-[1px] border-gray-200">
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
            {user?.profile?.isPremium ? (
              <div className="flex items-center gap-2 border-1 border-amber-500 px-2.5 py-1.5 rounded-full font-medium select-none">
                <PremiumIcon size={16} color="#fe9a00" />
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
              href="/"
              className="w-[30px] h-[30px] flex items-center justify-center"
            >
              <Users size={18} />
            </Link>
            <Link
              href="/"
              className="w-[30px] h-[30px] flex items-center justify-center"
            >
              <Bell size={18} />
            </Link>
            <Link
              href="/"
              className="w-[30px] h-[30px] flex items-center justify-center"
            >
              <Mail size={18} />
            </Link>
            <div className="ms-4">
              <UserDropdown
                menu={navItems}
                avatar={user?.profile?.profilePicture}
                username={user?.fullName || ""}
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
