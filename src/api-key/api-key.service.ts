import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyService {
  constructor(private config: ConfigService) {}

  validateKey(key: string) {
    if (key && key === this.config.get('API_KEY')) {
      return true;
    }

    throw new UnauthorizedException('Invalid Api Key');
  }
}
