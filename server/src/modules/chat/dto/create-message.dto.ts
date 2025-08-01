import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Hello there!',
    description: 'Content of the message',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'text',
    enum: ['text', 'image', 'video', 'audio', 'system'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['text', 'image', 'video', 'audio', 'system'])
  type?: string;
}
