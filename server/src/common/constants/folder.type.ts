export const FOLDER_TYPES = {
  PROFILE_PICTURES: 'profile-pictures',
  PROFILE_PHOTOS: 'profile-photos',
  COVER_IMAGES: 'cover-images',
} as const;

export type FolderType = (typeof FOLDER_TYPES)[keyof typeof FOLDER_TYPES];
