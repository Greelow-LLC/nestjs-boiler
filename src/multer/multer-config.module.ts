import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multerConfig from 'src/multer/config/multer-config';

@Global()
@Module({
  imports: [MulterModule.register(multerConfig)],
  exports: [MulterModule],
})
export class MulterConfigModule {}
