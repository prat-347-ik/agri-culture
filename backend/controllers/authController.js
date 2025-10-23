import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import User from '../models/User.js';
import twilio from 'twilio';

// twilio things i think
const twilioAccSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(twilioAccSid, twilioAuthToken);
const twilioServiceSid = process.env.TWILIO_SERVICE_SID;

// Temporary storage for OTPs (In-memory, replace with DB/Redis in production)
const otpStorage = new Map();

// --- Updated Function: generateTokens ---
// Uses ACCESS_TOKEN_SECRET, consistent payload, accepts full user object
const generateTokens = (res, user) => {
    // Payload for the Access Token (Consistent)
    const payload = {
        phoneNumber: user.phone,
        userId: user._id, // Include userId
        role: user.role   // Include role
    };

    // Use ACCESS_TOKEN_SECRET for Access Token
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    // Use REFRESH_TOKEN_SECRET for Refresh Token
    const refreshToken = jwt.sign({ phoneNumber: user.phone }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Set Refresh Token Cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be true in production (HTTPS)
        sameSite: 'Strict', // Or 'None' if frontend/backend are diff domains
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return accessToken; // Return only the access token
};


// @desc    Register (request OTP for signup)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { phoneNumber, fullName } = req.body;

    if (!phoneNumber || !fullName) {
        return res.status(400).json({ message: 'Phone number and full name are required.' });
    }

    // Basic phone number validation (adjust regex as needed)
    if (!/^\d{10}$/.test(phoneNumber)) {
         return res.status(400).json({ message: 'Invalid phone number format (must be 10 digits).' });
    }

    try {
        const userExists = await User.findOne({ phone: phoneNumber });
        if (userExists) {
            return res.status(409).json({ message: 'User with this phone number already exists.' });
        }

        // Generate a 6-digit numeric OTP
        const otp = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        // Store OTP and user data temporarily
        otpStorage.set(phoneNumber, { otp, fullName, timestamp: Date.now() }); // Add timestamp for expiry

        console.log(`[SIGNUP OTP] for ${phoneNumber}: ${otp}`); // Log OTP for development/testing

        // In production, you would send the OTP via SMS here
        client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to:'+91'+phoneNumber, channel: 'sms', code: otp})
            .then(verification => console.log(verification.status))
            .catch(error => console.error("Twilio verification error:", error));

        res.status(200).json({ message: 'OTP sent successfully for signup verification (SMS or check console).' });

    } catch (error) {
        console.error("Error during signup OTP request:", error);
        res.status(500).json({ message: 'Server error during signup request.' });
    }
};


// @desc    Login (request OTP for login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { phoneNumber } = req.body;

     if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required.' });
    }
     if (!/^\d{10}$/.test(phoneNumber)) {
         return res.status(400).json({ message: 'Invalid phone number format (must be 10 digits).' });
    }

    try {
        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            // User not found, prompt them to register instead
            return res.status(404).json({ message: 'User not found. Please sign up first. upper' });
        }

        // Generate a 6-digit numeric OTP
        const otp = otpGenerator.generate(6, {
             digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        // Store OTP temporarily (overwrite any previous for this number)
        otpStorage.set(phoneNumber, { otp, timestamp: Date.now() }); // Add timestamp for expiry



        console.log(`[LOGIN OTP] for ${phoneNumber}: ${otp}`); // Log OTP for development/testing

        // In production, send OTP via SMS
        client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to:'+91'+phoneNumber, channel: 'sms', code: otp})
            .then(verification => console.log(verification.status))
            .catch(error => console.error("Twilio verification error:", error));

        res.status(200).json({ message: 'OTP sent successfully for login (SMS or check console).' });

    } catch (error) {
        console.error("Error during login OTP request:", error);
        res.status(500).json({ message: 'Server error during login request.' });
    }
};


