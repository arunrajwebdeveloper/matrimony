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

export interface UserCardType {
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
}

export interface MatchResult {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  result: UserCardType[];
}

export interface MatchState {
  data: MatchResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface MatchListProps {
  users: UserCardType[];
  isLoading: boolean;
  error: string | null;
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
