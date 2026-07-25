import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';

/**
 * Global catch-all exception filter.
 *
 * It normalizes every thrown error into a consistent JSON response and logs
 * the failure (including the stack trace) through the injected Winston-backed
 * {@link AppLoggerService}, so all errors are traceable in CloudWatch.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private static readonly CONTEXT = AllExceptionsFilter.name;

  /**
   * @param logger Winston-backed logger used to record the failure.
   */
  constructor(
    @Inject(AppLoggerService) private readonly logger: AppLoggerService,
  ) {}

  /**
   * Handles any exception thrown within the request lifecycle.
   *
   * @param exception The thrown value (an `HttpException` or any unknown error).
   * @param host      The arguments host used to access the HTTP context.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const trace =
      exception instanceof Error ? exception.stack : String(exception);

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}: ${message}`,
      trace,
      AllExceptionsFilter.CONTEXT,
    );

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
