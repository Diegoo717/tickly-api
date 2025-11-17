import { IsString, IsNumber, IsPositive, IsUUID } from 'class-validator';


export class CreatePaymentIntentDto {
  @IsString()
  userId: string;

  @IsUUID()
  eventId: string;

  @IsString()
  eventTitle: string;

  @IsNumber()
  @IsPositive()
  amount: number; 

  @IsNumber()
  @IsPositive()
  quantity: number;
}