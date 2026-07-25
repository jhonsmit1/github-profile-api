import { Inject, Injectable } from '@nestjs/common';
import { GITHUB_API_PORT } from '../../domain/ports/github-api.port';
import type { GithubApiPort } from '../../domain/ports/github-api.port';
import { GithubUserDto } from '../dto/github-user.dto';
import { AppLoggerService } from '../../../common/logger/app-logger.service';

@Injectable()
export class GetGithubUserUseCase {
    constructor(
        @Inject(GITHUB_API_PORT)
        private readonly githubApiPort: GithubApiPort,
        @Inject(AppLoggerService)
        private readonly logger: AppLoggerService,
    ) {}

    async execute(username: string): Promise<GithubUserDto> {
        this.logger.log(`Fetching GitHub user: ${username}`, GetGithubUserUseCase.name);
        const githubUser = await this.githubApiPort.getUser(username);
        this.logger.log(`GitHub user fetched successfully: ${username}`, GetGithubUserUseCase.name);
        return { ...githubUser };
    }
}
