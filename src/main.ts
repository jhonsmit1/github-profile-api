import { createNestApp } from './bootstrap';

/**
 * Local entry point.
 *
 * Boots the NestJS application and starts an HTTP server. This path is used for
 * local development only; in AWS the application is served through
 * `lambda.ts` instead.
 */
async function bootstrap() {
  const app = await createNestApp();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
