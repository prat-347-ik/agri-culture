import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/dashboardController.js';
import auth, { admin } from '../middleware/auth.js';

// This is the single endpoint for our dashboard
router.route('/stats').get(auth, admin, getDashboardStats);

export default router;