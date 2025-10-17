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
}, { timestamps: true });

export default mongoose.model('User', UserSchema);