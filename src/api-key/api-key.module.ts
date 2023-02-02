import { Module } from '@nestjs/common';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
