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
  profilePicture?: string;
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
  name: string;
  profileId: string;
  height: string;
  age: number;
  profession: string;
  location: string;
  motherTongue: string;
  isOnline: boolean;
  profileImage: string;
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
