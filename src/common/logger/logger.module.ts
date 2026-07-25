import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';

/**
 * Global logging module.
 *
 * Marked `@Global()` so {@link AppLoggerService} can be injected anywhere
 * without importing this module in every feature module.
 */
@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
