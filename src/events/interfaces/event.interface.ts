import { type UUID } from 'crypto';

export interface Event {
  eventId: UUID;
  title: string;
  description: string;
  place: string;
  date: string;
  time: string;
  cost: number | string;
  source: string;
  imageUrl: string;
}
