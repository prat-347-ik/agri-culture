import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Machineries', 'Produces', 'Services'],
  },
  // Add the new listingType field
  listingType: {
    type: String,
    enum: ['Rent', 'Sale'],
    // Only required if the category is 'Machineries'
    required: function() {
      return this.category === 'Machineries';
    }
  },
  
  // New field for Produce
  rate_unit: {
      type: String,
      enum: ['kg', 'ton'],
      required: function() {
          // Required only for Produces
          return this.category === 'Produces';
      }
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  // Add the new images field
  images: {
    type: [String],
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Listing', ListingSchema);