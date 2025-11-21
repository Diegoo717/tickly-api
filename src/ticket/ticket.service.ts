import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTicketDto } from './interfaces/ticket.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(ticket: CreateTicketDto) {
    try {
      const newTicket = await this.ticketsRepository.create(ticket);
      await this.ticketsRepository.save(newTicket);
      return "Ticket created succesfull";
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Ticket exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Ticket - Check server logs`,
    );
  }
}
