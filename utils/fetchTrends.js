import axios from 'axios';

export const fetchTrends = async () => {
  try {
    // Example: Fetch data from Google Trends
    const keyword = 'Technology';
    const response = await axios.get(`https://api.trendapi.com/keyword/${keyword}`);
    
    // Transform the response as needed
    return response.data.trends.map((trend) => ({
      keyword: trend.keyword,
      description: trend.description,
      popularity: trend.popularity,
      time: new Date(),
      category: trend.category || 'General',
      source: 'Google Trends',
    }));
  } catch (error) {
    console.error('Error fetching trends:', error.message);
    return [];
  }
};
