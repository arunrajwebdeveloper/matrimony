import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type UserSubscriptionDocument = HydratedDocument<UserSubscription>;

@Schema({ timestamps: true })
export class UserSubscription {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'SubscriptionPlan', required: true })
  plan: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 'active', enum: ['active', 'expired', 'cancelled'] }) // 'active', 'expired', 'cancelled'
  status: string;

  @Prop()
  paymentTransactionId: string; // Reference to a payment gateway transaction ID

  @Prop({ default: false })
  autoRenew: boolean;

  @Prop({ default: null })
  cancelledAt: Date;
}

export const UserSubscriptionSchema =
  SchemaFactory.createForClass(UserSubscription);

// Index to quickly find a user's active subscription
UserSubscriptionSchema.index({ user: 1, status: 1 });
