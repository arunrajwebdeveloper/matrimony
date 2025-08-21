import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { ActivityVerb } from './enums/activity-verb.enum';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async logActivity(
    actorId: string,
    verb: ActivityVerb,
    targetId: string,
  ): Promise<void> {
    const createdActivity = new this.activityModel({
      actorId: new Types.ObjectId(actorId),
      verb,
      targetId: new Types.ObjectId(targetId),
    });
    await createdActivity.save();
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
