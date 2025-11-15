import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class FindEventsDto {
  @IsString()
  @MinLength(15)
  @MaxLength(300)
  @Matches(/^[a-zA-Z0-9\s,.\u00C0-\u00FF¿?¡!]*$/, {
    message:
      'The description can only contain letters, numbers, spaces, commas, periods, and exclamation or question marks.',
  })
  description: string;
}
