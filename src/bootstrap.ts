import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLoggerService } from './common/logger/app-logger.service';

export const createNestApp = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  app.useLogger(app.get(AppLoggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.enableCors();

  return app;
};