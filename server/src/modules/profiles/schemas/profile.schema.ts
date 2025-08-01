import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user?: Types.ObjectId; // Reference back to the User

  // --- Personal Details ---
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop()
  lastName: string;

  @Prop()
  middleName?: string;

  @Prop({
    enum: [
      'Hindu',
      'Muslim',
      'Christian',
      'Sikh',
      'Jain',
      'Buddhist',
      'Other',
      'Not Specified',
    ],
    default: 'Not Specified',
  })
  religion: string;

  @Prop()
  community: string; // E.g., Brahmin, Reddy, Nair, etc.

  @Prop()
  subCommunity?: string;

  @Prop()
  gotra?: string; // For Hindu communities

  @Prop()
  motherTongue: string;

  @Prop()
  height: number; // In cm

  @Prop()
  weight: number; // In kg

  @Prop({
    enum: ['Fair', 'Wheatish', 'Dark', 'Olive', 'Not Specified'],
    default: 'Not Specified',
  })
  complexion: string;

  @Prop({
    enum: ['Slim', 'Athletic', 'Average', 'Heavy', 'Not Specified'],
    default: 'Not Specified',
  })
  bodyType: string;

  @Prop({
    enum: [
      'No Disability',
      'Physical Disability',
      'Visual Impairment',
      'Hearing Impairment',
      'Other',
      'Not Specified',
    ],
    default: 'No Disability',
  })
  disabilityStatus: string;

  @Prop()
  aboutMe: string; // Free text description

  // --- Contact Details ---
  @Prop()
  phoneNumber: string;

  @Prop()
  whatsappNumber?: string;

  @Prop({ type: [String], default: [] })
  alternateEmails: string[];

  // --- Location Details ---
  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  zipCode?: string;

  @Prop()
  residencyStatus: string; // E.g., Citizen, Permanent Resident, Work Permit

  // --- Family Details ---
  @Prop({
    enum: ['Nuclear', 'Joint', 'Other', 'Not Specified'],
    default: 'Not Specified',
  })
  familyType: string;

  @Prop({
    enum: [
      'Rich',
      'Upper Middle Class',
      'Middle Class',
      'Lower Middle Class',
      'Not Specified',
    ],
    default: 'Not Specified',
  })
  familyStatus: string;

  @Prop()
  fatherOccupation: string;

  @Prop()
  motherOccupation: string;

  @Prop({ default: 0 })
  brothers: number;

  @Prop({ default: 0 })
  sisters: number;

  @Prop({ default: 0 })
  brothersMarried: number;

  @Prop({ default: 0 })
  sistersMarried: number;

  @Prop()
  familyValues: string; // E.g., Traditional, Moderate, Liberal

  // --- Education & Career ---
  @Prop()
  educationLevel: string; // E.g., Bachelors, Masters, PhD, High School

  @Prop()
  educationField: string;

  @Prop()
  college?: string;

  @Prop()
  occupation: string;

  @Prop({ default: 0 })
  annualIncome: number; // In lakhs/millions, consider currency

  @Prop()
  companyName?: string;

  // --- Lifestyle & Habits ---
  @Prop({
    enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Not Specified'],
    default: 'Not Specified',
  })
  diet: string;

  @Prop({
    enum: ['No', 'Occasional', 'Regular', 'Not Specified'],
    default: 'No',
  })
  smokingHabit: string;

  @Prop({
    enum: ['No', 'Occasional', 'Regular', 'Not Specified'],
    default: 'No',
  })
  drinkingHabit: string;

  @Prop({ type: [String], default: [] })
  hobbies: string[];

  @Prop({ type: [String], default: [] })
  interests: string[];

  // --- Partner Preferences (for matching algorithm) ---
  @Prop({ type: Object, default: {} })
  partnerPreferences: {
    minAge?: number;
    maxAge?: number;
    minHeight?: number;
    maxHeight?: number;
    religion?: string[];
    community?: string[];
    motherTongue?: string[];
    country?: string[];
    state?: string[];
    city?: string[];
    educationLevel?: string[];
    occupation?: string[];
    annualIncome?: { min?: number; max?: number };
    diet?: string[];
    smokingHabit?: string[];
    drinkingHabit?: string[];
    maritalStatus?: string[];
    bodyType?: string[];
    complexion?: string[];
    disabilityStatus?: string[];
    familyType?: string[];
    familyStatus?: string[];
    familyValues?: string[];
    // Add more as needed
  };

  // --- Marital Status ---
  @Prop({
    enum: ['Never Married', 'Divorced', 'Widowed', 'Annulled', 'Not Specified'],
    default: 'Not Specified',
  })
  maritalStatus: string;

  @Prop({ default: 0 })
  children?: number;

  // --- Photos/Media ---
  @Prop({ type: [String], default: [] }) // URLs to images stored in a cloud storage (S3, GCS)
  profilePhotos: string[];

  @Prop()
  profilePicture: string; // Main profile picture URL

  @Prop({ default: 'public' }) // 'public', 'private', 'hidden' - controls visibility
  visibility: string;

  @Prop({ default: false })
  isPremium: boolean; // Indicates if user has a premium subscription

  // --- Verification Status ---
  @Prop({
    type: Object,
    default: {
      phone: false,
      email: false,
      id: false,
      profileReview: 'pending',
    },
  })
  verification: {
    phone: boolean;
    email: boolean;
    id: boolean; // e.g., Aadhar, Passport verification
    profileReview: 'pending' | 'approved' | 'rejected'; // Admin review
  };

  // --- Horoscopic Details (if applicable) ---
  @Prop()
  star?: string;
  @Prop()
  rasi?: string;
  @Prop()
  nakshatra?: string;
  @Prop()
  birthTime?: string;
  @Prop()
  birthPlace?: string;
  @Prop({ type: String }) // URL to horoscope image/PDF
  horoscopeDocument?: string;

  @Prop({ type: Date, default: null }) // For soft delete
  deletedAt: Date | null;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

// Indexes for common search/filter operations
ProfileSchema.index({ religion: 1, community: 1 });
ProfileSchema.index({ country: 1, state: 1, city: 1 });
ProfileSchema.index({ educationLevel: 1, occupation: 1 });
ProfileSchema.index({ annualIncome: 1 });
ProfileSchema.index({
  'partnerPreferences.minAge': 1,
  'partnerPreferences.maxAge': 1,
}); // For reverse matching
ProfileSchema.index({ maritalStatus: 1 });
ProfileSchema.index({ 'verification.profileReview': 1 });
ProfileSchema.index({ gender: 1, dateOfBirth: 1 }); // For age-based search
