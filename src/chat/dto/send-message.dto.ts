import { IsString, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  eventId: string;

  @MaxLength(500)
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  senderName: string;
}
