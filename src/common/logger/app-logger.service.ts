import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

/**
 * Application logger backed by Winston.
 *
 * Implements Nest's {@link LoggerService} so it can be used both as the
 * framework logger (via `app.useLogger`) and as an injectable dependency. Logs
 * are written to the console (stdout), which is captured by CloudWatch when
 * running on AWS Lambda.
 */
@Injectable()
export class AppLoggerService implements LoggerService {
  /** Underlying Winston logger instance with a timestamped, contextual format. */
  private readonly winston: Logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.printf((info) => {
        const { timestamp, level, message, context, trace } = info as {
          timestamp: string;
          level: string;
          message: string;
          context?: string;
          trace?: string;
        };
        const ctx = context ? ` [${context}]` : '';
        const stack = trace ? `\n${trace}` : '';
        return `${timestamp} ${level.toUpperCase()}${ctx} ${message}${stack}`;
      }),
    ),
    transports: [new transports.Console()],
  });

  /**
   * Logs an informational message.
   *
   * @param message The message to log.
   * @param context Optional logical context (e.g. the emitting class name).
   */
  log(message: string, context?: string): void {
    this.winston.info(message, { context });
  }

  /**
   * Logs an error message, optionally with a stack trace.
   *
   * @param message The error message.
   * @param trace   Optional stack trace.
   * @param context Optional logical context.
   */
  error(message: string, trace?: string, context?: string): void {
    this.winston.error(message, { trace, context });
  }

  /**
   * Logs a warning message.
   *
   * @param message The warning message.
   * @param context Optional logical context.
   */
  warn(message: string, context?: string): void {
    this.winston.warn(message, { context });
  }

  /**
   * Logs a debug message.
   *
   * @param message The debug message.
   * @param context Optional logical context.
   */
  debug(message: string, context?: string): void {
    this.winston.debug(message, { context });
  }

  /**
   * Logs a verbose message.
   *
   * @param message The verbose message.
   * @param context Optional logical context.
   */
  verbose(message: string, context?: string): void {
    this.winston.verbose(message, { context });
  }
}
