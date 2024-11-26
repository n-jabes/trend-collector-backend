import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js'; // Import the DB connection
import { fetchProductTrendsJob } from './jobs/fetchProductTrendsJob.js';
import { getProducts } from './controllers/productController.js'; // Named import

dotenv.config();

// Initialize the app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());

// Schedule the data fetching job to run at midnight every day
cron.schedule('0 0 * * *', fetchProductTrendsJob);

// Routes
app.get('/api/products', getProducts); // Using the controller method

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
