import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import User from '../models/User.js';

// import twilio from 'twilio';

// Twilio credentials from environment variables (COMMENTED OUT)
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken);

// Temporary storage for OTPs. In a production app, use a database like Redis.
const otpStorage = new Map();

// @desc    Register a new user and send OTP
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

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStorage.set(phoneNumber, { otp, fullName });

    // --- Twilio code commented out ---
    // await client.messages.create({
    //   body: `Your Agri-Culture verification code is: ${otp}`,
    //   from: twilioPhoneNumber,
    //   to: phoneNumber,
    // });

    // Log OTP to console for testing
    console.log(`[SIGNUP OTP] for ${phoneNumber}: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully for signup verification (check console).' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process signup request.' });
  }
};

// @desc    Login a user and send OTP
export const login = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
        return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStorage.set(phoneNumber, { otp });

    // --- Twilio code commented out ---
    // await client.messages.create({
    //   body: `Your Agri-Culture login code is: ${otp}`,
    //   from: twilioPhoneNumber,
    //   to: phoneNumber,
    // });

    // Log OTP to console for testing
    console.log(`[LOGIN OTP] for ${phoneNumber}: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully for login (check console).' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process login request.' });
  }
};

// @desc    Verify OTP and return a JWT for authenticated sessions
export const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;

  const storedData = otpStorage.get(phoneNumber);

  if (storedData && storedData.otp === code) {
    otpStorage.delete(phoneNumber);

    if (storedData.fullName) {
        await User.create({
            fullName: storedData.fullName,
            phone: phoneNumber
        });
    }

    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'OTP verified successfully', token });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};