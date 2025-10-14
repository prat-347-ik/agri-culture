import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
  }
});

export default mongoose.model('File', FileSchema);
