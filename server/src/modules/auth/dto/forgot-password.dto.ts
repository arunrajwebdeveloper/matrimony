import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'johndoe@mail.com',
    description: 'Registered user email address',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
