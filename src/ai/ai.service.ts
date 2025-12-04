import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Perplexity from '@perplexity-ai/perplexity_ai';
import { v5 as uuidv5 } from 'uuid';
import { Event } from 'src/events/interfaces/event.interface';

@Injectable()
export class AiService {
  private client: Perplexity;
  private readonly UUID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  private readonly CATEGORY_IMAGES = {
    music: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    ],
    sports: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
    ],
    arts: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop',
    ],
    technology: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    ],
    food: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    ],
    festivals: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    ],
    culture: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    ],
    entertainment: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop',
    ],
    other: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    ],
  };

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

  private getCategoryImage(category: string): string {
    const images = this.CATEGORY_IMAGES[category] || this.CATEGORY_IMAGES.other;
    return images[Math.floor(Math.random() * images.length)];
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

  async generateEvents(userQuery: string): Promise<Event[]> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const searchResults = await this.client.search.create({
        query: userQuery,
        max_results: 10,
        max_tokens_per_page: 2048,
      });

      if (!searchResults.results || searchResults.results.length === 0) {
        throw new BadRequestException(
          'No events found matching your search criteria. Try another location or event type.',
        );
      }

      const searchContext = searchResults.results
        .map((result, index) => {
          return `
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            [SOURCE ${index + 1}]
            📌 Title: ${result.title}
            🔗 URL: ${result.url}
            📅 Publication Date: ${result.date || 'Not specified'}
            📄 Content:
            ${result.snippet}
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;
        })
        .join('\n\n');

      const completion = await this.client.chat.completions.create({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are an expert assistant at extracting event information from web search results.

              **CRITICAL RULES:**
              1. Extract ONLY real events found in the search results
              2. DO NOT invent or create fictional events
              3. Today's date: ${today} - DO NOT include past events
              4. If NO valid events are found, return an empty array: []
              5. Respect the language and location of the user's search
              6. Respond ONLY with valid JSON, no markdown or explanations

              **OUTPUT FORMAT (pure JSON):**
              [
                {
                  "title": "Exact event name",
                  "description": "Brief description (30-60 characters)",
                  "date": "YYYY-MM-DD",
                  "time": "HH:MM",
                  "place": "Venue name",
                  "city": "City",
                  "country": "Country",
                  "category": "music|sports|arts|technology|food|festivals|culture|entertainment|other",
                  "price": "Free" or "$100" or "Price TBD",
                  "imageUrl": "DEFAULT"
                }
              ]

              **CATEGORIES:**
              - music: Concerts, live music, DJ sets
              - sports: Sports games, races, competitions, fitness events
              - arts: Theater, dance, exhibitions, cinema, galleries
              - technology: Tech conferences, hackathons, startup events
              - food: Food festivals, tastings, culinary events, food markets
              - festivals: General festivals, street fairs, community celebrations
              - culture: Cultural events, heritage celebrations, museums
              - entertainment: Comedy shows, variety shows, entertainment events
              - other: Any other type

              **IMPORTANT:**
              - Always use "imageUrl": "DEFAULT" (images will be assigned by category)
              - If no clear price, use "Price TBD"
              - Respect the geographic location of the original search`,
          },
          {
            role: 'user',
            content: `User searched for: "${userQuery}"

              Here are the real-time web search results:

              ${searchContext}

              Extract ALL valid events you find in these results and format as JSON array.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 4096,
      });

      const aiResponse = completion.choices[0]?.message?.content?.toString();

      if (!aiResponse) {
        throw new BadRequestException(
          'AI did not return a valid response, try again',
        );
      }

      const cleanContent = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^[{]*/g, '')
        .replace(/[^}\]]*$/g, '')
        .trim();

      try {
        const parsedEvents = JSON.parse(cleanContent);

        if (!Array.isArray(parsedEvents)) {
          console.error('Response is not an array:', cleanContent);
          throw new Error('Response is not a valid array');
        }

        if (parsedEvents.length === 0) {
          throw new BadRequestException(
            'No valid events found. Try being more specific with dates, locations, or event types.',
          );
        }

        const events: Event[] = parsedEvents.map((event) => {
          const eventId = this.generateDeterministicId(
            event,
          ) as `${string}-${string}-${string}-${string}-${string}`;
          const imageUrl = this.getCategoryImage(event.category);

          return {
            eventId,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            place: event.place,
            city: event.city,
            country: event.country,
            category: event.category,
            price: event.price,
            cost:
              event.price === 'Free' || event.price === 'Gratis'
                ? 0
                : parseFloat(event.price.replace(/[^0-9.]/g, '')) || 0,
            source: event.source || 'web',
            imageUrl,
          };
        });

        return events.slice(0, 8);
      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', cleanContent);
        console.error('Parse error:', parseError.message);
        throw new BadRequestException(
          'AI returned invalid format. Please rephrase your search.',
        );
      }
    } catch (error) {
      console.error('❌ Perplexity generation error:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to generate events. Please provide a more complete description with location and dates.',
      );
    }
  }
}
