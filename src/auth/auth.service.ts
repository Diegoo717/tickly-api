import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const serviceRoleKey = this.configService.get<string>('supabase.serviceRoleKey');  
    
    this.supabase = createClient(url!, serviceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async validateToken(
    accessToken: string,
  ): Promise<{ userId: string; email: string }> {
    try {
      const { data, error } = await this.supabase.auth.getUser(accessToken);

      if (!data.user || error) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return { userId: data.user.id, email: data.user.email! };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
