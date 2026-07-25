import { Controller, Get } from '@nestjs/common';

/**
 * Root controller.
 *
 * Exposes a lightweight health-check endpoint (`GET /`) used by the e2e smoke
 * test and to confirm the service is reachable.
 */
@Controller()
export class AppController {
  /**
   * Health-check endpoint.
   *
   * @returns A static greeting confirming the service is up.
   */
  @Get()
  getRoot(): string {
    return 'Hello World!';
  }
}
