import { GithubUserEntity } from '../entities/github-user.entity';

export const GITHUB_API_PORT = Symbol('GITHUB_API_PORT');

export interface GithubApiPort {
	getUser(username: string): Promise<GithubUserEntity>;
}
