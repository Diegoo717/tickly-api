import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreatePaymentIntentDto } from 'src/stripe/dto/create-payment-intent.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(
    userId: string,
    ticketsData: CreatePaymentIntentDto[],
    totalAmount: number,
  ) {
    const order = this.ordersRepository.create({
      userId,
      ticketsData,
      totalAmount,
      status: 'pending',
    });

    return await this.ordersRepository.save(order);
  }

  async updatePaymentIntent(orderId: string, paymentIntentId: string) {
    await this.ordersRepository.update(orderId, { paymentIntentId });
  }

  async findByPaymentIntent(paymentIntentId: string) {
    return await this.ordersRepository.findOne({
      where: { paymentIntentId },
    });
  }

  async updateStatus(orderId: string, status: string) {
    await this.ordersRepository.update(orderId, { status });
  }
}
