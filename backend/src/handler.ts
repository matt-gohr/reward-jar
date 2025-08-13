import app from './app';
// @ts-ignore - serverless-express doesn't have types
import serverlessExpress from 'serverless-express';

// Configure AWS SDK for local development
if (process.env['NODE_ENV'] !== 'production') {
  // Configure AWS SDK for local development
  process.env['AWS_REGION'] = process.env['AWS_REGION'] || 'us-east-1';
}

// Export the serverless handler
export const handler = serverlessExpress({ app });
