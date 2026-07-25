import { GithubUserEntity } from '../entities/github-user.entity';

/**
 * Dependency-injection token for {@link GithubApiPort}.
 *
 * Required because interfaces do not exist at runtime; the token lets Nest
 * resolve the concrete adapter bound to this port.
 */
export const GITHUB_API_PORT = Symbol('GITHUB_API_PORT');

/**
 * Outbound port describing how the application fetches GitHub user data.
 *
 * Implemented by infrastructure adapters, keeping the application layer
 * decoupled from any concrete HTTP client or external API.
 */
export interface GithubApiPort {
  /**
   * Fetches a single GitHub user by its username.
   *
   * @param username The GitHub login to look up.
   * @returns The normalized user entity.
   */
  getUser(username: string): Promise<GithubUserEntity>;
}
