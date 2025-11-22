import { IsString, IsNumber, IsPositive, IsUUID, IsUrl, IsBoolean, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  eventId: string;

  @IsString()
  eventTitle: string;

  @IsString()
  eventPlace: string;

  @IsString()
  eventDate: string;

  @IsString()
  eventTime: string;

  @IsNumber()
  @Min(0)
  eventCost: number;  

  @IsString()
  @IsUrl()
  eventImageUrl: string;

  @IsBoolean()
  vip: boolean;
}