import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],  
})
export class AuthModule {}