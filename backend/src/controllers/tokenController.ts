import { ApiResponse, CreateTokenRequest, Token, UpdateTokenRequest } from '../types';
import { Request, Response } from 'express';

import Joi from 'joi';
import { databaseService } from '../services/database';

// Validation schemas
const createTokenSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
  icon: Joi.string().min(1).max(10).required(),
});

const updateTokenSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
  description: Joi.string().max(200).optional(),
});

export class TokenController {
  // Get all tokens
  async getAllTokens(req: Request, res: Response): Promise<void> {
    try {
      const tokens = await databaseService.queryByType('token');
      const response: ApiResponse<Token[]> = {
        success: true,
        data: tokens as Token[],
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
          error: error.details[0].message,
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
      const { error, value } = createTokenSchema.validate(req.body);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0].message,
        };
        res.status(400).json(response);
        return;
      }

      const token = await databaseService.getById(id);
      if (!token || token.type !== 'token') {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      const updatedToken = await databaseService.update(id, value);
      const response: ApiResponse<Token> = {
        success: true,
        data: updatedToken as Token,
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
      
      const token = await databaseService.getById(id);
      if (!token || token.type !== 'token') {
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

  // Add tokens to a jar
  async addTokens(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = updateTokenSchema.validate(req.body);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0].message,
        };
        res.status(400).json(response);
        return;
      }

      const tokenData: UpdateTokenRequest = value;
      const token = await databaseService.getById(id);
      
      if (!token || token.type !== 'token') {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      // Update token count
      const updatedToken = await databaseService.updateTokenCount(id, tokenData.amount);
      
      // Create transaction record
      await databaseService.createTransaction({
        type: 'earn',
        tokenId: id,
        tokenName: token.name,
        amount: tokenData.amount,
        description: tokenData.description || 'Tokens added',
      });

      const response: ApiResponse<Token> = {
        success: true,
        data: updatedToken!,
        message: `${tokenData.amount} tokens added successfully`,
      };
      res.json(response);
    } catch (error) {
      console.error('Error adding tokens:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to add tokens',
      };
      res.status(500).json(response);
    }
  }

  // Spend tokens from a jar
  async spendTokens(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = updateTokenSchema.validate(req.body);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0].message,
        };
        res.status(400).json(response);
        return;
      }

      const tokenData: UpdateTokenRequest = value;
      const token = await databaseService.getById(id);
      
      if (!token || token.type !== 'token') {
        const response: ApiResponse = {
          success: false,
          error: 'Token not found',
        };
        res.status(404).json(response);
        return;
      }

      // Check if enough tokens are available
      if (token.count < tokenData.amount) {
        const response: ApiResponse = {
          success: false,
          error: 'Not enough tokens available',
        };
        res.status(400).json(response);
        return;
      }

      // Update token count (negative amount for spending)
      const updatedToken = await databaseService.updateTokenCount(id, -tokenData.amount);
      
      // Create transaction record
      await databaseService.createTransaction({
        type: 'spend',
        tokenId: id,
        tokenName: token.name,
        amount: tokenData.amount,
        description: tokenData.description || 'Tokens spent',
      });

      const response: ApiResponse<Token> = {
        success: true,
        data: updatedToken!,
        message: `${tokenData.amount} tokens spent successfully`,
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