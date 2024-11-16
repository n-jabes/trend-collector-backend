import googleTrends from 'google-trends-api';
import Trend from '../models/Trend.js'; // Correct import of default export

async function fetchTrends() {
  const keyword = 'sustainable farming';
  const startTime = new Date(new Date().setDate(new Date().getDate() - 30)); // Last 30 days

  try {
    const results = await googleTrends.interestOverTime({ keyword, startTime });
    const trendData = JSON.parse(results).default.timelineData.map((data) => ({
      time: data.formattedTime,
      value: data.value[0],
      keyword,
    }));

    // Save the data to MongoDB using the model's insertMany method
    await Trend.insertMany(trendData);
    console.log('Trend data fetched and saved successfully!');
  } catch (error) {
    console.error('Error fetching trend data:', error);
  }
}

export default fetchTrends;
