import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class PartnerPreferencesDto {
  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(18)
  minAge?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Max(99)
  maxAge?: number;

  @ApiPropertyOptional({ example: ['Hindu', 'Christian'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  religion?: string[];

  @ApiPropertyOptional({ example: ['Reddy', 'Nair'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  community?: string[];

  @ApiPropertyOptional({ example: ['English', 'Malayalam'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  motherTongue?: string[];

  @ApiPropertyOptional({ example: ['India', 'USA'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  country?: string[];

  @ApiPropertyOptional({ example: ['Bachelors', 'Masters'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  educationLevel?: string[];

  @ApiPropertyOptional({ example: ['Software Engineer', 'Doctor'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  occupation?: string[];

  @ApiPropertyOptional({ example: { min: 500000, max: 1000000 } })
  @IsOptional()
  @IsObject()
  annualIncome?: { min?: number; max?: number };

  @ApiPropertyOptional({ example: ['Vegetarian'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diet?: string[];

  @ApiPropertyOptional({ example: ['No'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  smokingHabit?: string[];

  @ApiPropertyOptional({ example: ['No'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  drinkingHabit?: string[];

  @ApiPropertyOptional({ example: ['Never Married'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  maritalStatus?: string[];

  @ApiPropertyOptional({ example: ['Average'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bodyType?: string[];

  @ApiPropertyOptional({ example: ['Fair'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complexion?: string[];

  @ApiPropertyOptional({ example: ['No Disability'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disabilityStatus?: string[];

  @ApiPropertyOptional({ example: ['Nuclear'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  familyType?: string[];

  @ApiPropertyOptional({ example: ['Middle Class'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  familyStatus?: string[];

  @ApiPropertyOptional({ example: ['Moderate'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  familyValues?: string[];
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'I am a software engineer...',
    description: 'About me description',
  })
  @IsOptional()
  @IsString()
  aboutMe?: string;

  @ApiPropertyOptional({ example: 'Hindu' })
  @IsOptional()
  @IsEnum([
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Jain',
    'Buddhist',
    'Other',
    'Not Specified',
  ])
  religion?: string;

  @ApiPropertyOptional({ example: 'Nair' })
  @IsOptional()
  @IsString()
  community?: string;

  @ApiPropertyOptional({ example: 175, description: 'Height in cm' })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  height?: number;

  @ApiPropertyOptional({ example: 70, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(200)
  weight?: number;

  @ApiPropertyOptional({ example: 'Fair' })
  @IsOptional()
  @IsEnum(['Fair', 'Wheatish', 'Dark', 'Olive', 'Not Specified'])
  complexion?: string;

  @ApiPropertyOptional({ example: 'Average' })
  @IsOptional()
  @IsEnum(['Slim', 'Athletic', 'Average', 'Heavy', 'Not Specified'])
  bodyType?: string;

  @ApiPropertyOptional({ example: 'No Disability' })
  @IsOptional()
  @IsEnum([
    'No Disability',
    'Physical Disability',
    'Visual Impairment',
    'Hearing Impairment',
    'Other',
    'Not Specified',
  ])
  disabilityStatus?: string;

  @ApiPropertyOptional({ example: 'Malayalam' })
  @IsOptional()
  @IsString()
  motherTongue?: string;

  @ApiPropertyOptional({ example: 'Never Married' })
  @IsOptional()
  @IsEnum(['Never Married', 'Divorced', 'Widowed', 'Annulled', 'Not Specified'])
  maritalStatus?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of children (if divorced/widowed)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  children?: number;

  @ApiPropertyOptional({ example: 'Bachelors' })
  @IsOptional()
  @IsString()
  educationLevel?: string;

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsOptional()
  @IsString()
  educationField?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 1200000, description: 'Annual income' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  annualIncome?: number;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Kerala' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Kochi' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '682001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'Citizen' })
  @IsOptional()
  @IsString()
  residencyStatus?: string;

  @ApiPropertyOptional({ example: 'Nuclear' })
  @IsOptional()
  @IsEnum(['Nuclear', 'Joint', 'Other', 'Not Specified'])
  familyType?: string;

  @ApiPropertyOptional({ example: 'Middle Class' })
  @IsOptional()
  @IsEnum([
    'Rich',
    'Upper Middle Class',
    'Middle Class',
    'Lower Middle Class',
    'Not Specified',
  ])
  familyStatus?: string;

  @ApiPropertyOptional({ example: 'Engineer' })
  @IsOptional()
  @IsString()
  fatherOccupation?: string;

  @ApiPropertyOptional({ example: 'Homemaker' })
  @IsOptional()
  @IsString()
  motherOccupation?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  brothers?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sisters?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  brothersMarried?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sistersMarried?: number;

  @ApiPropertyOptional({ example: 'Moderate' })
  @IsOptional()
  @IsString()
  familyValues?: string;

  @ApiPropertyOptional({ example: 'Vegetarian' })
  @IsOptional()
  @IsEnum(['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Not Specified'])
  diet?: string;

  @ApiPropertyOptional({ example: 'No' })
  @IsOptional()
  @IsEnum(['No', 'Occasional', 'Regular', 'Not Specified'])
  smokingHabit?: string;

  @ApiPropertyOptional({ example: 'No' })
  @IsOptional()
  @IsEnum(['No', 'Occasional', 'Regular', 'Not Specified'])
  drinkingHabit?: string;

  @ApiPropertyOptional({ example: ['traveling', 'reading'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbies?: string[];

  @ApiPropertyOptional({ example: ['movies', 'music'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ type: PartnerPreferencesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PartnerPreferencesDto)
  partnerPreferences?: PartnerPreferencesDto;

  @ApiPropertyOptional({ example: ['url_to_photo1.jpg', 'url_to_photo2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  profilePhotos?: string[];

  @ApiPropertyOptional({ example: 'url_to_main_profile_picture.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({
    example: 'public',
    enum: ['public', 'private', 'hidden'],
  })
  @IsOptional()
  @IsEnum(['public', 'private', 'hidden'])
  visibility?: string;

  @ApiPropertyOptional({ example: 'Karthika' })
  @IsOptional()
  @IsString()
  star?: string;

  @ApiPropertyOptional({ example: 'Vrishabha' })
  @IsOptional()
  @IsString()
  rasi?: string;

  @ApiPropertyOptional({ example: 'Bharani' })
  @IsOptional()
  @IsString()
  nakshatra?: string;

  @ApiPropertyOptional({ example: '10:30 AM' })
  @IsOptional()
  @IsString()
  birthTime?: string;

  @ApiPropertyOptional({ example: 'Kochi, Kerala, India' })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({ example: 'url_to_horoscope.pdf' })
  @IsOptional()
  @IsString()
  horoscopeDocument?: string;
}
