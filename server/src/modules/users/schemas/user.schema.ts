import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Profile } from '../../../modules/profiles/schemas/profile.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // createdAt, updatedAt
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false }) // Password should not be returned by default
  passwordHash: string;

  @Prop({ unique: true, sparse: true }) // Optional, for direct user links
  username?: string;

  @Prop({ default: 'pending' }) // 'pending', 'active', 'suspended', 'deactivated'
  status: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLogin: Date;

  @Prop({ type: Date, default: null }) // For soft delete
  deletedAt: Date | null;

  // Basic profile information embedded for quick access
  @Prop({ required: true })
  gender: 'Male' | 'Female';

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' })
  profile: Types.ObjectId | Profile;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: 'user' | 'admin'; // Add this line for role-based access control
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure passwordHash is excluded from default queries
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

// Index for frequently queried fields
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ gender: 1, dateOfBirth: 1 }); // For basic search filters
