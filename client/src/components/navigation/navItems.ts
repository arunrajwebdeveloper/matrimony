import { NavigationItemType } from "@/types/menu";
import { ROUTES } from "@/utils/constants";
import {
  CircleCheck,
  Eye,
  Heart,
  Send,
  Ban,
  EyeOff,
  UserRound,
  Settings2,
  UsersRound,
} from "lucide-react";

export const navItems: NavigationItemType[] = [
  {
    label: "My Profile",
    icon: UserRound,
    count: 0,
    href: ROUTES.PROFILE_ME,
  },
  {
    label: "New Requests",
    icon: UsersRound,
    count: 12,
    href: ROUTES.NEW_REQUESTS,
  },
  {
    label: "Accepted Requests",
    icon: CircleCheck,
    count: 25,
    href: ROUTES.ACCEPTED,
  },
  {
    label: "Recently Viewed",
    icon: Eye,
    count: 54,
    href: ROUTES.RECENTLY_VIEWED,
  },
  { label: "Shortlisted", icon: Heart, count: 8, href: ROUTES.SHORTLISTED },
  { label: "Sent Requests", icon: Send, count: 17, href: ROUTES.SENT_REQUESTS },
  {
    label: "Declined Requests",
    icon: Ban,
    count: 0,
    href: ROUTES.DECLINED_REQUESTS,
  },
  { label: "Blocked", icon: EyeOff, count: 0, href: ROUTES.BLOCKED },
  {
    label: "Settings",
    icon: Settings2,
    count: 0,
    href: ROUTES.SETTINGS.DEFAULT,
  },
];
