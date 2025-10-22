import express from 'express';
import { signup, login, verifyOtp, refreshToken, logoutUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyOtp);

// @route   POST /api/auth/refresh
// @desc    Refresh the access token using a refresh token
router.post('/refresh', refreshToken);

// @route   POST /api/auth/logout
// @desc    Log the user out by clearing the cookie
router.post('/logout', logoutUser);
export default router;