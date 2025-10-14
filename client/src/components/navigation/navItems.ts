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
    key: "profile",
    icon: UserRound,
    count: 0,
    href: ROUTES.PROFILE_ME,
  },
  {
    label: "New Requests",
    key: "newRequests",
    icon: UsersRound,
    count: 0,
    href: ROUTES.NEW_REQUESTS,
  },
  {
    label: "Accepted Requests",
    key: "acceptedRequests",
    icon: CircleCheck,
    count: 0,
    href: ROUTES.ACCEPTED,
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
    icon: Heart,
    count: 0,
    href: ROUTES.SHORTLISTED,
  },
  {
    label: "Sent Requests",
    key: "sentRequests",
    icon: Send,
    count: 0,
    href: ROUTES.SENT_REQUESTS,
  },
  {
    label: "Declined Requests",
    key: "declinedRequests",
    icon: Ban,
    count: 0,
    href: ROUTES.DECLINED_REQUESTS,
  },
  {
    label: "Blocked",
    key: "blocked",
    icon: EyeOff,
    count: 0,
    href: ROUTES.BLOCKED,
  },
  {
    label: "Settings",
    key: "settings",
    icon: Settings2,
    count: 0,
    href: ROUTES.SETTINGS.DEFAULT,
  },
];
