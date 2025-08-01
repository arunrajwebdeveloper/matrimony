import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Current password of the user',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string; // You'd validate this in the service against the stored hash

  @ApiProperty({
    example: 'NewSecurePassword456!',
    description: 'New password for the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;
}
