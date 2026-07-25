import type { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { createNestApp } from './bootstrap';

/**
 * Cached serverless-express handler.
 *
 * Reused across warm Lambda invocations so the Nest application is bootstrapped
 * only once per container, avoiding cold-start work on every request.
 */
let cachedHandler: Handler;

/**
 * Bootstraps the Nest application and wraps it in a serverless-express handler.
 *
 * @returns A handler capable of translating API Gateway events into Express
 *          requests and back.
 */
async function bootstrap(): Promise<Handler> {
  const nestApp = await createNestApp();
  await nestApp.init();

  return serverlessExpress({
    app: nestApp.getHttpAdapter().getInstance(),
  }) as Handler;
}

/**
 * AWS Lambda entry point.
 *
 * Lazily initializes (and caches) the Nest application, then delegates the
 * incoming API Gateway event to the serverless-express handler.
 */
export const handler: Handler = async (
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  cachedHandler ??= await bootstrap();

  return cachedHandler(event, context, callback);
};
