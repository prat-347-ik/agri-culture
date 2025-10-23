import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  roleKey: { // Key for translation (e.g., 'role_taluka')
    type: String,
    required: true,
  },
  name: { // Specific name (e.g., 'Main Taluka Office')
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  category: { // Government, Emergency, Services
    type: String,
    required: true,
    enum: ['Government', 'Emergency', 'Services', 'Other'],
  },
  address: { // Full address string
    type: String,
  },
  district: { // For location-based filtering
    type: String,
    index: true, // Index for faster querying
  },
  taluka: { // For location-based filtering
    type: String,
    index: true,
  },
  website: {
    type: String,
  },
  operatingHours: {
    type: String, // e.g., "Mon-Fri 9am-5pm"
  },
  // Optional: Add GeoJSON for precise map location
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: { // [longitude, latitude]
      type: [Number],
    },
  },
}, { timestamps: true });

// Optional: Index for combined district/taluka searches
contactSchema.index({ district: 1, taluka: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;