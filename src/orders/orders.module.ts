import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([Order])],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