// @desc    Verify OTP (for both signup and login)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
        return res.status(400).json({ message: 'Phone number and OTP code are required.' });
    }

    try {
        let isVerified = false;

        // First, try verifying the OTP with Twilio
        try {
            const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
                .verificationChecks
                .create({ to: '+91'+phoneNumber, code });

            if (verificationCheck.status === 'approved') {
                isVerified = true;
            }
        } catch (twilioError) {
            console.warn("Twilio verification failed, falling back to local OTP:", twilioError.message);
        }

        // If Twilio verification fails, fall back to locally stored OTP
        if (!isVerified) {
            const storedData = otpStorage.get(phoneNumber);

            // Check if the locally stored OTP exists and is not expired
            if (storedData && storedData.otp === code && (Date.now() - storedData.timestamp <= 5 * 60 * 1000)) {
                isVerified = true;
                // used to delete otp here, fails catastrophically if this is done
            } else {
                return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
            }
        }

        let user = await User.findOne({ phone: phoneNumber });

        // If user doesn't exist AND we have fullName from signup, create the user
        if (!user && otpStorage.has(phoneNumber)) {
            const storedData = otpStorage.get(phoneNumber);
            console.log("Stored data for user creation:", storedData);
            if (!storedData.fullName) {
                console.error("Full name is missing in stored data:", storedData);
            }
            if (storedData.fullName) {
                try {
                    user = await User.create({
                        fullName: storedData.fullName,
                        phone: phoneNumber
                        // Consider adding a default role: role: 'user'
                    });
                    console.log(`New user created: ${user.phone}`);
                } catch (creationError) {
                    console.error("Error creating user:", creationError);
                    return res.status(500).json({ message: 'Server error during user creation.' });
                }
            } else {
                return res.status(404).json({ message: 'User verification failed. Please try signing up.' });
            }
        } else if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up first. lower' });
        }

        otpStorage.delete(phoneNumber); //remove otp after all these shenanigans

        // --- Generate Tokens using updated function ---
        const accessToken = generateTokens(res, user); // Pass the full user object

        // Prepare user object to send back (exclude sensitive data)
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role, // Make sure User model has 'role'
            address: user.address // Include address if available
            // Add other necessary fields (age, gender, etc.) if they exist on the User model
        };

        res.status(200).json({
            message: 'OTP verified successfully',
            accessToken,
            user: userResponse // Send back the curated user object
        });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};


// @desc    Refresh access token
// @route   GET /api/auth/refresh
// @access  Public (requires httpOnly cookie)
export const refreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        return res.status(401).json({ message: 'Unauthorized - No refresh token cookie' });
    }
    const receivedRefreshToken = cookies.refreshToken;

    jwt.verify(
        receivedRefreshToken,
        process.env.REFRESH_TOKEN_SECRET, // Verify using REFRESH secret
        async (err, decoded) => {
            if (err) {
                console.error("Refresh token verification failed:", err.message);
                // Clear the potentially invalid cookie on verification failure
                res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
                return res.status(403).json({ message: 'Forbidden - Invalid refresh token' });
            }

            // Ensure decoded payload contains expected identifier (phoneNumber)
            if (!decoded || !decoded.phoneNumber) {
                 console.error("Invalid refresh token payload:", decoded);
                 res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
                return res.status(403).json({ message: 'Forbidden - Malformed refresh token' });
            }

            try {
                // Find user based on decoded token's phoneNumber
                const user = await User.findOne({ phone: decoded.phoneNumber }).select('-password'); // Exclude password

                if (!user) {
                    console.error(`User not found for refresh token (phone: ${decoded.phoneNumber})`);
                    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
                    return res.status(401).json({ message: 'Unauthorized - User associated with token not found' });
                }

                // Generate a new access token (using ACCESS secret and consistent payload)
                const newAccessToken = jwt.sign(
                    { phoneNumber: user.phone, userId: user._id, role: user.role },
                    process.env.ACCESS_TOKEN_SECRET, // Use ACCESS secret
                    { expiresIn: '15m' } // Standard expiry for access token
                );

                // Prepare user object to send back
                 const userResponse = {
                    _id: user._id,
                    fullName: user.fullName,
                    phone: user.phone,
                    role: user.role,
                    address: user.address
                };

                // Send back the new access token AND the updated user object
                res.json({ accessToken: newAccessToken, user: userResponse });

            } catch (dbError) {
                console.error("Error finding user during refresh:", dbError);
                return res.status(500).json({ message: 'Server error during token refresh' });
            }
        }
    );
};


// @desc    Logout user and clear cookie
// @route   POST /api/auth/logout
// @access  Public (doesn't need auth middleware, relies on cookie presence)
export const logoutUser = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        // No cookie, so nothing to clear, effectively already logged out server-side
        return res.sendStatus(204); // No Content
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Match settings used when setting cookie
        sameSite: 'Strict' // Match settings used when setting cookie
    });

    return res.status(200).json({ message: 'Logged out successfully' });
};

// Note: Removed the older, duplicate 'logout' function. 'logoutUser' is the correct one.
// Note: Removed 'requestOTP' as its logic is covered by 'registerUser' and 'loginUser'.

// @desc    Request an OTP for a user
// @route   POST /api/auth/request-otp
// @access  Public
export const requestOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // --- THIS IS THE FIX ---
    // 1. Find the user by phone number
    let user = await User.findOne({ phone });

    // 2. If the user does not exist, return an error.
    //    Do NOT create a new user.
    if (!user) {
      return res.status(404).json({ message: 'User not registered.' });
    }
    // --- END OF FIX ---

    // 3. If user exists, generate and save the OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    user.otp = otp;
    user.otpExpires = expiry;
    await user.save();

    // TODO: Implement actual SMS sending logic here
    console.log(`OTP for ${phone} is: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};