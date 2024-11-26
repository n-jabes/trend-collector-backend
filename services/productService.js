import googleTrends from 'google-trends-api';
import Product from '../models/productModel.js';

// Function to fetch product data from Google Trends
const fetchProductData = async (productName) => {
  try {
    // Fetch interest over time data for the product
    const trendData = await googleTrends.interestOverTime({ keyword: productName, startTime: new Date('2023-01-01') });

    // Parse the response
    const parsedData = JSON.parse(trendData);
    if (parsedData && parsedData.default && parsedData.default.timelineData) {
      const timelineData = parsedData.default.timelineData;

      // Calculate growth (last value - first value)
      const growth = timelineData[timelineData.length - 1].value[0] - timelineData[0].value[0];
      const volume = timelineData[timelineData.length - 1].value[0]; // Last known value

      // Prepare the document to be saved
      const productDocument = {
        name: productName,
        category: 'Startup', // Adjust this if necessary
        growth,
        volume,
        graph_data: timelineData, // Store time series data for future graphing
      };

      // Save product data to MongoDB
      const product = new Product(productDocument);
      await product.save();
      console.log(`Product data for ${productName} saved to database`);
    } else {
      console.log('No data found for product:', productName);
    }

  } catch (err) {
    console.error('Error fetching product data:', err);
  }
};

export { fetchProductData };
