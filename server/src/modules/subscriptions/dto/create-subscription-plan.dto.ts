import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    example: 'Premium Plan',
    description: 'Name of the subscription plan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Access to all premium features.',
    description: 'Description of the plan',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 99.99, description: 'Price of the plan' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 30, description: 'Duration of the plan in days' })
  @IsNumber()
  @Min(1)
  durationInDays: number;

  @ApiProperty({
    example: ['Unlimited Messages', 'Advanced Search Filters'],
    description: 'List of features included',
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ example: true, description: 'Is the plan active?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
