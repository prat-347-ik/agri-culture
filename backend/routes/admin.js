// File: backend/routes/admin.js

import express from 'express';
import { getAllUsers } from '../controllers/userController.js'; // Added .js
import auth ,{ admin } from '../middleware/auth.js'; // Added .js

const router = express.Router();

/**
 * @desc    Get all users and their listings (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
router.get('/users', auth, admin, getAllUsers);

// You can add other admin-specific routes here in the future
// e.g., router.delete('/users/:id', auth, admin, deleteUser);

export default router;