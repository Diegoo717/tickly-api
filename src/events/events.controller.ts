import { Controller, Get, Post, Body} from '@nestjs/common';
import { EventsService } from './events.service';
import { FindEventsDto } from './dto/find-events.dto';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Post()
  findEvents(@Body() findEventsDto: FindEventsDto) {
    return this.eventsService.findEvents(findEventsDto);
  }

}
