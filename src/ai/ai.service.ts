import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Perplexity from '@perplexity-ai/perplexity_ai';
import { v5 as uuidv5 } from 'uuid';
import { Event } from 'src/events/interfaces/event.interface';

@Injectable()
export class AiService {
  private client: Perplexity;
  private readonly UUID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('perplexity.apiKey');
    this.client = new Perplexity({ apiKey });
  }

  private generateDeterministicId(event: any): string {
    const { title, place, date } = event;
    const normalizedString = `${title}|${place}|${date}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');

    return uuidv5(normalizedString, this.UUID_NAMESPACE);
  }

  async validatePrompt(prompt: string): Promise<boolean> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a validation system. Respond with ONLY one word: "true" or "false". 
              Do not include:
              - Explanations
              - Punctuation
              - Additional text
              - Markdown
          
              Just the single word: true OR false`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 5,
      });

      let aiResponse = completion.choices[0]?.message?.content
        ?.toString()
        .trim()
        .toLowerCase();

      if (!aiResponse) {
        throw new BadRequestException('AI validation failed');
      }

      aiResponse = aiResponse.replace(/[^\w]/g, '').replace(/\n/g, '').trim();

      if (aiResponse === 'true') {
        return true;
      } else if (aiResponse === 'false') {
        return false;
      }

      console.warn('Unexpected validation response:', aiResponse);
      return false;
    } catch (error) {
      console.error('Perplexity validation error:', error.message);
      throw new BadRequestException(
        'Failed to validate prompt with AI, something went wrong, please try again',
      );
    }
  }

  async generateEvents(prompt: string): Promise<Event[]> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content:
              'You are an event search assistant with web search capabilities.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      });

      const aiResponse = completion.choices[0]?.message?.content.toString();

      if (!aiResponse) {
        throw new BadRequestException(
          'AI did not return a valid response, try again',
        );
      }

      const cleanContent = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/\n?```/g, '')
        .trim();

      try {
        const parsedEvents = JSON.parse(cleanContent);

        if (!Array.isArray(parsedEvents)) {
          throw new Error('Response is not an array');
        }

        const events = parsedEvents.map((event) => {
          const eventId = this.generateDeterministicId(event);

          return {
            eventId,
            ...event,
          };
        });

        return events;
      } catch (parseError) {
        console.error('Failed to parse AI response:', cleanContent);
        throw new BadRequestException('AI returned invalid JSON format');
      }
    } catch (error) {
      console.error('Perplexity generation error:', error.message);
      throw new BadRequestException(
        'Failed to generate events with AI, please provide a more complete description and try again',
      );
    }
  }
}
