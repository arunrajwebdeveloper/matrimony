import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchProfilesDto } from './dto/search-profiles.dto';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter2
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private eventEmitter: EventEmitter2, // Inject EventEmitter2
    private readonly uploadService: UploadService,
  ) {}

  async create(profile: Partial<Profile>): Promise<ProfileDocument> {
    const newProfile = new this.profileModel(profile);
    return newProfile.save();
  }

  async findByUserId(
    userId: string | Types.ObjectId | undefined,
  ): Promise<ProfileDocument | null> {
    return this.profileModel.findOne({ user: userId, deletedAt: null }).exec();
  }

  async findById(
    profileId: string | Types.ObjectId,
  ): Promise<ProfileDocument | null> {
    return this.profileModel.findById(profileId).exec();
  }

  async findByprofileId(profileId: string): Promise<ProfileDocument | null> {
    return this.profileModel.findOne({ profileId }).exec();
  }

  async findUserProfile(
    profileId: string | Types.ObjectId,
    userId: string,
  ): Promise<any> {
    const profile = await this.profileModel.findOne({ profileId }).exec();

    if (!profile) return null;

    if (profile?.profilePicture) {
      const { signedUrl } = await this.uploadService.generateSignedUrl(
        userId.toString(),
        profile.profilePicture,
        'profile-pictures',
      );

      return {
        ...profile.toObject(),
        profilePicture: signedUrl,
      };
    }
  }

  async update(
    userId: string | Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel
      .findOneAndUpdate(
        { user: userId, deletedAt: null },
        { $set: updateProfileDto },
        { new: true },
      )
      .exec();

    if (!profile) {
      throw new NotFoundException('Profile not found or already deleted.');
    }

    // Emit profile.updated event
    this.eventEmitter.emit('profile.updated', {
      profileId: profile._id,
      userId: profile.user,
    });

    return profile;
  }

  async search(
    searchDto: SearchProfilesDto,
  ): Promise<{ profiles: ProfileDocument[]; total: number }> {
    const {
      gender,
      minAge,
      maxAge,
      religion,
      community,
      country,
      state,
      city,
      maritalStatus,
      educationLevel,
      minIncome,
      diet,
      disabilityStatus,
      isPremium,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = searchDto;

    const query: FilterQuery<ProfileDocument> = {
      deletedAt: null, // Only active profiles
      visibility: 'public', // Only public profiles by default
      'verification.profileReview': 'approved', // Only approved profiles
    };

    if (gender) {
      query.gender = gender;
    }
    if (minAge || maxAge) {
      // Calculate DOB range from age
      const now = new Date();
      if (maxAge) {
        const minDob = new Date(
          now.getFullYear() - maxAge - 1,
          now.getMonth(),
          now.getDate(),
        );
        query.dateOfBirth = { ...query.dateOfBirth, $gte: minDob };
      }
      if (minAge) {
        const maxDob = new Date(
          now.getFullYear() - minAge,
          now.getMonth(),
          now.getDate(),
        );
        query.dateOfBirth = { ...query.dateOfBirth, $lte: maxDob };
      }
    }
    if (religion) {
      query.religion = religion;
    }
    if (community) {
      query.community = community;
    }
    if (country) {
      query.country = country;
    }
    if (state) {
      query.state = state;
    }
    if (city) {
      query.city = city;
    }
    if (maritalStatus) {
      query.maritalStatus = maritalStatus;
    }
    if (educationLevel) {
      query.educationLevel = educationLevel;
    }
    if (minIncome) {
      query.annualIncome = { $gte: minIncome };
    }
    if (diet) {
      query.diet = diet;
    }
    if (disabilityStatus) {
      query.disabilityStatus = disabilityStatus;
    }
    if (isPremium !== undefined) {
      query.isPremium = isPremium;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      this.profileModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.profileModel.countDocuments(query).exec(),
    ]);

    return { profiles, total };
  }

  async softDelete(
    userId: string | Types.ObjectId,
  ): Promise<ProfileDocument | null> {
    return this.profileModel
      .findOneAndUpdate(
        { user: userId, deletedAt: null },
        { deletedAt: new Date(), visibility: 'hidden' },
        { new: true },
      )
      .exec();
  }

  async updateProfileVerificationStatus(
    profileId: string | Types.ObjectId,
    status: 'approved' | 'rejected',
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(profileId).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    profile.verification.profileReview = status;
    await profile.save();

    this.eventEmitter.emit('profile.verifiedStatusUpdated', {
      profileId: profile._id,
      userId: profile.user,
      status: profile.verification.profileReview,
    });

    return profile;
  }
}
