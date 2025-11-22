import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FindByTicketsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  eventTitle: string;
}
