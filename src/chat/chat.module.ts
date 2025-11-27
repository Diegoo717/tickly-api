import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TicketsModule
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}