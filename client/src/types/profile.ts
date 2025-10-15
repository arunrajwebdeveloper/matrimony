import { InfiniteData } from "@tanstack/react-query";
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

export interface MatchListBaseProps {
  showAcceptRequest?: boolean;
  showDeclineRequest?: boolean;
  showAddToShortlist?: boolean;
  showRemoveFromDeclined?: boolean;
  showRemoveFromAccepted?: boolean;
  showRemoveFromShortlisted?: boolean;
  showRemoveFromBlocked?: boolean;
  showCancelRequest?: boolean;
  showSendInterest?: boolean;
  showIgnore?: boolean;
}

export interface MatchCardProps extends UserMatchType, MatchListBaseProps {}

export interface ProfileListResult {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  data: UserMatchType[];
}

export interface MatchState {
  result: ProfileListResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface InfiniteMatchListProps extends MatchListBaseProps {
  // Data comes in TanStack's InfiniteData structure
  data: InfiniteData<ProfileListResult, number> | undefined;
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

export interface ProfileListProps extends MatchListBaseProps {
  title: string;
  link?: string;
  itemPerPage?: number;
  // paginationPath is no longer strictly needed for infinite scroll
  paginationPath: string;
  hasPagination?: boolean; // Set to false for infinite scroll
  endpoint: string;
}

export interface ProfileListTeaserProps extends MatchListBaseProps {
  title: string;
  viewMoreLink: string; // The URL for the full list page
  endpoint: string;
  itemPerPage: number; // The limit per page for the API
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
