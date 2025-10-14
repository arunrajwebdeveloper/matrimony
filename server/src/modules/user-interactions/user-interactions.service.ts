import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserInteractions } from './schemas/user-interactions.schema';
import { UserInteractionLists } from './schemas/user-interaction-lists.schema';
import { InteractionType } from './enums/interaction-type.enum';
import { InteractionStatus } from './enums/interaction-status.enum';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';

@Injectable()
export class UserInteractionsService {
  constructor(
    @InjectModel(UserInteractions.name)
    private interactionModel: Model<UserInteractions>,
    @InjectModel(UserInteractionLists.name)
    private interactionListsModel: Model<UserInteractionLists>,
    @InjectModel(Profile.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  // Initialize user interaction lists when user registers
  async initializeUserLists(userId: string) {
    const existingLists = await this.interactionListsModel.findOne({ userId });
    if (!existingLists) {
      const newLists = new this.interactionListsModel({ userId });
      await newLists.save();
    }
    return existingLists;
  }

  // MATCHES

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

    const userInteractions = await this.interactionListsModel
      .findOne({ userId })
      .exec();

    const excludedIds = [
      userProfile.user, // Exclude the user's own profile
      ...(userInteractions?.shortlisted || []),
      ...(userInteractions?.declinedRequests || []),
      ...(userInteractions?.blocked || []),
      ...(userInteractions?.acceptedRequests || []),
      ...(userInteractions?.sentMatchRequests || []),
      ...(userInteractions?.ignored || []),
    ];

    // Build the query based on the user's preferences
    const query: any = {
      user: { $nin: excludedIds }, // Exclude interacted profiles
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
    const userInteractions = await this.interactionListsModel
      .findOne({ userId })
      .exec();

    // Build excluded profile IDs
    const excludedIds = [
      userProfile.user, // Exclude the user's own profile
      ...(userInteractions?.shortlisted || []),
      ...(userInteractions?.declinedRequests || []),
      ...(userInteractions?.blocked || []),
      ...(userInteractions?.acceptedRequests || []),
      ...(userInteractions?.sentMatchRequests || []),
      ...(userInteractions?.ignored || []),
    ];

    // Build query
    const query = {
      user: { $nin: excludedIds },
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

  // SHORTLIST OPERATIONS
  async addToShortlist(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new ConflictException('Cannot shortlist yourself');
    }

    // Check if already shortlisted
    const existing = await this.interactionModel.findOne({
      fromUserId: new Types.ObjectId(fromUserId),
      toUserId: new Types.ObjectId(toUserId),
      interactionType: InteractionType.SHORTLISTED,
      status: InteractionStatus.ACTIVE,
    });

    if (existing) {
      throw new ConflictException('User already shortlisted');
    }

    // Check if user is blocked
    const isBlocked = await this.isUserBlocked(fromUserId, toUserId);
    if (isBlocked) {
      throw new ForbiddenException('Cannot shortlist blocked user');
    }

    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Create interaction record

        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.SHORTLISTED,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(fromUserId) },
          {
            $addToSet: { shortlisted: new Types.ObjectId(toUserId) },
            $setOnInsert: { userId: new Types.ObjectId(fromUserId) },
          },
          { upsert: true, session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User added to shortlist successfully' };
  }

  // BLOCK OPERATIONS
  async blockUser(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new ConflictException('Cannot block yourself');
    }

    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Create block interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.BLOCKED,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists - add to blocked, remove from other lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(fromUserId) },
          {
            $addToSet: { blocked: new Types.ObjectId(toUserId) },
            $pull: {
              shortlisted: new Types.ObjectId(toUserId),
              sentMatchRequests: new Types.ObjectId(toUserId),
              receivedMatchRequests: new Types.ObjectId(toUserId),
              acceptedRequests: new Types.ObjectId(toUserId),
            },
            $setOnInsert: { userId: new Types.ObjectId(fromUserId) },
          },
          { upsert: true, session },
        );

        // Also remove fromUserId from toUserId's lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(toUserId) },
          {
            $pull: {
              shortlisted: new Types.ObjectId(fromUserId),
              sentMatchRequests: new Types.ObjectId(fromUserId),
              receivedMatchRequests: new Types.ObjectId(fromUserId),
              acceptedRequests: new Types.ObjectId(fromUserId),
            },
          },
          { session },
        );

