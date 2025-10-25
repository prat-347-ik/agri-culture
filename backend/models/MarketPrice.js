import mongoose from 'mongoose';

const MarketPriceSchema = new mongoose.Schema({ // Renamed to MarketPriceSchema
  state: {
    type: String,
    required: true,
    index: true 
  },
  district: {
    type: String,
    required: true,
    index: true 
  },
  market: {
    type: String,
    required: true,
    index: true
  },
  commodity: {
    type: String,
    required: true,
    index: true 
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
    index: true 
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
  timestamps: true 
});

// Create a compound index for common filter combinations
MarketPriceSchema.index({ state: 1, district: 1, commodity: 1, arrivalDate: -1 });

// --- THIS IS THE FIX ---
// Compile the schema into a model and export the model
const MarketPrice = mongoose.model('MarketPrice', MarketPriceSchema);
export default MarketPrice;