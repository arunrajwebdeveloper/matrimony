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
      .populate('profile', 'profilePicture profilePhotos')
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
}
