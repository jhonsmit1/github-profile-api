import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { GithubApiPort } from '../domain/ports/github-api.port';
import { GithubUserEntity } from '../domain/entities/github-user.entity';

/**
 * Raw shape of the GitHub REST API user response.
 *
 * Only the fields consumed by this service are declared. Property names use
 * snake_case to match the upstream API before mapping to the domain entity.
 */
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

/**
 * Infrastructure adapter that implements {@link GithubApiPort} using the public
 * GitHub REST API via the global `fetch` client.
 *
 * It maps the upstream snake_case payload to the domain's camelCase
 * {@link GithubUserEntity} and translates HTTP failures into meaningful Nest
 * exceptions.
 */
export class GithubApiAdapter implements GithubApiPort {
  private readonly baseUrl =
    process.env.GITHUB_API_BASE_URL ?? 'https://api.github.com';

  /**
   * Fetches a GitHub user and maps it to the domain entity.
   *
   * @param username The GitHub login to look up.
   * @returns The normalized user entity.
   * @throws NotFoundException  When the user does not exist (HTTP 404).
   * @throws BadGatewayException When the GitHub API returns any other error.
   */
  async getUser(username: string): Promise<GithubUserEntity> {
    const response = await fetch(
      `${this.baseUrl}/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'github-profile-api',
        },
      },
    );

    if (response.status === 404)
      throw new NotFoundException(`GitHub user "${username}" was not found`);

    if (!response.ok)
      throw new BadGatewayException(
        `GitHub API request failed with status ${response.status}`,
      );

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
