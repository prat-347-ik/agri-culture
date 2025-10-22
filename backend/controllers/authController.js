import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import User from '../models/User.js';

const otpStorage = new Map();

// This function is for JWTs, not OTPs, and is correct.
const generateTokens = (res, phoneNumber) => {
    const accessToken = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ phoneNumber }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return accessToken;
};

export const signup = async (req, res) => {
  const { phoneNumber, fullName } = req.body;

  if (!phoneNumber || !fullName) {
    return res.status(400).json({ message: 'Phone number and full name are required.' });
  }

  try {
    const userExists = await User.findOne({ phone: phoneNumber });
    if (userExists) {
      return res.status(409).json({ message: 'User with this phone number already exists.' });
    }

    // CORRECTED: Added lowerCaseAlphabets: false to ensure a numeric OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStorage.set(phoneNumber, { otp, fullName });
    console.log(`[SIGNUP OTP] for ${phoneNumber}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully for signup verification (check console).' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process signup request.' });
  }
};

export const login = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
        return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // CORRECTED: Added lowerCaseAlphabets: false to ensure a numeric OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStorage.set(phoneNumber, { otp });
    console.log(`[LOGIN OTP] for ${phoneNumber}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully for login (check console).' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process login request.' });
  }
};

export const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;
  const storedData = otpStorage.get(phoneNumber);

  if (storedData && storedData.otp === code) {
    otpStorage.delete(phoneNumber);
    let user = await User.findOne({ phone: phoneNumber });

    if (!user && storedData.fullName) {
        user = await User.create({
            fullName: storedData.fullName,
            phone: phoneNumber
        });
    }

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const accessToken = generateTokens(res, phoneNumber);
    // Send back some user info to the frontend if needed
    res.status(200).json({ 
        message: 'OTP verified successfully', 
        accessToken, 
        user: { fullName: user.fullName, phone: user.phone } 
    });

  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};

export const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token provided.' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token.' });
        
        const accessToken = jwt.sign({ phoneNumber: decoded.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    });
};

export const logout = (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// ... (at the end of the file, after your other functions)

// @desc    Logout user and clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use 'secure: true' in production
        sameSite: 'Strict'
    });
    return res.status(200).json({ message: 'Logged out successfully' });
};