import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserInteractionLists extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // Quick access arrays for performance
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }], default: [] })
  shortlisted: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }], default: [] })
  blocked: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }], default: [] })
  sentMatchRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }], default: [] })
  receivedMatchRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }], default: [] })
  acceptedRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }], default: [] })
  declinedRequests: Types.ObjectId[];

  // Counters for analytics
  @Prop({ default: 0 })
  totalProfileViews: number;

  @Prop({ default: 0 })
  totalProfileViewsGiven: number;
}

export const UserInteractionListsSchema =
  SchemaFactory.createForClass(UserInteractionLists);

// Create index
UserInteractionListsSchema.index({ userId: 1 });
