import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { EnvConfiguration } from './config/app.config';
import { AiModule } from './ai/ai.module';


@Module({
  imports: [EventsModule, ConfigModule.forRoot({
    load: [EnvConfiguration],
    isGlobal: true
  }), AiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
