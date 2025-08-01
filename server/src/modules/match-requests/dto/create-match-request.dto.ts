import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchRequestDto {
  @ApiProperty({
    example: '60c72b2f9c1b9c001c8e4d2a',
    description: 'ID of the recipient user',
  })
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({
    example: 'I found your profile very interesting!',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
