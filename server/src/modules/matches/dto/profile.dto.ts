import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the Profile response.
 * This ensures a consistent structure for data returned by the API.
 */
export class ProfileDto {
  @ApiProperty({ description: 'The unique ID of the profile' })
  _id: string;

  @ApiProperty({ description: 'The user ID associated with the profile' })
  user: string;

  @ApiProperty({ description: 'The first name of the person' })
  firstName: string;

  @ApiProperty({ description: 'The gender of the person' })
  gender: string;

  @ApiProperty({ description: 'The date of birth' })
  dateOfBirth: Date;

  @ApiProperty({ description: 'The religion of the person' })
  religion: string;

  @ApiProperty({ description: 'The city of residence' })
  city: string;

  @ApiProperty({ description: 'The country of residence' })
  country: string;

  @ApiProperty({ description: 'The highest education level' })
  educationLevel: string;

  @ApiProperty({ description: 'The profession or occupation' })
  occupation: string;

  @ApiProperty({ description: 'An array of profile photo URLs' })
  profilePhotos: string[];
}
