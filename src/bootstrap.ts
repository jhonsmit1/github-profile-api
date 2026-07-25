import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLoggerService } from './common/logger/app-logger.service';

/**
 * Creates and configures a NestJS application instance.
 *
 * Shared by both the local server (`main.ts`) and the AWS Lambda handler
 * (`lambda.ts`) to guarantee identical runtime behavior across environments.
 * It wires the Winston-backed logger, enables strict request validation and
 * turns on CORS.
 *
 * @returns A fully configured (but not yet listening) Nest application.
 */
export const createNestApp = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  // Route every Nest log through the Winston-backed logger so all output
  // reaches stdout (and therefore CloudWatch when running on Lambda).
  app.useLogger(app.get(AppLoggerService));

  // Strip unknown properties and auto-transform payloads to their DTO types.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  return app;
};
