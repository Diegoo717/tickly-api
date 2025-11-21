import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketModule {}
