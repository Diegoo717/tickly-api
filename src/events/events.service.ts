import { BadRequestException, Injectable } from '@nestjs/common';
import { FindEventsDto } from './dto/find-events.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EventsService {
  constructor(private readonly aiService: AiService) {}

  async findEvents(findEventsDto: FindEventsDto) {
    const { description } = findEventsDto;

    const validationPrompt = `You are a content validation system for an event ticketing platform. Your task is to validate user search prompts strictly.

        CRITICAL RULES:
        1. You MUST respond with ONLY "true" or "false" - nothing else
        2. Return "false" if the prompt contains:
           - Offensive, racist, discriminatory, or unethical content
           - Hate speech or harmful language
           - Inappropriate or explicit content
           - Anything morally questionable
        3. Return "false" if the prompt is NOT related to event searches
        4. Return "true" ONLY if the prompt is appropriate AND related to events

        VALID EVENT TYPES: concerts, sports, theater, festivals, conferences, exhibitions, rodeos, cultural events, workshops, music events, food events, etc.

        EXAMPLES:
        ✅ "Events in Moroleon GTO for December" → true
        ✅ "Music events in Mexico City" → true
        ✅ "Concerts in Guadalajara this month" → true
        ✅ "Music events in Seattle" → true
        ❌ "How to make a bomb" → false
        ❌ "Best pizza recipe" → false
        ❌ "Racist events next week" → false

        NOW VALIDATE THIS USER PROMPT:
        "${description}"

        RESPOND WITH ONLY: true OR false`;

    const isValid = await this.aiService.validatePrompt(validationPrompt);

    if (!isValid) {
      throw new BadRequestException(
        'Invalid prompt: The provided text is either inappropriate or not related to event searches. Please provide a valid event-related query.',
      );
    }

    const events = await this.aiService.generateEvents(description);

    return {
      success: true,
      count: events.length,
      events: events,
    };
  }
}
