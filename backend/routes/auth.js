import express from 'express';
// Import the *correctly named* controller functions
import {
    registerUser, // Renamed from signup in controller
    loginUser,    // Renamed from login in controller
    verifyOTP,    // Renamed from verifyOtp in controller
    requestOtp,   // If needed in future
    refreshToken,
    logoutUser
} from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Request OTP for user registration
// @access  Public
router.post('/signup', registerUser); // Use registerUser, changed path

// @route   POST /api/auth/login
// @desc    Request OTP for user login
// @access  Public
router.post('/login', loginUser); // Use loginUser

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for login or registration completion
// @access  Public
router.post('/verify', verifyOTP); // Use verifyOTP, changed path

// @route   GET /api/auth/refresh
// @desc    Refresh the access token using the httpOnly refresh token cookie
// @access  Public (requires cookie)
// Changed to GET as it retrieves a new token based on existing cookie state

router.post('/request-otp', requestOtp); // If needed in future
router.get('/refresh', refreshToken);

// @route   POST /api/auth/logout
// @desc    Log the user out by clearing the refresh token cookie
// @access  Public
router.post('/logout', logoutUser);

export default router;