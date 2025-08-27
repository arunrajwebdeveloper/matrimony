import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { ActivityVerb } from './enums/activity-verb.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  // Define a list of verbs for which only one log should be created per period.
  // Add any other verbs you want to have unique logging here.
  private readonly UNIQUE_VERBS = [
    ActivityVerb.VIEWED_PROFILE,
    ActivityVerb.SHORTLISTED_PROFILE,
    // Add more here, e.g., 'sent_photo_request'
  ];

  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    private usersService: UsersService,
  ) {}

  async logActivity(
    actorId: string,
    verb: ActivityVerb,
    targetId: string,
  ): Promise<void> {
    try {
      // For 'viewed_profile' activities, check for a recent duplicate.
      if (this.UNIQUE_VERBS.includes(verb)) {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find a recent log with the same actor, target, and verb.
        const existingLog = await this.activityModel
          .findOne({
            actorId: new Types.ObjectId(actorId),
            targetId: new Types.ObjectId(targetId),
            verb: ActivityVerb.VIEWED_PROFILE,
            timestamp: { $gte: twentyFourHoursAgo },
          })
          .exec();

        // If a recent log is found, do not create a new one.
        if (existingLog) {
          this.logger.log(
            `Skipped duplicate 'viewed_profile' log for user ${actorId} on profile ${targetId}`,
          );
          return;
        }
      }

      // If it's a new or non-profile-view activity, create the log entry.
      // We assume your schema includes the timestamps option to get 'createdAt'.
      const createdActivity = new this.activityModel({
        actorId: new Types.ObjectId(actorId),
        verb,
        targetId: new Types.ObjectId(targetId),
      });
      await createdActivity.save();
      this.logger.log(
        `Logged new activity: ${verb} by ${actorId} on ${targetId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to log activity: ${error.message}`);
      // Depending on your error handling strategy, you might re-throw the error
      // or handle it gracefully to avoid breaking the request.
    }
  }

  /**
   * Retrieves a list of recent activities for a specific user, filtering out
   * activities related to users on their blocked list.
   *
   * @param userId The ID of the user to get activities for.
   * @returns An array of populated activity documents.
   */
  async getRecentActivitiesForUser(
    userId: string,
  ): Promise<ActivityDocument[]> {
    // 1. Get the list of IDs for users that the current user has blocked.
    // We assume the UsersService has a method to get this list.
    const blockedUserIds = await this.usersService.getBlockedUserIds(userId);
    const blockedObjectIds = blockedUserIds.map((id) => new Types.ObjectId(id));

    // 2. Build the query to find activities where:
    //    a) The target of the activity is the current user.
    //    b) The actor of the activity is NOT in the blocked list.
    const activities = await this.activityModel
      .find({
        targetId: new Types.ObjectId(userId),
        actorId: { $nin: blockedObjectIds },
      })
      .sort({ timestamp: -1 }) // Sort by the auto-generated timestamp
      .limit(10)
      // .populate('actorId', 'firstName lastName profileId')
      .populate({
        path: 'actorId',
        select: 'firstName lastName profileId profile',
        populate: {
          path: 'profile',
          select: 'profilePicture -_id',
        },
      })
      .exec();

    return activities;
  }

  async getActivitiesForUser(userId: string): Promise<any[]> {
    return (
      this.activityModel
        .find({ targetId: new Types.ObjectId(userId) })
        .sort({ timestamp: -1 })
        // .limit(10)
        .populate({
          path: 'actorId',
          select: 'firstName lastName profileId profile',
          populate: {
            path: 'profile',
            select: 'profilePicture -_id',
          },
        })
        .exec()
    );
  }
}
