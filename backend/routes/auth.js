import express from 'express';
const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user and send OTP
router.post('/signup', /* ... Controller logic here ... */);

// @route   POST /api/auth/login
// @desc    Login a user and send OTP
router.post('/login', /* ... Controller logic here ... */);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and return a JWT for authenticated sessions
router.post('/verify-otp', /* ... Controller logic here ... */);

export default router;