import GoogleTrend from '../models/GoogleTrend.js'; // Import your Trend model
import {
  fetchGoogleTrendsData,
  fetchRelatedQueries,
  fetchNewsMentions,
} from '../services/serpAPI.js';
import { calculateTrendScore } from '../utils/trendUtils.js';

// Function to collect and save topic data to the database
const collectTopicData = async (keyword) => {
  const trendsData = await fetchGoogleTrendsData(keyword);
  const relatedQueries = await fetchRelatedQueries(keyword);
  const newsMentions = await fetchNewsMentions(keyword);

  // Calculate the trend score based on the collected data
  const trendScore = calculateTrendScore(trendsData, newsMentions);

  // Save the trend data to the database
  await saveTrendDataToDatabase(keyword, trendsData, relatedQueries, newsMentions, trendScore);

  return {
    topic: keyword,
    trendsData: trendsData, // Raw trends data
    relatedQueries: relatedQueries, // Related search queries
    newsMentions: newsMentions, // News mentions count
    trendScore: trendScore, // Trend score based on growth
  };
};

// Function to save trend data into the database
const saveTrendDataToDatabase = async (keyword, trendsData, relatedQueries, newsMentions, trendScore) => {
  const region = 'US'; // You can dynamically set the region based on requirements

  // Extract the most recent popularity value
  const popularity = (trendsData?.interest_over_time?.timeline_data && trendsData.interest_over_time.timeline_data.length > 0)
    ? trendsData.interest_over_time.timeline_data[trendsData.interest_over_time.timeline_data.length - 1]?.values[0]?.value || 0
    : 0;

  const formattedKeyword = trendsData?.search_metadata?.id || keyword; // Fallback to 'keyword' if 'formatted_query' is missing

  // Extract timeline data
  const timeline_data = trendsData?.interest_over_time?.timeline_data?.map(item => ({
    date: item.time, // Assuming `time` is in the format you want for your date
    popularity: item.values[0].value, // Popularity on this specific date
  })) || [];

  // Extract related queries
  const relatedQueriesData = relatedQueries?.map(query => ({
    query: query.query,
    volume: query.volume,
  })) || [];

  try {
    // Create or update the trend in the database based on the keyword and region
    await GoogleTrend.findOneAndUpdate(
      { keyword, region }, // Search for existing record by keyword and region
      {
        formattedKeyword: formattedKeyword,
        popularity: popularity, // Set popularity based on the most recent trend data
        region: region,
        trendScore: trendScore,
        timeline_data: timeline_data, // Save the timeline data
        relatedQueries: relatedQueriesData, // Save related queries
        newsMentions: newsMentions, // Save news mentions
        updated_at: Date.now(),
      },
      { upsert: true } // Create a new record if not found, else update existing
    );
  } catch (error) {
    console.error('Error saving data to the database:', error);
    throw new Error('Error saving data to the database');
  }
};

// Controller function to handle requests for multiple topics
export const getMultipleTopicsData = async (req, res) => {
  const topics = req.query.topics || [
    'AI',
    'cryptocurrency',
    'machine learning',
    'sustainable energy',
  ];
  const allTopicData = [];

  try {
    for (const topic of topics) {
      const data = await collectTopicData(topic);
      allTopicData.push(data);
    }

    // Return the combined data for all topics
    res.json(allTopicData);
  } catch (error) {
    console.error('Error fetching topics data:', error);
    res.status(500).send('Internal server error');
  }
};

// Controller function to handle request for a single topic
export const getSingleTopicData = async (req, res) => {
  const { topic } = req.params;

  try {
    const data = await collectTopicData(topic);
    res.json(data);
  } catch (error) {
    console.error('Error fetching topic data:', error);
    res.status(500).send('Internal server error');
  }
};
