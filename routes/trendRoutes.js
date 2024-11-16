import express from 'express';
import { getTrends, addTrends } from '../controllers/trendController.js';

const router = express.Router();

// GET: Fetch all trends
router.get('/', getTrends);

// POST: Add new trends
router.post('/add', addTrends);

export default router;
