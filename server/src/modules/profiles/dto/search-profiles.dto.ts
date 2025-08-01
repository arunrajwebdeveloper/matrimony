import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProfilesDto {
  @ApiPropertyOptional({ example: 'Female', enum: ['Male', 'Female'] })
  @IsOptional()
  @IsEnum(['Male', 'Female'])
  gender?: 'Male' | 'Female';

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

  @ApiPropertyOptional({ example: 'Hindu' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({ example: 'Reddy' })
  @IsOptional()
  @IsString()
  community?: string;

  @ApiPropertyOptional({ example: 'Never Married' })
  @IsOptional()
  @IsEnum(['Never Married', 'Divorced', 'Widowed', 'Annulled'])
  maritalStatus?: string;

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

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  minIncome?: number;

  @ApiPropertyOptional({ example: 1500000 })
  @IsOptional()
  @IsNumber()
  maxIncome?: number;

  @ApiPropertyOptional({ example: 'Vegetarian' })
  @IsOptional()
  @IsEnum(['Vegetarian', 'Non-Vegetarian', 'Eggetarian'])
  diet?: string;

  @ApiPropertyOptional({ example: 'No Disability' })
  @IsOptional()
  @IsEnum([
    'No Disability',
    'Physical Disability',
    'Visual Impairment',
    'Hearing Impairment',
    'Other',
  ])
  disabilityStatus?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by premium users',
  })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of results per page',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Field to sort by (e.g., createdAt, annualIncome)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order (asc or desc)',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
