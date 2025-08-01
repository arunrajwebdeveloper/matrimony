import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Conversation', required: true })
  conversation: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string; // The message text

  @Prop({
    default: 'text',
    enum: ['text', 'image', 'video', 'audio', 'system'],
  }) // 'text', 'image', 'video', 'audio', 'system'
  type: string;

  @Prop({ default: false })
  isRead: boolean; // Indicates if the message has been read by the recipient

  @Prop({ default: null })
  deletedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Index for efficient message retrieval within a conversation
MessageSchema.index({ conversation: 1, createdAt: 1 });
