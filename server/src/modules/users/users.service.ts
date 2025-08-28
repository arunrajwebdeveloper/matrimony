import * as fs from 'fs';
import { join } from 'path';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';
import { UploadService } from '../upload/upload.service';
import { FOLDER_TYPES, FolderType } from 'src/common/constants/folder.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @Inject(forwardRef(() => UploadService)) // 👈 needed for circular dep
    private readonly uploadService: UploadService,
  ) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, deletedAt: null }).exec();
  }

  async findByProfileId(profileId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ profileId }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    // Select passwordHash explicitly as it's excluded by default
    return this.userModel
      .findOne({ email, deletedAt: null })
      .populate('profile', 'profilePicture profilePhotos')
      .select('+passwordHash')
      .exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIdWithProfile(id: string | Types.ObjectId): Promise<any> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'profile',
        select: 'profilePicture visibility isPremium',
      })
      .select('-blockedUsers') // only removes this, all others stay
      // .lean() // make it plain JS object (no mongoose doc overhead)
      .exec();

    if (!user) return null;

    return user.toObject();
  }

  async softDelete(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: 'deactivated' },
        { new: true },
      )
      .exec();
  }

  /**
   * Retrieves the list of user IDs that the specified user has blocked.
   *
   * @param userId The ID of the user.
   * @returns An array of string IDs of blocked users.
   */
  async getBlockedUserIds(userId: string): Promise<string[]> {
    const user = await this.userModel
      .findById(new Types.ObjectId(userId))
      .select('blockedUsers') // Only fetch the blockedUsers field
      .exec();

    if (!user) {
      // Handle case where user is not found
      return [];
    }

    // Convert the array of ObjectIds to strings
    return user.blockedUsers.map((id) => id.toString());
  }

  // FILE UPLOADS

  /** Update single profile picture */
  async updateProfilePicture(userId: string, filename: string) {
    const profile = await this.profileModel.findOne({ user: userId });
    if (!profile) return null;

    if (profile.profilePicture) {
      this.removeFile(FOLDER_TYPES.PROFILE_PICTURES, profile.profilePicture);
    }

    profile.profilePicture = filename;
    return profile.save();
  }

  /** Update single profile cover */
  async updateProfileCover(userId: string, filename: string) {
    const profile = await this.profileModel.findOne({ user: userId });
    if (!profile) return null;

    if (profile.coverImage) {
      this.removeFile(FOLDER_TYPES.COVER_IMAGES, profile.coverImage);
    }

    profile.coverImage = filename;
    return profile.save();
  }

  /** Update multiple profile photos */

  async updateProfilePhotos(userId: string, newFiles: string[]) {
    const profile = await this.profileModel.findOne({ user: userId });
    if (!profile) return null;

    // Initialize array if empty
    if (!profile.profilePhotos) profile.profilePhotos = [];

    // Maximum allowed files
    const MAX_FILES = 6;

    // Merge existing and new files
    const updatedFiles = [...profile.profilePhotos, ...newFiles];

    // If exceeds max, trim oldest files and remove them from folder
    if (updatedFiles.length > MAX_FILES) {
      const excess = updatedFiles.length - MAX_FILES;
      const filesToRemove = updatedFiles.splice(0, excess); // remove from start (oldest)
      filesToRemove.forEach((file) =>
        this.removeFile(FOLDER_TYPES.PROFILE_PHOTOS, file),
      );
    }

    profile.profilePhotos = updatedFiles;
    return profile.save();
  }

  /** Delete a single profile image */
  async deleteProfileImage(userId: string, filename: string) {
    const profile = await this.profileModel.findOne({ user: userId });
    if (!profile) return null;

    profile.profilePhotos = profile.profilePhotos.filter(
      (img) => img !== filename,
    );
    this.removeFile(FOLDER_TYPES.PROFILE_PHOTOS, filename);

    return profile.save();
  }

  /** Delete entire user and their files */
  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const profile = await this.profileModel.findOne({ user: userId });

    if (profile?.profilePicture) {
      this.removeFile(FOLDER_TYPES.PROFILE_PICTURES, profile.profilePicture);
    }

    if (profile?.profilePhotos?.length) {
      profile.profilePhotos.forEach((f) =>
        this.removeFile(FOLDER_TYPES.PROFILE_PHOTOS, f),
      );
    }

    // if (profile?.coverPhotos?.length) {
    //   profile.coverPhotos.forEach((f) =>
    //     this.removeFile(FOLDER_TYPES.COVER_IMAGES, f),
    //   );
    // }

    await this.userModel.findByIdAndDelete(userId);
    return { success: true };
  }

  private removeFile(folder: FolderType, filename: string) {
    // Use project root as base
    const filePath = join(process.cwd(), 'uploads', folder, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted:', filePath);
    } else {
      console.log('File not found:', filePath);
    }
  }
}
