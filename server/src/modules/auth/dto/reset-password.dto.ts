import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'Password@1234!',
    description: 'New password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Token that provided for reset password',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
