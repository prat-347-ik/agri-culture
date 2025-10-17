import mongoose from 'mongoose';

const MarketItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  category: {
    type: String,
    enum: ['buy', 'bid', 'rent'],
    required: true,
  },
  // Fields specific to bidding
  startingBid: Number,
  currentBid: Number,
  auctionEndDate: Date,
  // Fields specific to renting
  rentalPeriod: String, // e.g., 'daily', 'monthly'
  images: [{
    url: String,
    cloudinary_id: String,
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('MarketItem', MarketItemSchema);