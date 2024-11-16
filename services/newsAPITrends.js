import axios from 'axios';
import Trend from '../models/Trend.js';  // Ensure your Trend model is imported

// NewsAPI configuration (using the free API key)
const NEWS_API_KEY = process.env.NEWS_API_KEY; 
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

// Fetch Trending News Articles
export const fetchTrendingNews = async () => {
  try {
    const response = await axios.get(NEWS_API_URL);

    if (response.data.status === 'ok') {
      const newsArticles = response.data.articles.map((article) => ({
        keyword: article.title, // You can use the article title as the keyword
        description: article.description || 'No description available',
        popularity: article.source.name ? 1 : 0,  // Just an example, you can modify it
        time: new Date(),
        category: article.category || 'General',  // You can add more categories based on content
        source: 'NewsAPI',
      }));

      // Store the articles in MongoDB
      await Trend.insertMany(newsArticles);
      console.log('News articles successfully added to the database');
    }
  } catch (error) {
    console.error('Error fetching or storing news articles:', error.message);
  }
};
