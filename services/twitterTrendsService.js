import axios from 'axios';
import Trend from '../models/Trend.js';

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

export const fetchTrendsV2 = async () => {
  try {
    const response = await axios.get(
      'https://api.twitter.com/2/tweets/sample/stream',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );
    console.log('Trends: ', response);
    const trends = response.data.data.map((tweet) => ({
      keyword: tweet.text,
      description: 'No description available', // Modify as needed
      popularity: 0, // Popularity is not directly available in API v2
      time: new Date(),
      category: 'Social Media',
      source: 'Twitter',
    }));

    // Store in your MongoDB database (assuming Trend is your Mongoose model)
    await Trend.insertMany(trends);
    console.log('Trends successfully added to the database');
  } catch (error) {
    console.error('Error fetching or storing trends:', error);
  }
};
