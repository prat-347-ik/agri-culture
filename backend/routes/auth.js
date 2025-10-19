import express from 'express';
import { signup, login, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Log in a user by sending an OTP
router.post('/login', login);

// @route   POST /api/auth/verify
// @desc    Verify OTP and return a JWT
router.post('/verify', verifyOtp);

export default router;