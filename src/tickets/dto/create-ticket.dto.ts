import { IsBoolean, IsNumber, IsString, IsUrl, IsUUID, Min } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  userId: string;

  @IsUUID()
  eventId: string;

  @IsString()
  eventTitle: string;

  @IsString()
  eventSeat: string;

  @IsString()
  eventOrder: string;

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
