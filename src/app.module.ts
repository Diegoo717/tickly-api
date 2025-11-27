import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AiModule } from './ai/ai.module';
import { StripeModule } from './stripe/stripe.module';
import { EnvConfiguration } from './config/app.config';
import { OrdersModule } from './orders/orders.module';
import { TicketsModule } from './tickets/tickets.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProduction,
          logging: !isProduction,
        };
      },
    }),

    ChatModule,
    EventsModule,
    AiModule,
    StripeModule,
    TicketsModule,
    OrdersModule,
  ],
})
export class AppModule {}
