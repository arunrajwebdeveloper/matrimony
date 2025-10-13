import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { InteractionType } from '../enums/interaction-type.enum';

export class CreateInteractionDto {
  @IsString()
  toUserId: string;

  @IsEnum(InteractionType)
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
  @IsEnum(InteractionType)
  type?: InteractionType;
}
