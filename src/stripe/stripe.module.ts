import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TicketModule } from 'src/ticket/ticket.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TicketModule, OrdersModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService]
})
export class StripeModule {}
