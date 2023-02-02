import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

import { useAppMiddlewares } from '../utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  useAppMiddlewares(app);

  await app.listen(3001);
  console.log(`Server initialized in ${await app.getUrl()}`);
}
bootstrap();
