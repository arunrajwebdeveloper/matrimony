import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondMatchRequestDto {
  @ApiProperty({
    example: 'accepted',
    enum: ['accepted', 'rejected'],
    description: 'Action on the match request',
  })
  @IsEnum(['accepted', 'rejected'])
  @IsNotEmpty()
  action: 'accepted' | 'rejected';
}
