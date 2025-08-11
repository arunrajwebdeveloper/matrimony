"use client";

import Link from "next/link";
import { navItems } from "./navItems";
import { usePathname } from "next/navigation";
import { NavigationItemType } from "@/types/menu";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div>
      {navItems.map(
        ({ label, icon: Icon, count, href }: NavigationItemType) => {
          // const isActive = pathname === href;

          const isActive =
            pathname === href ||
            (href.startsWith("/dashboard/settings") &&
              pathname.startsWith("/dashboard/settings"));

          return (
            <Link
              className={`flex items-center justify-between py-2 text-sm my-2 font-medium transition ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
              }`}
              key={label}
              href={href}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{label}</span>
              </div>
              {count !== 0 && (
                <span className="text-xs font-normal bg-amber-50 text-amber-500 py-1 px-1 rounded-md min-w-[26px] text-center">
                  {count}
                </span>
              )}
            </Link>
          );
        }
      )}
    </div>
  );
}
