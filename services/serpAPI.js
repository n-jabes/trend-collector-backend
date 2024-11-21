// src/services/serpApiService.js
import axios from 'axios';
import { serpApiKey, geo } from '../config/config.js';

// Function to make a request to SerpAPI (keeping query dynamic)
const fetchSerpApiData = async (engine, query) => {
  try {
    const params = {
      api_key: serpApiKey,
      engine: engine,
      q: query,  // This is the dynamic part (the query)
      geo: geo,  // Static geo location from config
    };
    
    const response = await axios.get('https://serpapi.com/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from SerpAPI:', error);
    return null;
  }
};

// Function to fetch Google Trends data with dynamic query
export const fetchGoogleTrendsData = async (query) => {
  return await fetchSerpApiData('google_trends', query);
};

// Function to fetch related queries with dynamic query
export const fetchRelatedQueries = async (query) => {
  const data = await fetchSerpApiData('google', query);
  return data ? data.related_keywords : [];
};

// Function to fetch news mentions with dynamic query
export const fetchNewsMentions = async (query) => {
  const data = await fetchSerpApiData('google_news', query);
  return data ? data.news_results.length : 0;
};

// Function to calculate trend score (growth rate of trend and news mentions)
export const calculateTrendScore = (trendsData, newsMentions) => {
    if (!trendsData || !trendsData.timeline_data) return 0;
  
    const latestSearchVolume = trendsData.timeline_data[trendsData.timeline_data.length - 1].value;
    const previousSearchVolume = trendsData.timeline_data[trendsData.timeline_data.length - 2].value;
    const growthRate = (latestSearchVolume - previousSearchVolume) / previousSearchVolume;
  
    return (growthRate * 0.7) + (newsMentions * 0.3);
};
