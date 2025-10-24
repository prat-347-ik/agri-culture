import mongoose from 'mongoose';

const CropCalendarEventSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Please provide a crop name'],
      trim: true,
    },
    activity: {
      type: String,
      required: [true, 'Please provide an activity (e.g., Planting, Harvest)'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    region: {
      type: String,
      trim: true,
      default: 'General', // e.g., 'Konkan', 'Vidarbha', 'General'
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

// Validate that endDate is after startDate
CropCalendarEventSchema.pre('save', function (next) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date.'));
  } else {
    next();
  }
});

export default mongoose.model('CropCalendarEvent', CropCalendarEventSchema);