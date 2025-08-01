import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    example: 'Male',
    enum: ['Male', 'Female'],
    description: 'Gender of the user',
  })
  @IsEnum(['Male', 'Female'])
  @IsNotEmpty()
  gender: 'Male' | 'Female';

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
}
