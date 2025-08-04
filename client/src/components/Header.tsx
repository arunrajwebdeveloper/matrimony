"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Mail, Users } from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="fixed top-0 left-0 z-[2000] w-full border-b-[1px] border-gray-200">
      <div className="px-4 flex justify-between items-center h-[60px]">
        <div className="matrimony-logo">
          <Link
            href={ROUTES.HOME}
            className="font-bold text-base text-pink-600"
          >
            Matrimony
          </Link>
        </div>

        {/* <Link
                href={ROUTES.DASHBOARD}
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href={ROUTES.PROFILE}
                className="text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link> */}

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
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
            <Link
              href="/"
              className="flex items-center justify-center border-2 border-blue-600 px-2.5 py-1.5 rounded-full text-blue-600 font-medium text-xs"
            >
              <span>Upgrade</span>
            </Link>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="font-medium text-black text-xs">
                <span>Hello, {user?.fullName || user?.email}</span>
                <span onClick={handleLogout} className="block">
                  Logout
                </span>
              </div>
              <div className="rounded-[50%] overflow-hidden w-[34px] h-[34px]">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=70"
                  alt=""
                  width={80}
                  height={80}
                  className="object-cover w-[34px] h-[34px]"
                />
              </div>
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
