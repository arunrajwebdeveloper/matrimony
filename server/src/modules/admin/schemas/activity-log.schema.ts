import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: Types.ObjectId; // User who performed the action (can be null for system actions)

  @Prop({ required: true })
  action: string; // e.g., 'USER_LOGIN', 'PROFILE_UPDATE', 'MESSAGE_SENT', 'ADMIN_SUSPEND_USER'

  @Prop({ type: Object })
  details: Record<string, any>; // JSON object for action-specific details

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string; // Browser/device info
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
