import { Router } from 'express';
import rewardRoutes from './rewardRoutes';
import tokenRoutes from './tokenRoutes';
import transactionRoutes from './transactionRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Reward Jar API is running!',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/tokens', tokenRoutes);
router.use('/rewards', rewardRoutes);
router.use('/transactions', transactionRoutes);

export default router; 