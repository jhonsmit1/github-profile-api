import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppLoggerService } from './app-logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
              const ctx = context ? ` [${String(context)}]` : '';
              const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              const stack = trace ? `\n${String(trace)}` : '';
              return `${String(timestamp)} ${level.toUpperCase()}${ctx} ${String(message)}${extra}${stack}`;
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
