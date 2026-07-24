import type { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { createNestApp } from './bootstrap';

let cachedHandler: Handler;

async function bootstrap(): Promise<Handler> {
  const nestApp = await createNestApp();
  await nestApp.init();

  return serverlessExpress({
    app: nestApp.getHttpAdapter().getInstance(),
  }) as Handler;
}

export const handler: Handler = async (event: unknown, context: Context, callback: Callback) => {
  cachedHandler ??= await bootstrap();

  return cachedHandler(event, context, callback);
};