import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserInteractionDocument = UserInteraction & Document;

/**
 * A dedicated schema to store user interactions, keeping the main Profile schema clean.
 * This tracks which profiles a user has shortlisted, declined, or blocked.
 */
@Schema({ timestamps: true })
export class UserInteraction {
  // Reference to the user who performed the action
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  // Array of profiles the user has shortlisted
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Profile', default: [] })
  shortlisted: Types.ObjectId[];

  // Array of profiles the user has declined
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Profile', default: [] })
  declined: Types.ObjectId[];

  // Array of profiles the user has blocked
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Profile', default: [] })
  blocked: Types.ObjectId[];
}

export const UserInteractionSchema =
  SchemaFactory.createForClass(UserInteraction);
