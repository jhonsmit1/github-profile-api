import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class AppLoggerService implements LoggerService {
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

  log(message: string, context?: string): void {
    this.winston.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.winston.error(message, { trace, context });
  }

  warn(message: string, context?: string): void {
    this.winston.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.winston.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.winston.verbose(message, { context });
  }
}
