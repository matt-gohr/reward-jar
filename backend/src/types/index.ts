export interface Token {
  id: string;
  name: string;
  count: number;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  tokenCost: number;
  tokenType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
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