import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private ticketsService: TicketsService,
  ) {}

  async saveMessage(sendMessageDto: SendMessageDto): Promise<Message> {
    const message = await this.messageRepository.create(sendMessageDto);
    await this.messageRepository.save(message);
    return message;
  }

  async getMessagesByEvent(eventId: string): Promise<Message[]> {
    const messages: Message[] = await this.messageRepository.find({
      where: {
        eventId: eventId,
      },
      order: {
        createdAt: 'ASC',
      },
      take: 50,
    });

    return messages;
  }

  async userHasAccessToEvent(
    userId: string,
    eventId: string,
  ): Promise<boolean> {
    const tickets = await this.ticketsService.findByUserAndEvent(
      userId,
      eventId,
    );
    return tickets.length > 0;
  }
}
