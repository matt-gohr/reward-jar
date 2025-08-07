import { ApiResponse, Transaction } from '../types';
import { Request, Response } from 'express';

import { databaseService } from '../services/database';

export class TransactionController {
  // Get all transactions
  async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await databaseService.queryByType('transaction');
      const response: ApiResponse<Transaction[]> = {
        success: true,
        data: transactions as Transaction[],
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting transactions:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get transactions',
      };
      res.status(500).json(response);
    }
  }

  // Get transactions by token ID
  async getTransactionsByToken(req: Request, res: Response): Promise<void> {
    try {
      const { tokenId } = req.params;
      
      // Verify that the token exists
      const token = await databaseService.getById(tokenId);
      if (!token || token.type !== 'token') {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      const transactions = await databaseService.queryByTokenId(tokenId);
      const response: ApiResponse<Transaction[]> = {
        success: true,
        data: transactions as Transaction[],
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting transactions by token:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get transactions',
      };
      res.status(500).json(response);
    }
  }
}

export const transactionController = new TransactionController(); 