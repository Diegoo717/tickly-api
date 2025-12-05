import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { FindEventsDto } from './dto/find-events.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindEventsResponseDto } from './dto/find-events-response.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Find events based on user description',
    description:
      'Uses AI to search and return relevant events matching the user query',
  })
  @ApiResponse({
    status: 201,
    description: 'Events successfully obtained',
    type: FindEventsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query or no events found',
  })
  findEvents(@Body() findEventsDto: FindEventsDto) {
    return this.eventsService.findEvents(findEventsDto);
  }
}
