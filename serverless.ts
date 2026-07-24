import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'github-profile-api',
  frameworkVersion: '4',
  plugins: ['serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: '${opt:stage, "dev"}',
    region: 'us-east-1',
    memorySize: 512,
    timeout: 30,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      GITHUB_API_BASE_URL: '${env:GITHUB_API_BASE_URL, "https://api.github.com"}',
    },
  },
  functions: {
    api: {
      handler: 'src/lambda.handler',
      events: [
        {
          http: {
            path: '/',
            method: 'get',
            cors: true,
          },
        },
        {
          http: {
            path: 'user/{username}',
            method: 'get',
            cors: true,
          },
        },
      ],
    },
  },
  package: {
    individually: false,
  },
};

module.exports = serverlessConfiguration;