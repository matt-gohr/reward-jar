import app from './app';
// @ts-ignore - serverless-express doesn't have types
import serverlessExpress from 'serverless-express';

// Configure AWS SDK for local development
if (process.env['NODE_ENV'] !== 'production') {
  const AWS = require('aws-sdk');
  AWS.config.update({
    region: process.env['AWS_REGION'] || 'us-east-1',
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  });
}

// Export the serverless handler
export const handler = serverlessExpress({ app });
