import {
  LucideIcon,
  MailOpen,
  CircleCheck,
  Eye,
  Heart,
  Send,
  Ban,
  EyeOff,
  UserRound,
  Settings2,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  count: number;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "My Profile", icon: UserRound, count: 0, href: "/profile" },
  { label: "Inbox", icon: MailOpen, count: 12, href: "/" },
  { label: "Accepted", icon: CircleCheck, count: 25, href: "/" },
  { label: "Recently Viewed", icon: Eye, count: 54, href: "/" },
  { label: "Shortlist", icon: Heart, count: 8, href: "/" },
  { label: "Sent", icon: Send, count: 17, href: "/" },
  { label: "Declined / Cancelled", icon: Ban, count: 0, href: "/" },
  { label: "Blocked", icon: EyeOff, count: 0, href: "/" },
  { label: "Settings", icon: Settings2, count: 0, href: "/" },
];
