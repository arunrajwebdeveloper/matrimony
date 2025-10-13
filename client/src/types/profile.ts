import { LucideIcon } from "lucide-react";

export interface UserProfile {
  _id?: string;
  user?: string;
  username?: string;
  profileId?: string;
  firstName?: string;
  lastName?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string; // ISO format
  religion?: string;
  motherTongue?: string;
  height?: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;
  disabilityStatus?: string;
  aboutMe?: string;
  phoneNumber?: string;
  email?: string;
  alternateEmails?: string[];
  country?: string;
  state?: string;
  city?: string;
  residencyStatus?: string;
  familyType?: string;
  familyStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  sisters?: number;
  brothersMarried?: number;
  sistersMarried?: number;
  familyValues?: string;
  educationLevel?: string;
  educationField?: string;
  occupation?: string;
  annualIncome?: number;
  diet?: string;
  smokingHabit?: "Yes" | "No" | "Occasionally";
  drinkingHabit?: "Yes" | "No" | "Occasionally";
  hobbies?: string[];
  interests?: string[];
  maritalStatus?: string;
  children?: number;
  profilePhotos?: string[];
  profilePicture?: string | null;
  coverImage?: string | null;
  visibility?: "public" | "private";
  isPremium?: boolean;
  verification?: {
    phone?: boolean;
    email?: boolean;
    id?: boolean;
    profileReview?: "pending" | "approved" | "rejected";
  };
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDetailState {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
}

export interface ProfileCardProps {
  title?: string | null;
  className?: string;
  link?: string | null;
  children: React.ReactNode;
}

export interface SidebarCardProps {
  title?: string | null;
  className?: string;
  link?: string | null;
  children: React.ReactNode;
}

export interface UserMatchType {
  _id?: string;
  firstName: string;
  lastName: string;
  profileId: string;
  dateOfBirth: string;
  occupation: string;
  city: string;
  state: string;
  motherTongue: string;
  isOnline?: boolean;
  profilePicture: string;
  user: string;
}

export interface MatchCardActionsVisibility {
  showAcceptRequest?: boolean;
  showDeclineRequest?: boolean;
  showAddToShortlist?: boolean;
  showRemove?: boolean;
  showCancelRequest?: boolean;
  showSendInterest?: boolean;
}

export interface MatchCardProps
  extends UserMatchType,
    MatchCardActionsVisibility {}

export interface MatchResult {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  data: UserMatchType[];
}

export interface MatchState {
  result: MatchResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface MatchListProps extends MatchCardActionsVisibility {
  users: UserMatchType[];
  isLoading: boolean;
  error: Error | null;
}

export interface UserCardSidebarItemType {
  name: string;
  profileId: string;
  profileImage: string;
}

export type MediaItem = {
  source: string;
  type: "video" | "image";
};
