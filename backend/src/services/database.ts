import { DynamoDBItem, Reward, Token, Transaction } from '../types';

import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'reward-jar-api-dev';

export class DatabaseService {
  // Generic CRUD operations
  async create(item: DynamoDBItem): Promise<DynamoDBItem> {
    const timestamp = new Date().toISOString();
    const newItem = {
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: newItem,
    }).promise();

    return newItem;
  }

  async getById(id: string): Promise<DynamoDBItem | null> {
    const result = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { id },
    }).promise();

    return result.Item || null;
  }

  async update(id: string, updates: Partial<DynamoDBItem>): Promise<DynamoDBItem | null> {
    const timestamp = new Date().toISOString();
    const updateExpression = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    // Build update expression
    Object.keys(updates).forEach((key) => {
      if (key !== 'id' && key !== 'type') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updates[key];
      }
    });

    // Always update the updatedAt timestamp
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = timestamp;

    const result = await dynamoDB.update({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }).promise();

    return result.Attributes as DynamoDBItem || null;
  }

  async delete(id: string): Promise<boolean> {
    await dynamoDB.delete({
      TableName: TABLE_NAME,
      Key: { id },
    }).promise();

    return true;
  }

  async queryByType(type: string): Promise<DynamoDBItem[]> {
    const result = await dynamoDB.query({
      TableName: TABLE_NAME,
      IndexName: 'type-index',
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': type,
      },
    }).promise();

    return result.Items || [];
  }

  async queryByTokenId(tokenId: string): Promise<DynamoDBItem[]> {
    const result = await dynamoDB.query({
      TableName: TABLE_NAME,
      IndexName: 'tokenId-index',
      KeyConditionExpression: '#tokenId = :tokenId',
      ExpressionAttributeNames: {
        '#tokenId': 'tokenId',
      },
      ExpressionAttributeValues: {
        ':tokenId': tokenId,
      },
    }).promise();

    return result.Items || [];
  }

  // Token-specific operations
  async createToken(tokenData: { name: string; color: string; icon: string }): Promise<Token> {
    const token: DynamoDBItem = {
      id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'token',
      name: tokenData.name,
      count: 0,
      color: tokenData.color,
      icon: tokenData.icon,
    };

    const result = await this.create(token);
    return result as Token;
  }

  async updateTokenCount(id: string, amount: number): Promise<Token | null> {
    const token = await this.getById(id);
    if (!token || token.type !== 'token') {
      return null;
    }

    const newCount = Math.max(0, token.count + amount);
    const result = await this.update(id, { count: newCount });
    return result as Token;
  }

  // Reward-specific operations
  async createReward(rewardData: { name: string; description: string; tokenCost: number; tokenType: string }): Promise<Reward> {
    const reward: DynamoDBItem = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'reward',
      name: rewardData.name,
      description: rewardData.description,
      tokenCost: rewardData.tokenCost,
      tokenType: rewardData.tokenType,
      isActive: true,
    };

    const result = await this.create(reward);
    return result as Reward;
  }

  async toggleRewardActive(id: string): Promise<Reward | null> {
    const reward = await this.getById(id);
    if (!reward || reward.type !== 'reward') {
      return null;
    }

    const result = await this.update(id, { isActive: !reward.isActive });
    return result as Reward;
  }

  // Transaction-specific operations
  async createTransaction(transactionData: {
    type: 'earn' | 'spend';
    tokenId: string;
    tokenName: string;
    amount: number;
    description: string;
  }): Promise<Transaction> {
    const transaction: DynamoDBItem = {
      id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'transaction',
      ...transactionData,
      timestamp: new Date().toISOString(),
    };

    const result = await this.create(transaction);
    return result as Transaction;
  }
}

export const databaseService = new DatabaseService(); 