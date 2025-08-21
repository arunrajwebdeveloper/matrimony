import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type MatchRequestDocument = HydratedDocument<MatchRequest>;

@Schema({ timestamps: true })
export class MatchRequest {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId; // User who sent the request

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId; // User who received the request

  @Prop({
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  })
  status: string;

  @Prop()
  message: string; // Optional message from sender

  @Prop()
  respondedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const MatchRequestSchema = SchemaFactory.createForClass(MatchRequest);

// Ensure a user can only send one pending request to another user
MatchRequestSchema.index(
  { sender: 1, recipient: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending', deletedAt: null },
  },
);
// Index for finding requests sent to a user
MatchRequestSchema.index({ recipient: 1, status: 1 });
