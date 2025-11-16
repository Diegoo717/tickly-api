import { Injectable } from '@nestjs/common';
import { FindEventsDto } from './dto/find-events.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EventsService {

  constructor(
    private readonly aiService: AiService
  ){}

  findEvents(findEventsDto: FindEventsDto) {

    const { description } = findEventsDto;

    const aiResponse = this.aiService.generateEvents(description);

    return aiResponse;
  }
}
