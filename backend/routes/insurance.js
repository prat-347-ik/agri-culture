import express from 'express';
const router = express.Router();
import {
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
} from '../controllers/insuranceController.js';

// Import your auth middleware
import auth, { admin } from '../middleware/auth.js';

// @route   /api/insurance

// Public route for all logged-in users (uses 'auth')
router.route('/').get(auth, getAllPlans);

// Admin-only routes (uses 'auth' first, then 'admin')
router.route('/').post(auth, admin, createPlan);
router.route('/:id').put(auth, admin, updatePlan).delete(auth, admin, deletePlan);

export default router;