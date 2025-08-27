import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ActivityVerb } from '../enums/activity-verb.enum';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorId: Types.ObjectId; // The user who performed the action

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  targetId: Types.ObjectId; // The user who is the target of the action

  @Prop({ required: true, enum: ActivityVerb }) // Use the enum here
  verb: ActivityVerb;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
