import { Injectable } from '@nestjs/common';
import { FindEventsDto } from './dto/find-events.dto';

@Injectable()
export class EventsService {
  findEvents(findEventsDto: FindEventsDto) {
    return 'This action returns events';
  }
}
