import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { TicketsService } from 'src/tickets/tickets.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private ticketService: TicketsService,
    private orderService: OrdersService,
  ) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    this.stripe = new Stripe(secretKey!, {
      apiVersion: '2025-10-29.clover',
    });
  }

  async createPaymentIntent(
    createPaymentIntentDto: CreatePaymentIntentDto[],
    amount: number,
  ) {
    const userId = createPaymentIntentDto[0].userId;

    const createOrder = {
      userId: userId,
      ticketsData: createPaymentIntentDto,
      totalAmount: amount,
    };

    const order = await this.orderService.create(createOrder);

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: {
          orderId: order.id,
          userId: userId,
          totalTickets: createPaymentIntentDto.length,
          amount: amount,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      await this.orderService.updatePaymentIntent(order.id, paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('❌ Stripe error:', error.message);
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async handleSuccessfulPayment(paymentIntentId: string) {
    let order;
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new BadRequestException(
          `Payment status is ${paymentIntent.status}, not succeeded`,
        );
      }

      order = await this.orderService.findByPaymentIntent(paymentIntentId);

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const eventOrderExists = await this.ticketService.findByOrder(order.id);

      if (eventOrderExists) {
        throw new BadRequestException(
          `Order ${order.id} has already been processed. Tickets were already created.`,
        );
      }

      for (const ticket of order.ticketsData) {
        const ticketType = ticket.vip ? 'vip' : 'general';
        const eventSeat = await this.generateRandomSeat(ticketType);

        await this.ticketService.create({
          eventSeat: eventSeat,
          eventOrder: order.id,
          ...ticket,
        });
      }

      await this.orderService.updateStatus(order.id, 'completed');

      return {
        success: true,
        orderId: order.id,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      console.error('❌ Payment handling error:', error.message);
      if (
        order &&
        !(
          error instanceof BadRequestException &&
          error.message.includes('already been processed')
        )
      ) {
        await this.orderService.updateStatus(order.id, 'failed');
      }
      throw error;
    }
  }

  async confirmPaymentForTesting(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: 'pm_card_visa',
          return_url: 'http://localhost:3000/success',
        },
      );

      return {
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('❌ Confirm error:', error.message);
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
        created: new Date(paymentIntent.created * 1000),
      };
    } catch (error) {
      console.error('❌ Retrieve error:', error.message);
      throw new BadRequestException('Failed to retrieve payment intent');
    }
  }

  async generateRandomSeat(ticketType: string): Promise<string> {
    const row = String.fromCharCode(65 + Math.floor(Math.random() * 10));
    const number = Math.floor(Math.random() * 30) + 1;
    let seat;

    if (ticketType === 'vip') {
      seat = `VIP-${number}, Row ${row}`;
    } else {
      seat = `General-${number}, Row ${row}`;
    }

    if (await this.ticketService.findBySeat(seat)) {
      return this.generateRandomSeat(ticketType);
    } else {
      return seat;
    }
  }
}
