import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserInteraction,
  UserInteractionDocument,
} from './schemas/user-interaction.schema';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(UserInteraction.name)
    private userInteractionModel: Model<UserInteractionDocument>,
  ) {}

  /**
   * Retrieves profiles that match the user's partner preferences.
   * This is an advanced query that filters based on the user's `partnerPreferences` object
   * and excludes profiles the user has already interacted with.
   * @param userId The ID of the current user.
   * @returns An array of matching profiles.
   */
  async getPreferredMatches(
    userId: string,
    page = 1,
    limit = 10, // default 10 results per page
  ) {
    const userProfile = await this.profileModel
      .findOne({ user: userId })
      .exec();
    if (!userProfile) {
      throw new NotFoundException('User profile not found.');
    }

    const userInteractions = await this.userInteractionModel
      .findOne({ user: userId })
      .exec();

    const excludedIds = [
      userProfile._id, // Exclude the user's own profile
      ...(userInteractions?.shortlisted || []),
      ...(userInteractions?.declined || []),
      ...(userInteractions?.blocked || []),
    ];

    // Build the query based on the user's preferences
    const query: any = {
      _id: { $nin: excludedIds }, // Exclude interacted profiles
      gender: { $ne: userProfile.gender }, // Find the opposite gender
    };

    const preferences = userProfile.partnerPreferences;
    if (preferences.minAge && preferences.maxAge) {
      // Calculate age range from date of birth
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - preferences.maxAge);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - preferences.minAge);
      query.dateOfBirth = { $gte: minDate, $lte: maxDate };
    }
    if (preferences.religion && preferences.religion.length > 0) {
      query.religion = { $in: preferences.religion };
    }
    if (preferences.city && preferences.city.length > 0) {
      query.city = { $in: preferences.city };
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Run queries in parallel for efficiency
    const [data, total] = await Promise.all([
      this.profileModel
        .find(query)
        .select(
          'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.profileModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Retrieves profiles that the user has not yet interacted with.
   * @param userId The ID of the current user.
   * @returns An array of new matches.
   */
  async getNewMatches(
    userId: string,
    page = 1,
    limit = 10, // default 10 per page
  ) {
    const userProfile = await this.profileModel
      .findOne({ user: userId })
      .exec();
    if (!userProfile) {
      throw new NotFoundException('User profile not found.');
    }

    // Handle the case where user interactions might not exist yet
    const userInteractions = await this.userInteractionModel
      .findOne({ user: userId })
      .exec();

    // Build excluded profile IDs
    const excludedIds = [
      userProfile._id,
      ...(userInteractions?.shortlisted || []),
      ...(userInteractions?.declined || []),
      ...(userInteractions?.blocked || []),
    ];

    // Build query
    const query = {
      _id: { $nin: excludedIds },
      gender: { $ne: userProfile.gender },
    };

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch results and count in parallel
    const [data, total] = await Promise.all([
      this.profileModel
        .find(query)
        .select(
          'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.profileModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Adds or removes a profile from the user's shortlist.
   * @param userId The ID of the current user.
   * @param profileId The ID of the profile to update.
   * @returns A success message.
   */
  async updateShortlist(
    userId: string,
    profileId: string,
    action: 'add' | 'remove',
  ) {
    const profileObjectId = new Types.ObjectId(profileId);
    let updateQuery: any;

    if (action === 'add') {
      updateQuery = { $addToSet: { shortlisted: profileObjectId } };
    } else {
      updateQuery = { $pull: { shortlisted: profileObjectId } };
    }

    await this.userInteractionModel
      .findOneAndUpdate(
        { user: userId },
        updateQuery,
        { new: true, upsert: true }, // Creates a new document if one doesn't exist
      )
      .exec();

    return { message: `Profile ${action}ed from shortlist successfully.` };
  }

  /**
   * Retrieves profiles that the current user has shortlisted.
   * @param userId The ID of the current user.
   * @returns An array of shortlisted profiles.
   */
  async getShortlistedProfiles(userId: string) {
    const userInteractions = await this.userInteractionModel
      .findOne({ user: userId })
      .populate('shortlisted') // Use populate to get the full profile documents
      .exec();

    return userInteractions?.shortlisted || [];
  }

  /**
   * Adds a profile to the user's declined list.
   * @param userId The ID of the current user.
   * @param profileId The ID of the profile to decline.
   * @returns A success message.
   */
  async declineProfile(userId: string, profileId: string) {
    const profileObjectId = new Types.ObjectId(profileId);

    await this.userInteractionModel
      .findOneAndUpdate(
        { user: userId },
        { $addToSet: { declined: profileObjectId } },
        { new: true, upsert: true },
      )
      .exec();

    return { message: 'Profile declined successfully.' };
  }

  /**
   * Retrieves profiles that the current user has declined.
   * @param userId The ID of the current user.
   * @returns An array of declined profiles.
   */
  async getDeclinedProfiles(userId: string) {
    const userInteractions = await this.userInteractionModel
      .findOne({ user: userId })
      .populate('declined')
      .exec();

    return userInteractions?.declined || [];
  }
}
