import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // <--- 1. IMPORT BCRYPT

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  gender: String,
  address: String,
  district: String,
  taluka: String,
  village: String,
  pincode: String,

  role: {
    type: String,
    enum: ['user', 'admin'], // Restricts role to one of these two values
    default: 'user',        // All new users will be 'user' by default
  },
  password: {
    type: String,
    select: false, // Hides password from default query results
  },

  lastLoginAt: { type: Date },
  
  settings: {
    language: {
      type: String,
      default: 'en',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },

  // --- ADD THIS ---
  settings: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'mr']
    }
  },
  // --- END ADD ---
  // Add the new location field
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
}, { timestamps: true });

// Add the 2dsphere index for geospatial queries
UserSchema.index({ location: '2dsphere' });

export default mongoose.model('User', UserSchema);