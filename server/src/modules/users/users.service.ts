import * as fs from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
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

  async findByIdWithProfile(
    id: string | Types.ObjectId,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .populate('profile', 'profilePicture visibility isPremium')
      .select('-blockedUsers')
      .exec();
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

  async updateProfilePicture(userId: string, filename: string) {
    const profile = await this.profileModel.findById(userId);
    if (!profile) return null;

    if (profile.profilePicture) this.removeFile(profile.profilePicture);
    profile.profilePicture = filename;
    return profile.save();
  }

  async updateProfileImages(userId: string, filenames: string[]) {
    const profile = await this.profileModel.findById(userId);
    if (!profile) return null;

    if (profile?.profilePhotos?.length > 0) {
      profile.profilePhotos.forEach((f) => this.removeFile(f));
    }

    profile.profilePhotos = filenames;
    return profile.save();
  }

  async deleteProfileImage(userId: string, filename: string) {
    const profile = await this.profileModel.findById(userId);
    if (!profile) return null;

    profile.profilePhotos = profile.profilePhotos.filter(
      (img) => img !== filename,
    );
    this.removeFile(filename);

    return profile.save();
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    const profile = await this.profileModel.findById(userId);

    if (profile?.profilePicture) this.removeFile(profile?.profilePicture);
    if (profile?.profilePhotos)
      profile?.profilePhotos.forEach((f) => this.removeFile(f));

    await this.userModel.findByIdAndDelete(userId);
    return { success: true };
  }

  private removeFile(filename: string) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}
