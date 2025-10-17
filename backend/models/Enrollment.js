import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bidding', 'selling', 'renting'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  data: {
    type: Map,
    of: String,
  },
  images: [{
    url: String,
    cloudinary_id: String,
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Enrollment', EnrollmentSchema);