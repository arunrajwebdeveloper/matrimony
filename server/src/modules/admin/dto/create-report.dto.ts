import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    example: '60c72b2f9c1b9c001c8e4d2a',
    description: 'ID of the user being reported',
  })
  @IsString()
  @IsNotEmpty()
  reportedUserId: string;

  @ApiProperty({
    example: 'Inappropriate content',
    description: 'Reason for the report',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    example: 'The user posted offensive images in their profile.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
