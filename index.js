import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import trendRoutes from './routes/trendRoutes.js';
import cors from 'cors';
import { fetchTrendingNews } from './services/newsAPITrends.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
//fetch the data from newsAPI and store it in our database
fetchTrendingNews();




app.use('/api/trends', trendRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
