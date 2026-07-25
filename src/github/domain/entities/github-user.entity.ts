/**
 * Domain representation of a GitHub user.
 *
 * This is the internal, framework-agnostic shape used across the application
 * layers. Field names are normalized to camelCase, independent of the raw
 * GitHub API payload.
 */
export interface GithubUserEntity {
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
