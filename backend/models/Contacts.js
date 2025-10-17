import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  role: String,
  name: String,
  phone: String,
  email: String,
  category: String,
});

export default mongoose.model('Contact', ContactSchema);