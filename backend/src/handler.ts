import { APIGatewayEvent, Context } from 'aws-lambda';

import app from './app';

// @ts-ignore - serverless-express doesn't have types
const serverless = require('serverless-http');

// Configure AWS SDK for local development
if (process.env['NODE_ENV'] !== 'production') {
  // Configure AWS SDK for local development
  process.env['AWS_REGION'] = process.env['AWS_REGION'] || 'us-east-1';
}

// Export the serverless handler
const handler = serverless(app);
module.exports.handler = async (event: APIGatewayEvent, context: Context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};
