import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();

    console.log('🔐 WS Auth Guard activated');
    console.log('📦 Received data:', data);

    const token = data.token || data.accessToken;

    if (!token) {
      console.error('❌ No token provided in WebSocket message');
      client.emit('error', { message: 'Authentication required. Send token in your message.' });
      return false;
    }

    console.log('🎫 Token received (first 30 chars):', token.substring(0, 30) + '...');

    try {
      const user = await this.authService.validateToken(token);
      
      console.log('✅ WebSocket authentication successful');
      console.log('👤 User ID:', user.userId);

      client.data.user = user;  

      return true;
    } catch (error) {
      console.error('❌ WebSocket authentication failed:', error.message);
      client.emit('error', { message: 'Invalid or expired token' });
      return false;
    }
  }
}