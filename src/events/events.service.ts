import { BadRequestException, Injectable } from '@nestjs/common';
import { FindEventsDto } from './dto/find-events.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EventsService {
  constructor(private readonly aiService: AiService) {}

  async findEvents(findEventsDto: FindEventsDto) {
    const { description } = findEventsDto;

    const aiValidationResponse: boolean = await this.aiService.validatePrompt(
      `You are a content validation system for an event ticketing platform. Your task is to validate user search prompts strictly.

        CRITICAL RULES:
        1. You MUST respond with ONLY "true" or "false" - nothing else
        2. Return "false" if the prompt contains:
          - Offensive, racist, discriminatory, or unethical content
          - Hate speech or harmful language
          - Inappropriate or explicit content
          - Anything morally questionable
        3. Return "false" if the prompt is NOT related to event searches
        4. Return "true" ONLY if the prompt is appropriate AND related to events

        VALID EVENT TYPES: concerts, sports, theater, festivals, conferences, exhibitions, rodeos, cultural events, workshops, etc.

        EXAMPLE - VALID PROMPT: "Events in Uriangato Guanajuato next month" → true
        EXAMPLE - INVALID PROMPT: "How to make a bomb" → false
        EXAMPLE - INVALID PROMPT: "Best pizza recipe" → false
        EXAMPLE - INVALID PROMPT: "Racist events next week" → false

        NOW VALIDATE THIS USER PROMPT:
        "${description}"

        RESPOND WITH ONLY: true OR false`,
    );


    if (aiValidationResponse === true) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const events = await this.aiService.generateEvents(
        `You are an event search assistant with REAL-TIME WEB SEARCH capabilities.

          CRITICAL INSTRUCTIONS:
          1. USE YOUR WEB SEARCH to find REAL, CURRENT events (not fictional)
          2. Today's date is ${todayStr}
          3. Search for events matching the user's query timeframe
          4. Find events from actual sources: ticket sites, venue calendars, event platforms
          5. DO NOT return events with dates before ${todayStr}
          6. ALL dates MUST be >= ${todayStr}

          OUTPUT FORMAT (raw JSON array ONLY - NO markdown, NO code blocks, NO backticks):
          [
          {
            "title": "Exact event name from source",
            "description": "Brief description (30-60 chars max)",
            "place": "City, State, Country",
            "date": "YYYY-MM-DD",
            "time": "HH:MM",
            "cost": 50,
            "source": "ticketmaster.com",
              "imageUrl": "https://example.com/direct-image.jpg"
            }
          ]

          IMAGE URL REQUIREMENTS - USE PRE-DEFINED IMAGES ONLY:
          ⚠️ DO NOT search for event-specific images. Use ONLY the pre-defined image URLs below based on event category.

          CATEGORY-BASED IMAGE URLS:
          - Concerts/Music: https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop
          - Sports: https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop
          - Theater/Shows: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop
          - Festivals: https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop
          - Food/Gastronomy: https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop
          - Art/Exhibitions: https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&h=600&fit=crop
          - Conferences: https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop
          - Workshops/Classes: https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&h=600&fit=crop
          - General events: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop

          HOW TO SELECT THE CORRECT IMAGE:
          1. Analyze the event type from the title and description
          2. Choose the MOST RELEVANT category from the list above
          3. Use the corresponding fixed URL
          4. DO NOT modify or create new image URLs

          EVENT CATEGORY MAPPING:
          - Music, concert, band, DJ, symphony → Concerts/Music
          - Soccer, basketball, baseball, marathon, competition → Sports
          - Play, drama, ballet, opera, musical → Theater/Shows
          - Festival, fair, carnival, celebration → Festivals
          - Food tasting, cooking class, restaurant week → Food/Gastronomy
          - Art exhibition, museum, gallery, installation → Art/Exhibitions
          - Conference, seminar, business meeting → Conferences
          - Workshop, class, course, training → Workshops/Classes
          - Default for unspecified events → General events

          STRICT RULES:
          ✓ Return 3-10 real events found via web search, always trying to return the highest possible number within that range
          ✓ All dates >= ${todayStr}
          ✓ Valid JSON syntax (parseable by JSON.parse)
          ✓ Description: exactly 30-60 characters
          ✓ Cost: number for paid events, string "Free" for free events
          ✓ Include source URL or platform name
          ✓ imageUrl MUST be one of the pre-defined URLs above
          ✓ EVERY event MUST have a valid imageUrl from the pre-defined list
          ✗ NO past events
          ✗ NO fictional events
          ✗ NO markdown formatting
          ✗ NO additional text outside JSON
          ✗ NO searching for event-specific images
          ✗ NO creating new image URLs

          USER SEARCH QUERY: "${description}"

          JSON ARRAY ONLY:`,
      );

      return {
        success: true,
        count: events.length,
        events: events,
      };
    } else {
      throw new BadRequestException(
        'Invalid prompt: The provided text is either inappropriate or not related to event searches. Please provide a valid event-related query.',
      );
    }
  }
}
