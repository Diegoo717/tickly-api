import { Controller, Get, Param, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';
import { FindByTicketsDto } from './dto/find-by-tickets.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('find-all/:userId')
  async findAll(@Param() params: FindAllTicketsDto) {
    return this.ticketsService.findAll(params);
  }

  @Get('find-by/:userId')
  async findBy(
    @Param() params: FindAllTicketsDto,
    @Query() query: FindByTicketsDto,
  ) {
    return this.ticketsService.findBy(params, query);
  }
}
