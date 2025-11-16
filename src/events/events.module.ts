import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
