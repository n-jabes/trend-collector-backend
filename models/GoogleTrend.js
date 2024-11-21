import mongoose from "mongoose";

const TrendSchema = new mongoose.Schema({
  keyword: { type: String, required: true }, // The main search keyword
  formattedKeyword: String, // Short description or snippet from articles
  popularity: Number, // Number indicating current search traffic (latest popularity)
  region: { type: String, required: true }, // Region associated with the trend
  updated_at: { type: Date, default: Date.now }, // Last update timestamp
  trendScore: { type: Number, required: true }, // Trend score (based on trend growth)
  timeline_data: [
    {
      date: { type: String, required: true }, // Date for the trend data
      popularity: { type: Number, required: true }, // Popularity on this date
    },
  ],
  relatedQueries: [
    {
      query: { type: String, required: true }, // Related search term
      volume: { type: Number, required: true }, // Popularity or search volume for the related term
    },
  ],
  newsMentions: { type: Number, default: 0 }, // Number of news mentions for the keyword
});

export default mongoose.model("GoogleTrend", TrendSchema);
