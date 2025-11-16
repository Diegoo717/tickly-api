import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateEvents(prompt: string): Promise<any> {
    const apiKey = this.configService.get<string>('deepseek.apiKey');
    const apiUrl = this.configService.get<string>('deepseek.apiUrl');

    const requestBody = {
      "model": "deepseek-chat",
        "messages": [
          {"role": "system", "content": `${prompt}`}
        ],
        "stream": false
    };

    const response = await firstValueFrom(
      this.httpService.post(apiUrl!, requestBody, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
      }),
    );

    return response.data;
  }
}