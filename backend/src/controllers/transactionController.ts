import { ApiResponse, Transaction, filterTransactions } from '../types';
import { Request, Response } from 'express';

import { databaseService } from '../services/database';

export class TransactionController {
  // Get all transactions
  async getAllTransactions(_req: Request, res: Response): Promise<void> {
    try {
      const transactions = await databaseService.queryByType('transaction');
      const validTransactions = filterTransactions(transactions);
      const response: ApiResponse<Transaction[]> = {
        success: true,
        data: validTransactions,
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
      if (!tokenId) {
        const response: ApiResponse = {
          success: false,
          error: 'Token ID is required',
        };
        res.status(400).json(response);
        return;
      }

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
      const validTransactions = filterTransactions(transactions);
      const response: ApiResponse<Transaction[]> = {
        success: true,
        data: validTransactions,
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting transactions by token:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get transactions by token',
      };
      res.status(500).json(response);
    }
  }
}

export const transactionController = new TransactionController();
