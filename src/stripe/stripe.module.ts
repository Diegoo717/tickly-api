import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TicketModule } from 'src/ticket/ticket.module';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TicketModule, OrdersModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService, CreatePaymentIntentDto]
})
export class StripeModule {}
