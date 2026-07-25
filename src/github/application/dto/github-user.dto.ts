/**
 * Data Transfer Object returned by the `GET /user/:username` endpoint.
 *
 * Mirrors {@link GithubUserEntity} and defines the public contract exposed to
 * API consumers.
 */
export interface GithubUserDto {
  username: string;
  name: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  avatarUrl: string;
  htmlUrl: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitterUsername: string | null;
  createdAt: string;
  updatedAt: string;
}
