import googleTrends from 'google-trends-api';

export async function fetchTrendsData(keyword, region = 'US', timeframe = 'today 12-m', retries = 3) {
  try {
    const results = await googleTrends.interestOverTime({
      keyword,
      geo: region,
      timeframe,
    });

    console.log('Raw Results:', results); // Log the raw response

    const parsedResults = JSON.parse(results);

    const interestOverTime = parsedResults.default.timelineData.map((item) => ({
      date: new Date(item.time * 1000),
      interest: item.value[0],
    }));

    return {
      keyword,
      region,
      timeframe,
      interest_over_time: interestOverTime,
    };
  } catch (error) {
    console.error(`Error fetching data for "${keyword}":`, error);

    if (retries > 0) {
      console.log(`Retrying (${3 - retries + 1}/3) for "${keyword}"...`);
      return fetchTrendsData(keyword, region, timeframe, retries - 1);
    }

    throw error; // Re-throw after exhausting retries
  }
}
