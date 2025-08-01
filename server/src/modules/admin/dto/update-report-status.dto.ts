import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportStatusDto {
  @ApiProperty({
    example: 'action_taken',
    enum: ['pending', 'reviewed', 'action_taken', 'rejected'],
    description: 'New status of the report',
  })
  @IsEnum(['pending', 'reviewed', 'action_taken', 'rejected'])
  @IsNotEmpty()
  status: 'pending' | 'reviewed' | 'action_taken' | 'rejected';
}
