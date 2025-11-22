import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentIntentDto } from './create-payment-intent.dto';

export class CreatePaymentRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentIntentDto)
  items: CreatePaymentIntentDto[];

  @IsNumber()
  @IsPositive()
  amount: number;
}