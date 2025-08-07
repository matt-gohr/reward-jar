import { Router } from 'express';
import { rewardController } from '../controllers/rewardController';

const router = Router();

// GET /api/rewards - Get all rewards
router.get('/', rewardController.getAllRewards.bind(rewardController));

// POST /api/rewards - Create a new reward
router.post('/', rewardController.createReward.bind(rewardController));

// PUT /api/rewards/:id - Update a reward
router.put('/:id', rewardController.updateReward.bind(rewardController));

// DELETE /api/rewards/:id - Delete a reward
router.delete('/:id', rewardController.deleteReward.bind(rewardController));

// PATCH /api/rewards/:id/toggle - Toggle reward active status
router.patch('/:id/toggle', rewardController.toggleRewardActive.bind(rewardController));

export default router; 