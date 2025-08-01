import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true, unique: true })
  name: string; // e.g., "Basic", "Premium", "Platinum"

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number; // In currency units

  @Prop({ required: true })
  durationInDays: number;

  @Prop({ type: [String], default: [] })
  features: string[]; // List of features included

  @Prop({ default: true })
  isActive: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
