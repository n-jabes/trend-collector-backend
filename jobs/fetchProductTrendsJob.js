import { fetchProductData } from '../services/productService.js';

// Function to fetch data for predefined products or startups
export const fetchProductTrendsJob = async () => {
  const productsToFetch = [
    'Notion', 'Figma', 'Airbnb', 'Stripe', 'Shopify', 'Tesla', 'SpaceX', 'Uber', 'Square', 'Twitter'
    // Add more products/startups to track here
  ];

  // Fetch and store data for each product
  for (let product of productsToFetch) {
    await fetchProductData(product);
  }
};
