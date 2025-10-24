import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  },
  district: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  },
  market: {
    type: String,
    required: true,
    index: true
  },
  commodity: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  },
  variety: {
    type: String,
    required: true
  },
  grade: {
    type: String
  },
  arrivalDate: {
    type: Date,
    required: true,
    index: true // Add index for sorting and filtering by date
  },
  minPrice: {
    type: Number,
    required: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  modalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create a compound index for common filter combinations
marketPriceSchema.index({ state: 1, district: 1, commodity: 1, arrivalDate: -1 });

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

export default MarketPrice;