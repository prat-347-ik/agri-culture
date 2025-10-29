import mongoose from 'mongoose';
import geocoder from '../utils/geocoder.js'; // <-- 1. Import the geocoder

const contactSchema = new mongoose.Schema({
  // ... (all your existing fields like roleKey, name, phone, etc.)
  roleKey: {
    type: String,
    required: true,
  },
  name: {
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
  category: {
    type: String,
    required: true,
    enum: ['Government', 'Emergency', 'Services', 'Other'],
  },
  address: { // Full address string
    type: String,
  },
  district: {
    type: String,
    index: true,
  },
  taluka: {
    type: String,
    index: true,
  },
  website: {
    type: String,
  },
  operatingHours: {
    type: String,
  },
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

contactSchema.index({ district: 1, taluka: 1 });

// --- 2. Add Pre-Save Hook for Geocoding ---
contactSchema.pre('save', async function (next) {
  // Check if the address was modified, or if it's a new contact with an address
  if (!this.isModified('address') || !this.address) {
    return next();
  }

  try {
    const loc = await geocoder.geocode(this.address);
    
    // Check if geocoder found a result
    if (loc && loc.length > 0) {
      this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
      };
    } else {
      // Could not geocode, set empty coordinates
      this.location = {
        type: 'Point',
        coordinates: [],
      };
      console.warn(`Could not geocode address: ${this.address}`);
    }
    next();
  } catch (err) {
    console.error('Geocoder error:', err);
    // Don't block saving, just proceed without coordinates
    this.location = {
      type: 'Point',
      coordinates: [],
    };
    next();
  }
});
// ------------------------------------------

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;