import { IncomingMessage } from 'http';

import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';
import * as chalk from 'chalk';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

export const useAppMiddlewares = (app: INestApplication) => {
  app.use(cookieParser());
  app.use(
    morgan(
      function (tokens, req, res) {
        return (
          chalk.cyanBright(tokens.method(req, res)) +
          ' ' +
          chalk.redBright(tokens.url(req, res)) +
          ' ' +
          chalk.cyan(tokens.status(req, res)) +
          ' ' +
          chalk.yellow(tokens['response-time'](req, res))
        );
      },
      {
        skip: (req: IncomingMessage) => req.method === 'OPTIONS',
      },
    ),
  );

  //Use validations in all app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  //Make validation constraints injectable
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  //Handle errors
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  //Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  //Documentation
  //TODO: Lean Swagger
  const config = new DocumentBuilder()
    .setTitle('Versioning')
    .setDescription('API description')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
};
