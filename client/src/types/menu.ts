import { LucideIcon } from "lucide-react";

export interface UserDropdownMenuType {
  label: string;
  icon: LucideIcon;
  action?: string | (() => void);
}

export interface UserDropdownProps {
  avatar?: string | undefined;
  menu: UserDropdownMenuType[];
  firstname: string;
  lastname: string;
  email: string;
}

export interface NavigationItemType {
  label: string;
  icon: LucideIcon;
  count: number;
  href: string;
  key: string;
}
