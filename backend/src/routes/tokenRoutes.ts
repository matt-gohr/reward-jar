import { Router } from 'express';
import { tokenController } from '../controllers/tokenController';

const router = Router();

// GET /api/tokens - Get all tokens
router.get('/', tokenController.getAllTokens.bind(tokenController));

// POST /api/tokens - Create a new token
router.post('/', tokenController.createToken.bind(tokenController));

// PUT /api/tokens/:id - Update a token
router.put('/:id', tokenController.updateToken.bind(tokenController));

// DELETE /api/tokens/:id - Delete a token
router.delete('/:id', tokenController.deleteToken.bind(tokenController));

// POST /api/tokens/:id/add - Add tokens to a jar
router.post('/:id/add', tokenController.addTokens.bind(tokenController));

// POST /api/tokens/:id/spend - Spend tokens from a jar
router.post('/:id/spend', tokenController.spendTokens.bind(tokenController));

export default router; 