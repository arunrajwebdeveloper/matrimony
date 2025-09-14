export const FOLDER_TYPES = {
  PROFILE_PICTURES: 'profile-pictures', // avatar
  PROFILE_PHOTOS: 'profile-photos', // gallery
  COVER_IMAGES: 'cover-images', // cover
} as const;

export type FolderType = (typeof FOLDER_TYPES)[keyof typeof FOLDER_TYPES];
