import {
  ApiResponse,
  CreateTokenRequest,
  Token,
  filterTokens,
  isToken,
} from '../types';
import { Request, Response } from 'express';

import Joi from 'joi';
import { databaseService } from '../services/database';

// Validation schemas
const createTokenSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  color: Joi.string().min(1).max(7).required(),
  icon: Joi.string().min(1).max(50).required(),
});

const updateTokenSchema = Joi.object({
  amount: Joi.number().integer().required(),
  description: Joi.string().max(500).required(),
});

export class TokenController {
  // Get all tokens
  async getAllTokens(_req: Request, res: Response): Promise<void> {
    try {
      const tokens = await databaseService.queryByType('token');
      const validTokens = filterTokens(tokens);
      const response: ApiResponse<Token[]> = {
        success: true,
        data: validTokens,
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting tokens:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get tokens',
      };
      res.status(500).json(response);
    }
  }

  // Create a new token
  async createToken(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createTokenSchema.validate(req.body);
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0]?.message || 'Validation error',
        };
        res.status(400).json(response);
        return;
      }

      const tokenData: CreateTokenRequest = value;
      const token = await databaseService.createToken(tokenData);

      const response: ApiResponse<Token> = {
        success: true,
        data: token,
        message: 'Token created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating token:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create token',
      };
      res.status(500).json(response);
    }
  }

  // Update a token
  async updateToken(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Token ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const { error, value } = updateTokenSchema.validate(req.body);
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0]?.message || 'Validation error',
        };
        res.status(400).json(response);
        return;
      }

      const token = await databaseService.getById(id);
      if (!token || !isToken(token)) {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      const updatedToken = await databaseService.update(id, value);
      if (!updatedToken || !isToken(updatedToken)) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update token',
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<Token> = {
        success: true,
        data: updatedToken,
        message: 'Token updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating token:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update token',
      };
      res.status(500).json(response);
    }
  }

  // Delete a token
  async deleteToken(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Token ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const token = await databaseService.getById(id);
      if (!token || !isToken(token)) {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      await databaseService.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Token deleted successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error deleting token:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete token',
      };
      res.status(500).json(response);
    }
  }

  // Earn tokens
  async earnTokens(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = updateTokenSchema.validate(req.body);
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0]?.message || 'Validation error',
        };
        res.status(400).json(response);
        return;
      }

      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Token ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const token = await databaseService.getById(id);
      if (!token || !isToken(token)) {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      const updatedToken = await databaseService.updateTokenCount(
        id,
        value.amount
      );
      if (!updatedToken) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update token count',
        };
        res.status(500).json(response);
        return;
      }

      // Create transaction record
      await databaseService.createTransaction({
        type: 'earn',
        tokenId: id,
        tokenName: token['name'],
        amount: value.amount,
        description: value.description,
      });

      const response: ApiResponse<Token> = {
        success: true,
        data: updatedToken,
        message: `Earned ${value.amount} tokens`,
      };
      res.json(response);
    } catch (error) {
      console.error('Error earning tokens:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to earn tokens',
      };
      res.status(500).json(response);
    }
  }

  // Spend tokens
  async spendTokens(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = updateTokenSchema.validate(req.body);
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0]?.message || 'Validation error',
        };
        res.status(400).json(response);
        return;
      }

      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Token ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const token = await databaseService.getById(id);
      if (!token || !isToken(token)) {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      if (token['count'] < value.amount) {
        const response: ApiResponse = {
          success: false,
          error: 'Insufficient tokens',
        };
        res.status(400).json(response);
        return;
      }

      const updatedToken = await databaseService.updateTokenCount(
        id,
        -value.amount
      );
      if (!updatedToken) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update token count',
        };
        res.status(500).json(response);
        return;
      }

      // Create transaction record
      await databaseService.createTransaction({
        type: 'spend',
        tokenId: id,
        tokenName: token['name'],
        amount: value.amount,
        description: value.description,
      });

      const response: ApiResponse<Token> = {
        success: true,
        data: updatedToken,
        message: `Spent ${value.amount} tokens`,
      };
      res.json(response);
    } catch (error) {
      console.error('Error spending tokens:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to spend tokens',
      };
      res.status(500).json(response);
    }
  }
}

export const tokenController = new TokenController();
