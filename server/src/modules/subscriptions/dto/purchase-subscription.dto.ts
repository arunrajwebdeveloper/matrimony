import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseSubscriptionDto {
  @ApiProperty({
    example: '60c72b2f9c1b9c001c8e4d2a',
    description: 'ID of the subscription plan to purchase',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    example: 'txn_123abc456def',
    description: 'Transaction ID from the payment gateway',
  })
  @IsString()
  @IsNotEmpty()
  paymentTransactionId: string;

  @ApiProperty({
    example: false,
    description: 'Whether the subscription should auto-renew',
  })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
