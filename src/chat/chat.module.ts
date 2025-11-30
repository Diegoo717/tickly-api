import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { TicketsModule } from 'src/tickets/tickets.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TicketsModule,
    AuthModule
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}