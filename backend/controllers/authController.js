import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Temporary storage for OTPs. In a production app, use a database like Redis.
const otpStorage = new Map();

// @desc    Register a new user and send OTP
export const signup = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStorage.set(phoneNumber, otp);

    await client.messages.create({
      body: `Your Agri-Culture verification code is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// @desc    Login a user and send OTP
export const login = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Here you would typically check if the user exists in your database
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStorage.set(phoneNumber, otp);

    await client.messages.create({
      body: `Your Agri-Culture login code is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// @desc    Verify OTP and return a JWT for authenticated sessions
export const verifyOtp = (req, res) => {
  const { phoneNumber, code } = req.body;

  const storedOtp = otpStorage.get(phoneNumber);

  if (storedOtp === code) {
    otpStorage.delete(phoneNumber);

    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'OTP verified successfully', token });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};