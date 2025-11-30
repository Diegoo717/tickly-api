import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();

    const token = data.token || data.accessToken;

    if (!token) {
      client.emit('error', {
        message: 'Authentication required. Send token in your message.',
      });
      return false;
    }

    try {
      const user = await this.authService.validateToken(token);

      client.data.user = user;

      return true;
    } catch (error) {
      client.emit('error', { message: 'Invalid or expired token' });
      return false;
    }
  }
}
