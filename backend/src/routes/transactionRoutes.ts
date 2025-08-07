import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';

const router = Router();

// GET /api/transactions - Get all transactions
router.get('/', transactionController.getAllTransactions.bind(transactionController));

// GET /api/transactions/token/:tokenId - Get transactions by token ID
router.get('/token/:tokenId', transactionController.getTransactionsByToken.bind(transactionController));

export default router; 