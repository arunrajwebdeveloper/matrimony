import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { SchemaTypes } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true, unique: true })
  token: string;

  // The refresh token is linked to a user via their ObjectId.
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  // This property stores when the token will expire.
  @Prop({ required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
