import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserInteractionLists extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // Quick access arrays for performance
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  shortlisted: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  blocked: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  sentMatchRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  receivedMatchRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  acceptedRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  declinedRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  ignored: Types.ObjectId[];

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
