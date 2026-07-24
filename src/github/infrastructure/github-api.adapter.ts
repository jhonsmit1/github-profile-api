import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { GithubApiPort } from '../domain/ports/github-api.port';
import { GithubUserEntity } from '../domain/entities/github-user.entity';

type GithubApiResponse = {
    login: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
    html_url: string;
    company: string | null;
    location: string | null;
    blog: string | null;
    twitter_username: string | null;
    created_at: string;
    updated_at: string;
};

export class GithubApiAdapter implements GithubApiPort {
    private readonly baseUrl = process.env.GITHUB_API_BASE_URL ?? 'https://api.github.com';

    async getUser(username: string): Promise<GithubUserEntity> {
        const response = await fetch(`${this.baseUrl}/users/${encodeURIComponent(username)}`, {
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'github-profile-api',
            },
        });

        if (response.status === 404) throw new NotFoundException(`GitHub user "${username}" was not found`);


        if (!response.ok) throw new BadGatewayException(`GitHub API request failed with status ${response.status}`);


        const data = (await response.json()) as GithubApiResponse;

        return {
            username: data.login,
            name: data.name,
            bio: data.bio,
            publicRepos: data.public_repos,
            followers: data.followers,
            following: data.following,
            avatarUrl: data.avatar_url,
            htmlUrl: data.html_url,
            company: data.company,
            location: data.location,
            blog: data.blog,
            twitterUsername: data.twitter_username,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    }
}
