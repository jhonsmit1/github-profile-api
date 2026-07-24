import { Controller, Get, Param } from '@nestjs/common';
import { GetGithubUserUseCase } from '../application/use-cases/get-github-user.usecase';

@Controller()
export class GithubController {
	constructor(private readonly getGithubUserUseCase: GetGithubUserUseCase) {}

	@Get('user/:username')
	getUser(@Param('username') username: string) {
		return this.getGithubUserUseCase.execute(username);
	}
}
