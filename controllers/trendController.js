import Trend from '../models/Trend.js';

// Fetch trends from database
export const getTrends = async (req, res) => {
  try {
    const trends = await Trend.find({}).sort({ popularity: -1 });
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new trends
export const addTrends = async (req, res) => {
  const { trends } = req.body; // Expect an array of trend objects
  try {
    await Trend.insertMany(trends);
    res.status(201).json({ message: 'Trends added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
