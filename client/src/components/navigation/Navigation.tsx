"use client";

import Link from "next/link";
import { navItems } from "./navItems";
import { usePathname } from "next/navigation";
import { NavigationItemType } from "@/types/menu";
import { useNavigationSummary } from "@/hooks/useNavigationSummary";
import NavigationSkeleton from "../skeleton/NavigationSkeleton";

export default function Navigation() {
  const pathname = usePathname();

  const { data, isLoading } = useNavigationSummary();

  if (isLoading)
    return (
      <div className="space-y-7">
        {[...Array(8)].map((_, index) => (
          <NavigationSkeleton key={`nav-skel-${index}`} index={index} />
        ))}
      </div>
    );

  const navlist = navItems?.map((item) => ({
    ...item,
    count: data?.result?.[item?.key] ?? item?.count,
  }));

  return (
    <div className="space-y-2">
      {navlist?.map(
        ({ label, icon: Icon, count, href }: NavigationItemType) => {
          const isActive =
            pathname === href ||
            (href.startsWith("/dashboard/settings") &&
              pathname.startsWith("/dashboard/settings"));

          return (
            <Link
              className={`flex items-center justify-between py-2 text-sm font-medium transition ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
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
