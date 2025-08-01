import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  reporter: Types.ObjectId; // User who reported

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  reportedUser: Types.ObjectId; // User being reported

  @Prop({ required: true })
  reason: string;

  @Prop()
  description: string;

  @Prop({
    enum: ['pending', 'reviewed', 'action_taken', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId; // Admin who reviewed

  @Prop()
  reviewedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

ReportSchema.index({ reportedUser: 1, status: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ reporter: 1, reportedUser: 1, status: 1 }); // To prevent duplicate pending reports
