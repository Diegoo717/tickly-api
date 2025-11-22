import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';
import { FindByTicketsDto } from './dto/find-by-tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(ticket: CreateTicketDto) {
    try {
      const newTicket = await this.ticketsRepository.create(ticket);
      await this.ticketsRepository.save(newTicket);
      return 'Ticket created succesfull';
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(findAllTicketsDto: FindAllTicketsDto) {
    const { userId } = findAllTicketsDto;

    const tickets = await this.ticketsRepository.find({
      where: {
        userId: userId,
      },
    });

    if (tickets.length == 0) {
      throw new NotFoundException(`No tickets found for user ${userId}`);
    }

    return tickets;
  }

  async findBy(
    findAllTicketsDto: FindAllTicketsDto,
    findByTicketsDto: FindByTicketsDto,
  ) {
    const { userId } = findAllTicketsDto;
    const { eventTitle } = findByTicketsDto;

    const tickets = await this.ticketsRepository.find({
      where: {
        userId: userId,
        eventTitle: ILike(`%${eventTitle.trim()}%`),
      },
    });

    if (tickets.length == 0) {
      throw new NotFoundException(
        `No tickets found for event "${eventTitle}" for this user`,
      );
    }

    return tickets;
  }

  async findBySeat(seat: string) {
    const ticket = await this.ticketsRepository.findOne({
      where: {
        eventSeat: seat,
      },
    });

    if (ticket) {
      return true;
    }

    return false;
  }

  async findByOrder(order: string) {
    const ticket = await this.ticketsRepository.findOne({
      where: {
        eventOrder: order,
      },
    });

    if (ticket) {
      return true;
    }

    return false;
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