        // Mark existing interactions as expired
        await this.interactionModel.updateMany(
          {
            $or: [
              {
                fromUserId: new Types.ObjectId(fromUserId),
                toUserId: new Types.ObjectId(toUserId),
              },
              {
                fromUserId: new Types.ObjectId(toUserId),
                toUserId: new Types.ObjectId(fromUserId),
              },
            ],
            interactionType: {
              $in: [
                InteractionType.MATCH_REQUEST_SENT,
                InteractionType.SHORTLISTED,
              ],
            },
            status: {
              $in: [InteractionStatus.ACTIVE, InteractionStatus.PENDING],
            },
          },
          { status: InteractionStatus.EXPIRED },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User blocked successfully' };
  }

  async unblockUser(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Mark block interaction as expired
        await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(fromUserId),
            toUserId: new Types.ObjectId(toUserId),
            interactionType: InteractionType.BLOCKED,
            status: InteractionStatus.ACTIVE,
          },
          { status: InteractionStatus.EXPIRED },
          { session },
        );

        // Create unblock interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.UNBLOCKED,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(fromUserId) },
          { $pull: { blocked: new Types.ObjectId(toUserId) } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User unblocked successfully' };
  }

  // MATCH REQUEST OPERATIONS
  async sendMatchRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new ConflictException('Cannot send match request to yourself');
    }

    // Check if users are blocked
    const isBlocked = await this.isUserBlocked(fromUserId, toUserId);
    if (isBlocked) {
      throw new ForbiddenException('Cannot send match request to blocked user');
    }

    // Check if request already exists
    const existingRequest = await this.interactionModel.findOne({
      fromUserId: new Types.ObjectId(fromUserId),
      toUserId: new Types.ObjectId(toUserId),
      interactionType: InteractionType.MATCH_REQUEST_SENT,
      status: InteractionStatus.PENDING,
    });

    if (existingRequest) {
      throw new ConflictException('Match request already sent');
    }

    // Check if already matched
    const areMatched = await this.areUsersMatched(fromUserId, toUserId);

    if (areMatched) {
      throw new ConflictException('Users are already matched');
    }

    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.MATCH_REQUEST_SENT,
          status: InteractionStatus.PENDING,
        });
        await interaction.save({ session });

        // Update both users' lists
        await Promise.all([
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(fromUserId) },
            {
              $addToSet: { sentMatchRequests: new Types.ObjectId(toUserId) },
              $setOnInsert: { userId: new Types.ObjectId(fromUserId) },
            },
            { upsert: true, session },
          ),
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(toUserId) },
            {
              $addToSet: {
                receivedMatchRequests: new Types.ObjectId(fromUserId),
              },
              $setOnInsert: { userId: new Types.ObjectId(toUserId) },
            },
            { upsert: true, session },
          ),
        ]);
      });
    } finally {
      await session.endSession();
    }

    return { message: 'Match request sent successfully' };
  }

  async acceptMatchRequest(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Find and update the pending match request
        const matchRequest = await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(toUserId), // Note: reversed
            toUserId: new Types.ObjectId(fromUserId),
            interactionType: InteractionType.MATCH_REQUEST_SENT,
            status: InteractionStatus.PENDING,
          },
          { status: InteractionStatus.ACCEPTED },
          { session },
        );

        if (!matchRequest) {
          throw new NotFoundException('Match request not found');
        }

        // Create acceptance interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.MATCH_REQUEST_ACCEPTED,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update both users' lists
        await Promise.all([
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(fromUserId) },
            {
              $addToSet: { acceptedRequests: new Types.ObjectId(toUserId) },
              $pull: { receivedMatchRequests: new Types.ObjectId(toUserId) },
            },
            { session },
          ),
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(toUserId) },
            {
              $addToSet: { acceptedRequests: new Types.ObjectId(fromUserId) },
              $pull: { sentMatchRequests: new Types.ObjectId(fromUserId) },
            },
            { session },
          ),
        ]);
      });
    } finally {
      await session.endSession();
    }

    return { message: 'Match request accepted successfully' };
  }

  async cancelMatchRequest(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Find and update the pending match request
        const matchRequest = await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(fromUserId), // Note: reversed
            toUserId: new Types.ObjectId(toUserId),
            interactionType: InteractionType.MATCH_REQUEST_SENT,
            status: InteractionStatus.PENDING,
          },
          { status: InteractionStatus.CANCELLED },
          { session, new: true },
        );

        if (!matchRequest) {
          throw new NotFoundException(
            'No pending match request found to cancel',
          );
        }

        // Update both users' lists
        await Promise.all([
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(fromUserId) },
            {
              $pull: { sentMatchRequests: new Types.ObjectId(toUserId) },
            },
            { session },
          ),
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(toUserId) },
            {
              $pull: { receivedMatchRequests: new Types.ObjectId(fromUserId) },
            },
            { session },
          ),
        ]);
      });
    } finally {
      await session.endSession();
    }

    return { message: 'Match request cancelled successfully' };
  }

  async declineMatchRequest(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Find and update the pending match request
        const matchRequest = await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(toUserId), // Note: reversed
            toUserId: new Types.ObjectId(fromUserId),
            interactionType: InteractionType.MATCH_REQUEST_SENT,
            status: InteractionStatus.PENDING,
          },
          { status: InteractionStatus.DECLINED },
          { session },
        );

        if (!matchRequest) {
          throw new NotFoundException('Match request not found');
        }

        // Create decline interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.MATCH_REQUEST_DECLINED,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Remove from pending requests
        await Promise.all([
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(fromUserId) },
            {
              $addToSet: { declinedRequests: new Types.ObjectId(toUserId) },
              $pull: { receivedMatchRequests: new Types.ObjectId(toUserId) },
            },
            { session },
          ),
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(toUserId) },
            {
              $pull: { sentMatchRequests: new Types.ObjectId(fromUserId) },
            },
            { session },
          ),
        ]);
      });
    } finally {
      await session.endSession();
    }

    return { message: 'Match request declined successfully' };
  }

  // PROFILE VIEW OPERATIONS
  async recordProfileView(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) return; // Don't record self-views

    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.VIEW,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Increment view counters
        await Promise.all([
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(toUserId) },
            {
              $inc: { totalProfileViews: 1 },
              $setOnInsert: { userId: new Types.ObjectId(toUserId) },
            },
            { upsert: true, session },
          ),
          this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(fromUserId) },
            {
              $inc: { totalProfileViewsGiven: 1 },
              $setOnInsert: { userId: new Types.ObjectId(fromUserId) },
            },
            { upsert: true, session },
          ),
        ]);
      });
    } finally {
      await session.endSession();
    }

    return { message: 'Profile view recorded successfully' };
  }

  // GET OPERATIONS
  async getShortlisted(userId: string, page = 1, limit = 20) {
    const userInteractions = await this.interactionListsModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!userInteractions) {
      throw new NotFoundException('Interaction list not found');
    }

    const skip = (page - 1) * limit;
    const total = userInteractions?.shortlisted?.length || 0;
    const shortlistedIds = userInteractions?.shortlisted || [];

    const query: any = {
      user: { $in: shortlistedIds }, // include interacted profiles
    };

    // Run queries in parallel for efficiency
    const profiles = await this.profileModel
      .find(query)
      .select(
        'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: profiles,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async getBlocked(userId: string, page = 1, limit = 20) {
    const userInteractions = await this.interactionListsModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!userInteractions) {
      throw new NotFoundException('Interaction list not found');
    }

    const skip = (page - 1) * limit;
    const blockedIds = userInteractions?.blocked || [];
    const total = blockedIds?.length || 0;

    const query: any = {
      user: { $in: blockedIds },
    };

    // Find all profiles whose 'user' field matches any of those sent userIds
    const profiles = await this.profileModel
      .find(query)
      .select(
        'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
      )
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: profiles || [],
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async getAcceptedRequests(userId: string, page = 1, limit = 20) {
    const userInteractions = await this.interactionListsModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!userInteractions) {
      throw new NotFoundException('Interaction list not found');
    }

    const skip = (page - 1) * limit;
    const acceptedRequestIds = userInteractions?.acceptedRequests || [];
    const total = acceptedRequestIds?.length || 0;

    const query: any = {
      user: { $in: acceptedRequestIds },
    };

    // Find all profiles whose 'user' field matches any of those sent userIds
    const profiles = await this.profileModel
      .find(query)
      .select(
        'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
      )
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: profiles || [],
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async getReceivedMatchRequests(userId: string, page = 1, limit = 20) {
    const userInteractions = await this.interactionListsModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!userInteractions) {
      throw new NotFoundException('Interaction list not found');
    }

    const skip = (page - 1) * limit;
    const receivedRequestIds = userInteractions?.receivedMatchRequests || [];
    const total = receivedRequestIds?.length || 0;

    const query: any = {
      user: { $in: receivedRequestIds },
    };

    // Find all profiles whose 'user' field matches any of those sent userIds
    const profiles = await this.profileModel
      .find(query)
      .select(
        'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
      )
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: profiles || [],
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async getSentMatchRequests(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Find the user's interaction list
    const userInteractions = await this.interactionListsModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!userInteractions) {
      throw new NotFoundException('Interaction list not found');
    }

    const sentUserIds = userInteractions?.sentMatchRequests || [];
    const total = sentUserIds.length || 0;

    const query: any = {
      user: { $in: sentUserIds },
    };

    // Find all profiles whose 'user' field matches any of those sent userIds
    const profiles = await this.profileModel
      .find(query)
      .select(
        'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
      )
      .skip(skip)
      .limit(limit)
      .lean();

    // Return paginated response
    return {
      data: profiles || [],
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async getRecentViews(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const views = await this.interactionModel
      .find({
        toUserId: new Types.ObjectId(userId),
        interactionType: InteractionType.VIEW,
      })
      .populate(
        'fromUserId',
        'username email firstName lastName profilePicture', // NEED REWRITE
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.interactionModel.countDocuments({
      toUserId: new Types.ObjectId(userId),
      interactionType: InteractionType.VIEW,
    });

    return {
      data: views,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async removeFromShortlist(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Update existing shortlist interaction to inactive
        await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(fromUserId),
            toUserId: new Types.ObjectId(toUserId),
            interactionType: InteractionType.SHORTLISTED,
            status: InteractionStatus.ACTIVE,
          },
          { status: InteractionStatus.EXPIRED },
          { session },
        );

        // Create removal interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.REMOVED_FROM_SHORTLIST,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(fromUserId) },
          { $pull: { shortlisted: new Types.ObjectId(toUserId) } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User removed from shortlist successfully' };
  }

  async ignoreUser(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Create ignore interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.IGNORE,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(fromUserId) },
          { $addToSet: { ignored: new Types.ObjectId(toUserId) } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User added to ignored successfully' };
  }

  async removeFromDeclinedlist(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Update existing shortlist interaction to inactive
        await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(fromUserId),
            toUserId: new Types.ObjectId(toUserId),
            interactionType: InteractionType.DECLINED,
            status: InteractionStatus.ACTIVE,
          },
          { status: InteractionStatus.EXPIRED },
          { session },
        );

        // Create removal interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.REMOVED_FROM_DECLINEDLIST,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists
        await this.interactionListsModel.findOneAndUpdate(
          { userId: new Types.ObjectId(fromUserId) },
          { $pull: { declinedRequests: new Types.ObjectId(toUserId) } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User removed from declinedlist successfully' };
  }

  async removeFromAcceptedlist(fromUserId: string, toUserId: string) {
    const session = await this.interactionModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Update existing shortlist interaction to inactive
        await this.interactionModel.findOneAndUpdate(
          {
            fromUserId: new Types.ObjectId(fromUserId),
            toUserId: new Types.ObjectId(toUserId),
            interactionType: InteractionType.MATCH_REQUEST_ACCEPTED,
            status: InteractionStatus.ACTIVE,
          },
          { status: InteractionStatus.EXPIRED },
          { session },
        );

        // Create removal interaction
        const interaction = new this.interactionModel({
          fromUserId: new Types.ObjectId(fromUserId),
          toUserId: new Types.ObjectId(toUserId),
          interactionType: InteractionType.REMOVED_FROM_ACCEPTEDLIST,
          status: InteractionStatus.ACTIVE,
        });
        await interaction.save({ session });

        // Update user lists
        await Promise.all([
          await this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(fromUserId) },
            { $pull: { acceptedRequests: new Types.ObjectId(toUserId) } },
            { session },
          ),

          await this.interactionListsModel.findOneAndUpdate(
            { userId: new Types.ObjectId(toUserId) },
            { $pull: { acceptedRequests: new Types.ObjectId(fromUserId) } },
            { session },
          ),
        ]);
      });
    } finally {
      await session.endSession();
    }

    return { message: 'User removed from acceptedlist successfully' };
  }

  async getDeclined(userId: string, page = 1, limit = 20) {
    const userInteractions = await this.interactionListsModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!userInteractions) {
      throw new NotFoundException('Interaction list not found');
    }

    const skip = (page - 1) * limit;
    const declinedRequestIds = userInteractions?.declinedRequests || [];
    const total = declinedRequestIds?.length || 0;

    const query: any = {
      user: { $in: declinedRequestIds },
    };

    // Find all profiles whose 'user' field matches any of those sent userIds
    const profiles = await this.profileModel
      .find(query)
      .select(
        'user firstName lastName profileId dateOfBirth occupation city state motherTongue isOnline profilePicture',
      )
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: profiles || [],
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  // HELPER METHODS
  async isUserBlocked(userId1: string, userId2: string): Promise<boolean> {
    const blocked = await this.interactionModel.findOne({
      $or: [
        {
          fromUserId: new Types.ObjectId(userId1),
          toUserId: new Types.ObjectId(userId2),
          interactionType: InteractionType.BLOCKED,
          status: InteractionStatus.ACTIVE,
        },
        {
          fromUserId: new Types.ObjectId(userId2),
          toUserId: new Types.ObjectId(userId1),
          interactionType: InteractionType.BLOCKED,
          status: InteractionStatus.ACTIVE,
        },
      ],
    });
    return !!blocked;
  }

  async areUsersMatched(userId1: string, userId2: string): Promise<boolean> {
    const userLists = await this.interactionListsModel
      .findOne({ userId: new Types.ObjectId(userId1) })
      .select('acceptedRequests');

    return (
      userLists?.acceptedRequests?.includes(new Types.ObjectId(userId2)) ||
      false
    );
  }

  async getRelationshipStatus(fromUserId: string, toUserId: string) {
    const userLists = await this.interactionListsModel
      .findOne({ userId: new Types.ObjectId(fromUserId) })
      .select(
        'acceptedRequests blocked shortlisted sentMatchRequests receivedMatchRequests',
      );

    if (!userLists) {
      return { status: 'none' };
    }

    const toUserObjectId = new Types.ObjectId(toUserId);

    if (userLists.blocked?.includes(toUserObjectId)) {
      return { status: 'blocked_by_you' };
    }

    // Check if blocked by other user
    const blockedByOther = await this.interactionModel.findOne({
      fromUserId: toUserObjectId,
      toUserId: new Types.ObjectId(fromUserId),
      interactionType: InteractionType.BLOCKED,
      status: InteractionStatus.ACTIVE,
    });

    if (blockedByOther) {
      return { status: 'blocked_by_them' };
    }

    if (userLists.acceptedRequests?.includes(toUserObjectId)) {
      return { status: 'acceptedRequests' };
    }

    if (userLists.sentMatchRequests?.includes(toUserObjectId)) {
      return { status: 'match_request_sent' };
    }

    if (userLists.receivedMatchRequests?.includes(toUserObjectId)) {
      return { status: 'match_request_received' };
    }

    if (userLists.shortlisted?.includes(toUserObjectId)) {
      return { status: 'shortlisted' };
    }

    return { status: 'none' };
  }

  async getUserInteractionSummary(userId: string) {
    const userLists = await this.interactionListsModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!userLists) {
      return {
        newRequests: 0,
        acceptedRequests: 0,
        shortlisted: 0,
        sentRequests: 0,
      };
    }

    return {
      newRequests: userLists.receivedMatchRequests.length || 0,
      acceptedRequests: userLists.acceptedRequests.length || 0,
      shortlisted: userLists.shortlisted.length || 0,
      sentRequests: userLists.sentMatchRequests.length || 0,
    };
  }

  // ANALYTICS METHODS
  async getInteractionHistory(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const interactions = await this.interactionModel
      .find({
        $or: [
          { fromUserId: new Types.ObjectId(userId) },
          { toUserId: new Types.ObjectId(userId) },
        ],
      })
      .populate('fromUserId', 'username email firstName lastName')
      .populate('toUserId', 'username email firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.interactionModel.countDocuments({
      $or: [
        { fromUserId: new Types.ObjectId(userId) },
        { toUserId: new Types.ObjectId(userId) },
      ],
    });

    return {
      data: interactions,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  // async getInteractionStats(userId: string) {
  //   const pipeline = [
  //     {
  //       $match: {
  //         $or: [
  //           { fromUserId: new Types.ObjectId(userId) },
  //           { toUserId: new Types.ObjectId(userId) },
  //         ],
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$interactionType',
  //         count: { $sum: 1 },
  //         lastInteraction: { $max: '$createdAt' },
  //       },
  //     },
  //     {
  //       $sort: { count: -1 },
  //     },
  //   ];

  //   const stats = await this.interactionModel.aggregate(pipeline);
  //   return stats;
  // }
}
