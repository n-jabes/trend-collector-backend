import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Product schema
const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Startup', 'Tech', 'E-commerce'
  growth: { type: Number, required: true }, // Percentage growth
  volume: { type: Number, required: true }, // Search volume or interest
  timestamp: { type: Date, default: Date.now },
  graph_data: { type: Object, required: true } // Time-series data for graphing trends
});

const Product = mongoose.model('Product', productSchema);

export default Product;
