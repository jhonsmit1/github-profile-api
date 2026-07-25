import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLoggerService } from '../logger/app-logger.service';

/**
 * Global HTTP logging interceptor.
 *
 * Logs each incoming request on entry and, once the response is produced, logs
 * completion along with the elapsed time, giving basic request tracing in
 * CloudWatch.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /** Logical context used for all log lines emitted by this interceptor. */
  private static readonly CONTEXT = 'HTTP';

  /**
   * @param logger Winston-backed logger used to record request activity.
   */
  constructor(
    @Inject(AppLoggerService) private readonly logger: AppLoggerService,
  ) {}

  /**
   * Intercepts the request, logging its start and completion (with duration).
   *
   * @param context The current execution context.
   * @param next    The next handler in the chain.
   * @returns The (unmodified) response stream.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const start = Date.now();

    this.logger.log(`→ ${method} ${url}`, LoggingInterceptor.CONTEXT);

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        this.logger.log(
          `← ${method} ${url} (${elapsed}ms)`,
          LoggingInterceptor.CONTEXT,
        );
      }),
    );
  }
}
