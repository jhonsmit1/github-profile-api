import { Inject, Injectable } from '@nestjs/common';
import { GITHUB_API_PORT } from '../../domain/ports/github-api.port';
import type { GithubApiPort } from '../../domain/ports/github-api.port';
import { GithubUserDto } from '../dto/github-user.dto';

@Injectable()
export class GetGithubUserUseCase {
    constructor(
        @Inject(GITHUB_API_PORT)
        private readonly githubApiPort: GithubApiPort
    ) { }

    async execute(username: string): Promise<GithubUserDto> {
        const githubUser = await this.githubApiPort.getUser(username);

        return { ...githubUser };
    }
}
