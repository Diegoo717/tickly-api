import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TicketsModule } from 'src/tickets/tickets.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TicketsModule, OrdersModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService]
})
export class StripeModule {}
