import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
    required: true,
    validate: (v) => Array.isArray(v) && v.length === 2,
  })
  participants: Types.ObjectId[]; // Array of two user IDs

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Message' })
  lastMessage: Types.ObjectId; // Reference to the last message for quick display

  @Prop({ type: SchemaTypes.Map, of: Boolean, default: {} }) // Using SchemaTypes.Map for dynamic keys (user IDs)
  readStatus: Map<string, boolean>; // userId: true if read, false if unread

  @Prop({ default: null })
  deletedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Unique index for participants to prevent duplicate conversations between the same two users
// Ensure both combinations are handled for uniqueness (e.g., [A,B] and [B,A])
// This requires a custom validator or sorting participants before saving
ConversationSchema.index(
  { participants: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
