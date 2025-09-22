import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { InteractionType } from '../schemas/user-interactions.schema';

export class CreateInteractionDto {
  @IsString()
  toUserId: string;

  @IsEnum(['shortlisted', 'blocked', 'match_request_sent', 'view'])
  interactionType: InteractionType;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateInteractionDto {
  @IsEnum(['accepted', 'declined'])
  action: 'accepted' | 'declined';
}

export class GetInteractionsQueryDto {
  @IsOptional()
  @IsString()
  page?: string = '1';

  @IsOptional()
  @IsString()
  limit?: string = '20';

  @IsOptional()
  @IsEnum(['shortlisted', 'blocked', 'match_request_sent', 'view'])
  type?: InteractionType;
}
