import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggerModule } from './common/logger/logger.module';
import { GithubModule } from './github/github.module';

@Module({
	imports: [LoggerModule, GithubModule],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {}
