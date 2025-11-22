import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketsService],
  exports: [TicketsService],
  controllers: [TicketsController]
})
export class TicketsModule {}
