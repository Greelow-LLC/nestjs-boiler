import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { useAppMiddlewares } from 'helpers/server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: process.env.APP_URL ?? 'http://localhost:3000',
    },
  });

  useAppMiddlewares(app);

  await app.listen(3001);
  console.log(`Server initialized in ${await app.getUrl()}`);
}
bootstrap();
