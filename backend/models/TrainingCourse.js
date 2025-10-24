import mongoose from 'mongoose';

const TrainingCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    provider: {
      type: String,
      required: [true, 'Please provide the course provider (e.g., Government of India)'],
    },
    applyLink: {
      type: String,
      required: [true, 'Please provide the external application URL'],
      validate: {
        validator: (v) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v),
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model('TrainingCourse', TrainingCourseSchema);