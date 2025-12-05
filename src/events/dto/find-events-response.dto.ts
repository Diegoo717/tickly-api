import { ApiProperty } from '@nestjs/swagger';
import { EventResponseDto } from './event-response.dto';

export class FindEventsResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Number of events found',
    example: 8,
  })
  count: number;

  @ApiProperty({
    description: 'Array of events',
    type: [EventResponseDto],
  })
  events: EventResponseDto[];
}