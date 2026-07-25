import { Module } from '@nestjs/common';
import { GetGithubUserUseCase } from './application/use-cases/get-github-user.usecase';
import { GITHUB_API_PORT } from './domain/ports/github-api.port';
import { GithubApiAdapter } from './infrastructure/github-api.adapter';
import { GithubController } from './presentation/github.controller';

/**
 * Feature module for the GitHub profile use case.
 *
 * Wires the controller, use case and the {@link GITHUB_API_PORT} binding to its
 * concrete {@link GithubApiAdapter} implementation, following a hexagonal
 * (ports & adapters) architecture.
 */
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
