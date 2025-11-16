import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AiService],
  exports: [AiService]
})
export class AiModule {}
