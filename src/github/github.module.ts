import { Module } from '@nestjs/common';
import { GetGithubUserUseCase } from './application/use-cases/get-github-user.usecase';
import { GITHUB_API_PORT } from './domain/ports/github-api.port';
import { GithubApiAdapter } from './infrastructure/github-api.adapter';
import { GithubController } from './presentation/github.controller';

@Module({
	controllers: [GithubController],
	providers: [
		GetGithubUserUseCase,
		{
			provide: GITHUB_API_PORT,
			useClass: GithubApiAdapter,
		},
	],
})
export class GithubModule {}
