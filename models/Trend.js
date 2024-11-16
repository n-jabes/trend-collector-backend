import mongoose from 'mongoose';

const trendSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  description: { type: String },
  popularity: { type: Number, required: true },
  time: { type: Date, required: true },
  category: { type: String },
  source: { type: String },
});

const Trend = mongoose.model('Trend', trendSchema);

export default Trend;
