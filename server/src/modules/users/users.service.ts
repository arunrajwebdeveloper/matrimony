import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
}
