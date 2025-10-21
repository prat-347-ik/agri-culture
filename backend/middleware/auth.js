import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // 1. Import the User model

// 2. Make the function async to perform a database lookup
const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token or malformed token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user in the database using the phone number from the token
    // This confirms the user actually exists.
    const user = await User.findOne({ phone: decoded.phoneNumber });
    if (!user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }

    // 4. Attach the user's unique MongoDB _id to the request object
    // This is what your controllers will use.
    req.user = { id: user._id };

    next();
  } catch (err) {
    // This handles expired tokens so the frontend can refresh them
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ msg: 'Token expired' });
    }
    // This handles any other invalid token errors
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;