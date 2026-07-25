import { Inject, Injectable } from '@nestjs/common';
import { GITHUB_API_PORT } from '../../domain/ports/github-api.port';
import type { GithubApiPort } from '../../domain/ports/github-api.port';
import { GithubUserDto } from '../dto/github-user.dto';
import { AppLoggerService } from '../../../common/logger/app-logger.service';

/**
 * Application use case that fetches a GitHub user's public profile.
 *
 * Orchestrates the outbound {@link GithubApiPort} and logs the operation for
 * observability, without knowing anything about HTTP or the concrete API
 * client.
 */
@Injectable()
export class GetGithubUserUseCase {
  /**
   * @param githubApiPort Outbound port used to fetch GitHub data.
   * @param logger        Winston-backed logger for tracing the operation.
   */
  constructor(
    @Inject(GITHUB_API_PORT)
    private readonly githubApiPort: GithubApiPort,
    @Inject(AppLoggerService)
    private readonly logger: AppLoggerService,
  ) {}

  /**
   * Executes the use case.
   *
   * @param username The GitHub login to look up.
   * @returns The user's public profile as a {@link GithubUserDto}.
   */
  async execute(username: string): Promise<GithubUserDto> {
    this.logger.log(
      `Fetching GitHub user: ${username}`,
      GetGithubUserUseCase.name,
    );
    const githubUser = await this.githubApiPort.getUser(username);
    this.logger.log(
      `GitHub user fetched successfully: ${username}`,
      GetGithubUserUseCase.name,
    );
    return { ...githubUser };
  }
}
