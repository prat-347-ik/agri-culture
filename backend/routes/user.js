import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  deleteUserAccount,
} from '../controllers/userController.js';// TODO: Add authentication middleware

import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get the profile of the currently logged-in user
router.get('/profile',auth, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update the profile of the currently logged-in user
router.put('/profile',auth, updateUserProfile);

// Other routes remain as placeholders for now
// @route   PUT /api/user/settings
// @desc    Update user settings
router.put('/settings', auth, updateUserSettings);
// @route   DELETE /api/user/account
// @desc    Delete the user's account
router.delete('/account', auth, deleteUserAccount);
export default router;