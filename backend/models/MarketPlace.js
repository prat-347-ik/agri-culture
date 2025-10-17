import mongoose from 'mongoose';

const MapLocationSchema = new mongoose.Schema({
  name: String,
  type: String,
  lat: Number,
  lng: Number,
  description: String,
  status: String,
  icon: String,
});

export default mongoose.model('MapLocation', MapLocationSchema);