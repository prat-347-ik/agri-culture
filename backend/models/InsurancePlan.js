import mongoose from 'mongoose';

const InsurancePlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, 'Please provide a plan name'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Please provide the plan provider'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify the type'],
      enum: ['Government', 'Private'], // Type of plan
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Crop', 'Machinery', 'Other'], // Category for filtering
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    applyLink: {
      type: String,
      required: [true, 'Please provide the external application URL'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.model('InsurancePlan', InsurancePlanSchema);