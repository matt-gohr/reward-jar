export interface Token extends DynamoDBItem {
  name: string;
  count: number;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reward extends DynamoDBItem {
  name: string;
  description: string;
  tokenCost: number;
  tokenType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction extends DynamoDBItem {
  transactionType: 'earn' | 'spend';
  tokenId: string;
  tokenName: string;
  amount: number;
  description: string;
  timestamp: string;
}

export interface DynamoDBItem {
  id: string;
  type: 'token' | 'reward' | 'transaction';
  [key: string]: any;
}

// Type guards for safe type conversion
export function isToken(item: DynamoDBItem): item is Token {
  return (
    item.type === 'token' &&
    typeof item['name'] === 'string' &&
    typeof item['count'] === 'number' &&
    typeof item['color'] === 'string' &&
    typeof item['icon'] === 'string' &&
    typeof item['createdAt'] === 'string' &&
    typeof item['updatedAt'] === 'string'
  );
}

export function isReward(item: DynamoDBItem): item is Reward {
  return (
    item.type === 'reward' &&
    typeof item['name'] === 'string' &&
    typeof item['description'] === 'string' &&
    typeof item['tokenCost'] === 'number' &&
    typeof item['tokenType'] === 'string' &&
    typeof item['isActive'] === 'boolean' &&
    typeof item['createdAt'] === 'string' &&
    typeof item['updatedAt'] === 'string'
  );
}

export function isTransaction(item: DynamoDBItem): item is Transaction {
  return (
    item.type === 'transaction' &&
    (item['transactionType'] === 'earn' ||
      item['transactionType'] === 'spend') &&
    typeof item['tokenId'] === 'string' &&
    typeof item['tokenName'] === 'string' &&
    typeof item['amount'] === 'number' &&
    typeof item['description'] === 'string' &&
    typeof item['timestamp'] === 'string'
  );
}

// Helper functions to filter arrays by type
export function filterTokens(items: DynamoDBItem[]): Token[] {
  return items.filter(isToken);
}

export function filterRewards(items: DynamoDBItem[]): Reward[] {
  return items.filter(isReward);
}

export function filterTransactions(items: DynamoDBItem[]): Transaction[] {
  return items.filter(isTransaction);
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TokenFormData {
  name: string;
  color: string;
  icon: string;
}

export interface RewardFormData {
  name: string;
  description: string;
  tokenCost: number;
  tokenType: string;
}

export interface TokenUpdateData {
  amount: number;
  description: string;
}

export interface CreateTokenRequest {
  name: string;
  color: string;
  icon: string;
}

export interface CreateRewardRequest {
  name: string;
  description: string;
  tokenCost: number;
  tokenType: string;
}

export interface UpdateTokenRequest {
  amount: number;
  description: string;
}
