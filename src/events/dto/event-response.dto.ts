import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({
    description: 'Unique event identifier',
    example: 'f537e65d-4c7d-541b-815e-8d56e740ecfd',
  })
  eventId: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Big Time Rush',
  })
  title: string;

  @ApiProperty({
    description: 'Brief event description',
    example: 'Concierto de la boyband en Palacio de los Deportes',
  })
  description: string;

  @ApiProperty({
    description: 'Event date in YYYY-MM-DD format',
    example: '2026-02-21',
  })
  date: string;

  @ApiProperty({
    description: 'Event time in HH:MM format',
    example: '21:00',
  })
  time: string;

  @ApiProperty({
    description: 'Venue name',
    example: 'Palacio de los Deportes',
  })
  place: string;

  @ApiProperty({
    description: 'City where the event takes place',
    example: 'Ciudad de México',
  })
  city: string;

  @ApiProperty({
    description: 'Country where the event takes place',
    example: 'México',
  })
  country: string;

  @ApiProperty({
    description: 'Event category',
    enum: ['music', 'sports', 'arts', 'technology', 'food', 'festivals', 'culture', 'entertainment', 'other'],
    example: 'music',
  })
  category: string;

  @ApiProperty({
    description: 'Price range or status',
    example: '$1,205.25 - $4,123.50',
  })
  price: string;

  @ApiProperty({
    description: 'Numeric cost value',
    example: 1205.254123,
  })
  cost: number;

  @ApiProperty({
    description: 'Source of the event information',
    example: 'web',
  })
  source: string;

  @ApiProperty({
    description: 'Event image URL',
    example: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
  })
  imageUrl: string;
}