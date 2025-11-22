import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PaymentIntentParamDto } from './dto/payment-intent-param.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() createPaymentRequest : CreatePaymentRequestDto
  ) {
    return this.stripeService.createPaymentIntent(
      createPaymentRequest.items,
      createPaymentRequest.amount,
    );
  }

  @Post('confirm-payment/:paymentIntentId')
  async confirmPaymentForTesting(
    @Param() paymentIntentParam: PaymentIntentParamDto,
  ) {
    return this.stripeService.confirmPaymentForTesting(paymentIntentParam.paymentIntentId);
  }

  @Post('handle-success/:paymentIntentId')
  async handleSuccessfulPayment(
    @Param() paymentIntentParam: PaymentIntentParamDto,
  ) {
    return this.stripeService.handleSuccessfulPayment(paymentIntentParam.paymentIntentId);
  }

  @Get('payment-intent/:paymentIntentId')
  async getPaymentIntent(@Param() paymentIntentParam: PaymentIntentParamDto) {
    return this.stripeService.getPaymentIntent(paymentIntentParam.paymentIntentId);
  }

}
