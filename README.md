# GitHub Profile API

REST API built with **NestJS** that queries the public **GitHub API** and returns a user's public profile. It runs both locally and on **AWS Lambda + API Gateway** through the **Serverless Framework**, with structured logging to **CloudWatch**.

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Endpoints](#endpoints)
- [Response shape](#response-shape)
- [Getting started](#getting-started)
- [Running locally](#running-locally)
- [Running the Lambda offline](#running-the-lambda-offline)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Testing](#testing)
- [Code style (Prettier)](#code-style-prettier)
- [Logging & observability](#logging--observability)
- [Deployment](#deployment)
- [Project structure](#project-structure)

---

## Features

- `GET /user/:username` — returns a GitHub user's public profile (name, bio, repos, followers, etc.).
- Hexagonal (ports & adapters) architecture with clear domain / application / infrastructure / presentation layers.
- Structured logging with **Winston** through an injectable logger service.
- Global request-logging interceptor (`→ / ←` with duration in ms).
- Global exception filter returning a consistent JSON error contract and logging the stack trace to CloudWatch.
- Same codebase runs locally (Express) and on AWS Lambda (serverless-express).

## Architecture

The GitHub feature follows a **hexagonal architecture**:

```
presentation (controller)
        │  calls
        ▼
application (use case + DTO)
        │  depends on a port (interface)
        ▼
domain (entities + ports)
        ▲  implemented by
        │
infrastructure (GitHub API adapter)
```

- **Domain** — framework-agnostic entities and ports (interfaces).
- **Application** — use cases that orchestrate ports; no HTTP or external-client knowledge.
- **Infrastructure** — concrete adapters (the GitHub REST client) that implement domain ports.
- **Presentation** — thin controllers that translate HTTP into use-case calls.

> **Note on Dependency Injection:** the project is bundled with `serverless-esbuild`, which does **not** emit decorator metadata. Therefore every constructor dependency uses an explicit `@Inject(...)` token/class so DI resolves correctly inside Lambda.

## Tech stack

- [NestJS 11](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Serverless Framework v3](https://www.serverless.com/) + `serverless-esbuild` + `serverless-offline`
- [@codegenie/serverless-express](https://github.com/CodeGenieApp/serverless-express) (Lambda ⇆ Express adapter)
- [Winston](https://github.com/winstonjs/winston) for logging
- [Jest](https://jestjs.io/) for testing
- [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/) for code quality

## Endpoints

| Method | Path              | Description                            |
| ------ | ----------------- | -------------------------------------- |
| `GET`  | `/`               | Health check (returns `Hello World!`)  |
| `GET`  | `/user/:username` | Returns the public GitHub profile      |

### Example

```bash
curl http://localhost:3000/user/octocat
```

## Response shape

```jsonc
{
  "username": "octocat",
  "name": "The Octocat",
  "bio": null,
  "publicRepos": 8,
  "followers": 23404,
  "following": 9,
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
  "htmlUrl": "https://github.com/octocat",
  "company": "@github",
  "location": "San Francisco",
  "blog": "https://github.blog",
  "twitterUsername": null,
  "createdAt": "2011-01-25T18:44:36Z",
  "updatedAt": "2026-07-22T11:29:09Z"
}
```

### Error contract

Every error is normalized by the global exception filter:

```jsonc
{
  "statusCode": 404,
  "message": "GitHub user \"unknown-user\" was not found",
  "path": "/user/unknown-user",
  "timestamp": "2026-07-25T00:00:00.000Z"
}
```

- `404` — the GitHub user does not exist.
- `502` — the GitHub API returned an unexpected error.
- `500` — any other unexpected error.

## Getting started

### Prerequisites

- Node.js 20+
- npm 9+

### Install

```bash
npm install
```

## Running locally

Starts a local Express server (default port `3000`):

```bash
# development
npm run start

# watch mode
npm run start:dev

# production build output
npm run start:prod
```

Then call the API:

```bash
curl http://localhost:3000/user/octocat
```

## Running the Lambda offline

To emulate the **API Gateway + Lambda** setup locally (using the same `lambda.handler` that runs in AWS), use `serverless-offline`:

```bash
npm run start:offline
```

This builds the project and starts serverless-offline on stage `dev`. By default the API is available at:

```
http://localhost:3000/dev/user/octocat
```

> `serverless-offline` prints the exact base URL and routes on startup. The path is prefixed with the stage (`/dev`), matching the deployed API Gateway behavior.

## Environment variables

| Variable              | Default                  | Description                                   |
| --------------------- | ------------------------ | --------------------------------------------- |
| `PORT`                | `3000`                   | Local HTTP port (local server only).          |
| `GITHUB_API_BASE_URL` | `https://api.github.com` | Base URL for the GitHub REST API.             |
| `LOG_LEVEL`           | `info`                   | Winston log level (`error`, `warn`, `info`…). |

## Available scripts

| Script                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run build`         | Compile the project with the Nest CLI.                   |
| `npm run start`         | Start the local server.                                  |
| `npm run start:dev`     | Start the local server in watch mode.                    |
| `npm run start:prod`    | Run the compiled output.                                 |
| `npm run start:offline` | Build and run the Lambda locally via serverless-offline. |
| `npm run offline`       | Run serverless-offline (without rebuilding).             |
| `npm run deploy`        | Deploy to AWS with the Serverless Framework.             |
| `npm run lint`          | Lint and auto-fix with ESLint.                           |
| `npm run format:check`  | Check formatting with Prettier.                          |
| `npm run format:fix`    | Apply formatting with Prettier.                          |
| `npm run test`          | Run unit tests.                                          |
| `npm run test:e2e`      | Run end-to-end tests.                                    |
| `npm run test:cov`      | Run tests with coverage.                                 |

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Code style (Prettier)

Formatting is enforced with Prettier (config in `.prettierrc`):

```bash
# check without modifying files
npm run format:check

# format all files
npm run format:fix
```

## Logging & observability

- Logging is centralized in `AppLoggerService` (Winston), which writes to the console (stdout).
- On AWS Lambda, stdout is captured by **CloudWatch**, so every request is traceable there.
- The global `LoggingInterceptor` logs each request on entry and completion with its duration:

```
2026-07-25 00:16:53 INFO [HTTP] → GET /user/octocat
2026-07-25 00:16:53 INFO [GetGithubUserUseCase] Fetching GitHub user: octocat
2026-07-25 00:16:54 INFO [GetGithubUserUseCase] GitHub user fetched successfully: octocat
2026-07-25 00:16:54 INFO [HTTP] ← GET /user/octocat (438ms)
```

- The global `AllExceptionsFilter` logs the full stack trace of any failure through the same logger.

## Deployment

Deployment is automated via **GitHub Actions** (`.github/workflows/deploy.yml`): pushing to `main` builds and deploys to AWS. Manual deployment is also available:

```bash
npm run deploy
```

The Serverless configuration (`serverless.ts`) targets:

- Runtime: `nodejs20.x`
- Region: `us-east-1`
- Bundling: `serverless-esbuild`
- Handler: `src/lambda.handler`

## Project structure

```
src/
├── app.controller.ts            # Health-check endpoint (GET /)
├── app.module.ts                # Root module (filter + interceptor + feature modules)
├── bootstrap.ts                 # Shared Nest app factory (local + Lambda)
├── main.ts                      # Local entry point
├── lambda.ts                    # AWS Lambda entry point (serverless-express)
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts   # Global exception filter
│   ├── interceptors/
│   │   └── logging.interceptor.ts     # Global request logger
│   └── logger/
│       ├── app-logger.service.ts      # Injectable Winston logger
│       └── logger.module.ts           # Global logger module
└── github/
    ├── github.module.ts               # Feature module wiring
    ├── domain/
    │   ├── entities/github-user.entity.ts
    │   └── ports/github-api.port.ts
    ├── application/
    │   ├── dto/github-user.dto.ts
    │   └── use-cases/get-github-user.usecase.ts
    ├── infrastructure/
    │   └── github-api.adapter.ts       # GitHub REST client
    └── presentation/
        └── github.controller.ts        # GET /user/:username
```

## License

UNLICENSED — private project.
