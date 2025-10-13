import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InteractionType } from '../enums/interaction-type.enum';
import { InteractionStatus } from '../enums/interaction-status.enum';

@Schema({ timestamps: true })
export class UserInteractions extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  fromUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  toUserId: Types.ObjectId;

  @Prop({
    enum: InteractionType,
    required: true,
  })
  interactionType: InteractionType;

  @Prop({
    enum: InteractionStatus,
    default: InteractionStatus.ACTIVE,
  })
  status: InteractionStatus;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserInteractionsSchema =
  SchemaFactory.createForClass(UserInteractions);

// Create compound indexes for performance
UserInteractionsSchema.index({ fromUserId: 1, interactionType: 1, status: 1 });
UserInteractionsSchema.index({ toUserId: 1, interactionType: 1, status: 1 });
UserInteractionsSchema.index(
  { fromUserId: 1, toUserId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: InteractionStatus.ACTIVE,
      deletedAt: null,
    },
  },
);
UserInteractionsSchema.index({ createdAt: -1 });
