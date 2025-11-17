import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.stripeService.createPaymentIntent(createPaymentIntentDto);
  }

  @Post('confirm-payment/:paymentIntentId')
  async confirmPayment(@Param('paymentIntentId') paymentIntentId: string) {
    return this.stripeService.confirmPayment(paymentIntentId);
  }

  @Get('payment-intent/:paymentIntentId')
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    return this.stripeService.getPaymentIntent(paymentIntentId);
  }
}