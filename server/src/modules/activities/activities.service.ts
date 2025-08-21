import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { ActivityVerb } from './enums/activity-verb.enum';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async logActivity(
    actorId: string,
    verb: ActivityVerb,
    targetId: string,
  ): Promise<void> {
    try {
      // For 'viewed_profile' activities, check for a recent duplicate.
      if (verb === ActivityVerb.VIEWED_PROFILE) {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find a recent log with the same actor, target, and verb.
        const existingLog = await this.activityModel
          .findOne({
            actorId: new Types.ObjectId(actorId),
            targetId: new Types.ObjectId(targetId),
            verb: ActivityVerb.VIEWED_PROFILE,
            createdAt: { $gte: twentyFourHoursAgo },
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

  async getRecentActivitiesForUser(userId: string): Promise<any[]> {
    return this.activityModel
      .find({ targetId: new Types.ObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('actorId', 'firstName lastName profilePicture') // Populates the 'actor' field with name and photo
      .exec();
  }

  async getActivitiesForUser(userId: string): Promise<any[]> {
    return (
      this.activityModel
        .find({ targetId: new Types.ObjectId(userId) })
        .sort({ timestamp: -1 })
        // .limit(10)
        .populate('actorId', 'firstName lastName profilePicture') // Populates the 'actor' field with name and photo
        .exec()
    );
  }
}
