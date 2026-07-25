import { Controller, Get, Inject, Param } from '@nestjs/common';
import { GetGithubUserUseCase } from '../application/use-cases/get-github-user.usecase';

/**
 * HTTP controller exposing GitHub profile endpoints.
 *
 * Kept thin on purpose: it only translates HTTP concerns into a use-case call
 * and returns the result, leaving all business logic to the application layer.
 */
@Controller()
export class GithubController {
  /**
   * @param getGithubUserUseCase Use case that retrieves a GitHub user profile.
   */
  constructor(
    @Inject(GetGithubUserUseCase)
    private readonly getGithubUserUseCase: GetGithubUserUseCase,
  ) {}

  /**
   * Retrieves the public profile of a GitHub user.
   *
   * @param username The GitHub login provided in the URL.
   * @returns The user's public profile data.
   */
  @Get('user/:username')
  getUser(@Param('username') username: string) {
    return this.getGithubUserUseCase.execute(username);
  }
}
