// src/routes.js
import express from 'express';
import {
  getMultipleTopicsData,
  getSingleTopicData,
} from '../controllers/topicController.js';
import GoogleTrend from '../models/GoogleTrend.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const trends = await GoogleTrend.find();
    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends from database:', error);
    res.status(500).send('Internal server error');
  }
});

// Route for getting data for multiple topics
router.get('/topics', getMultipleTopicsData);

// Route for getting data for a single topic
router.get('/topics/:topic', getSingleTopicData);

export default router;
