import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('items') createPaymentIntentDto: CreatePaymentIntentDto[],
    @Body('amount') amount: number,
  ) {
    return this.stripeService.createPaymentIntent(
      createPaymentIntentDto,
      amount,
    );
  }

  @Post('confirm-payment/:paymentIntentId')
  async confirmPaymentForTesting(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    return this.stripeService.confirmPaymentForTesting(paymentIntentId);
  }

  @Post('handle-success/:paymentIntentId')
  async handleSuccessfulPayment(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    return this.stripeService.handleSuccessfulPayment(paymentIntentId);
  }

  @Get('payment-intent/:paymentIntentId')
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    return this.stripeService.getPaymentIntent(paymentIntentId);
  }

}
