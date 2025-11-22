import { IsString, Matches } from 'class-validator';

export class PaymentIntentParamDto {
  @IsString()
  @Matches(/^pi_[a-zA-Z0-9]+$/, {
    message: 'paymentIntentId must be a valid Stripe Payment Intent ID (starts with pi_)'
  })
  paymentIntentId: string;
}