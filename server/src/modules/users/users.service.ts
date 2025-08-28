import * as fs from 'fs';
import { join } from 'path';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';
import { UploadService } from '../upload/upload.service';

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
      this.removeFile('profile-pictures', profile.profilePicture);
    }

    profile.profilePicture = filename;
    return profile.save();
  }

  /** Update multiple profile images */
  async updateProfileImages(userId: string, filenames: string[]) {
    const profile = await this.profileModel.findOne({ user: userId });
    if (!profile) return null;

    if (profile?.profilePhotos?.length > 0) {
      profile.profilePhotos.forEach((f) =>
        this.removeFile('profile-images', f),
      );
    }

    profile.profilePhotos = filenames;
    return profile.save();
  }

  /** Update multiple cover images */
  // async updateCoverImages(userId: string, filenames: string[]) {
  //   const profile = await this.profileModel.findOne({ user: userId });
  //   if (!profile) return null;

  //   if (profile?.coverPhotos?.length > 0) {
  //     profile.coverPhotos.forEach((f) =>
  //       this.removeFile('cover-images', f),
  //     );
  //   }

  //   profile.coverPhotos = filenames;
  //   return profile.save();
  // }

  /** Delete a single profile image */
  async deleteProfileImage(userId: string, filename: string) {
    const profile = await this.profileModel.findOne({ user: userId });
    if (!profile) return null;

    profile.profilePhotos = profile.profilePhotos.filter(
      (img) => img !== filename,
    );
    this.removeFile('profile-images', filename);

    return profile.save();
  }

  /** Delete entire user and their files */
  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const profile = await this.profileModel.findOne({ user: userId });

    if (profile?.profilePicture) {
      this.removeFile('profile-pictures', profile.profilePicture);
    }

    if (profile?.profilePhotos?.length) {
      profile.profilePhotos.forEach((f) =>
        this.removeFile('profile-images', f),
      );
    }

    // if (profile?.coverPhotos?.length) {
    //   profile.coverPhotos.forEach((f) =>
    //     this.removeFile('cover-images', f),
    //   );
    // }

    await this.userModel.findByIdAndDelete(userId);
    return { success: true };
  }

  /** Remove file from a specific category */
  private removeFile(
    category: 'profile-pictures' | 'profile-images' | 'cover-images',
    filename: string,
  ) {
    const filePath = join(__dirname, '..', '..', 'uploads', category, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
