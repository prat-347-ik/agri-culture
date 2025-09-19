import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Placeholder admin route to demonstrate structure
router.get('/stats', authMiddleware, (req, res) => {
  res.json({ users: 'n/a', items: 'n/a' });
});

export default router;


