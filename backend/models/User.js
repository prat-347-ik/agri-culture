import mongoose from 'mongoose';

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