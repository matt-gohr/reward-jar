import {
  ApiResponse,
  CreateRewardRequest,
  Reward,
  filterRewards,
  isReward,
  isToken,
} from '../types';
import { Request, Response } from 'express';

import Joi from 'joi';
import { databaseService } from '../services/database';

// Validation schemas
const createRewardSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  tokenCost: Joi.number().integer().min(1).required(),
  tokenType: Joi.string().min(1).required(),
});

export class RewardController {
  // Get all rewards
  async getAllRewards(_req: Request, res: Response): Promise<void> {
    try {
      const rewards = await databaseService.queryByType('reward');
      const validRewards = filterRewards(rewards);
      const response: ApiResponse<Reward[]> = {
        success: true,
        data: validRewards,
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting rewards:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get rewards',
      };
      res.status(500).json(response);
    }
  }

  // Create a new reward
  async createReward(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createRewardSchema.validate(req.body);
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0]?.message || 'Validation error',
        };
        res.status(400).json(response);
        return;
      }

      const rewardData: CreateRewardRequest = value;

      // Verify that the token type exists
      const token = await databaseService.getById(rewardData.tokenType);
      if (!token || !isToken(token)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid token type',
        };
        res.status(400).json(response);
        return;
      }

      const reward = await databaseService.createReward(rewardData);

      const response: ApiResponse<Reward> = {
        success: true,
        data: reward,
        message: 'Reward created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating reward:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create reward',
      };
      res.status(500).json(response);
    }
  }

  // Update a reward
  async updateReward(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Reward ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const { error, value } = createRewardSchema.validate(req.body);

      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0]?.message || 'Validation error',
        };
        res.status(400).json(response);
        return;
      }

      const reward = await databaseService.getById(id);
      if (!reward || !isReward(reward)) {
        const response: ApiResponse = {
          success: false,
          error: 'Reward not found',
        };
        res.status(404).json(response);
        return;
      }

      // Verify that the token type exists if it's being changed
      if (value.tokenType !== reward.tokenType) {
        const token = await databaseService.getById(value.tokenType);
        if (!token || !isToken(token)) {
          const response: ApiResponse = {
            success: false,
            error: 'Invalid token type',
          };
          res.status(400).json(response);
          return;
        }
      }

      const updatedReward = await databaseService.update(id, value);
      if (!updatedReward || !isReward(updatedReward)) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update reward',
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<Reward> = {
        success: true,
        data: updatedReward,
        message: 'Reward updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating reward:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update reward',
      };
      res.status(500).json(response);
    }
  }

  // Delete a reward
  async deleteReward(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Reward ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const reward = await databaseService.getById(id);
      if (!reward || !isReward(reward)) {
        const response: ApiResponse = {
          success: false,
          error: 'Reward not found',
        };
        res.status(404).json(response);
        return;
      }

      await databaseService.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Reward deleted successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error deleting reward:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete reward',
      };
      res.status(500).json(response);
    }
  }

  // Toggle reward active status
  async toggleRewardActive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Reward ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const reward = await databaseService.getById(id);
      if (!reward || !isReward(reward)) {
        const response: ApiResponse = {
          success: false,
          error: 'Reward not found',
        };
        res.status(404).json(response);
        return;
      }

      const updatedReward = await databaseService.toggleRewardActive(id);
      if (!updatedReward) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to toggle reward status',
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<Reward> = {
        success: true,
        data: updatedReward,
        message: `Reward ${updatedReward.isActive ? 'activated' : 'deactivated'} successfully`,
      };
      res.json(response);
    } catch (error) {
      console.error('Error toggling reward:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to toggle reward status',
      };
      res.status(500).json(response);
    }
  }
}

export const rewardController = new RewardController();
