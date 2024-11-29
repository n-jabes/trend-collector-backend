from flask import Flask, jsonify, request
from pytrends.request import TrendReq
from pymongo import MongoClient
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Flask app
app = Flask(__name__)

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI')  # Load MONGO_URI from .env
client = MongoClient(MONGO_URI)
db = client['trend-collector']  # Database name
collection = db['trending_topics']  # Collection name

# Function to fetch trending data
def fetch_trending_data():
    pytrends = TrendReq(hl='en-US', tz=360)
    trending_searches = pytrends.trending_searches(pn='united_states')  # Change region as needed
    top_25 = trending_searches.head(25).reset_index()  # Reset index for easier storage
    
    # Debugging: Print the available columns and top rows
    print(top_25.columns)  # Shows the columns of the DataFrame
    print(top_25.head())  # Shows the first few rows of data

    # Now access the correct column (0) which contains the trends
    trending_data = top_25[[0]].rename(columns={0: 'trend'}).to_dict('records')  # Rename 0 to 'trend'
    
    # Add timestamp to each item
    for item in trending_data:
        item['timestamp'] = datetime.now(timezone.utc)  # Use timezone-aware datetime (UTC)
    
    return trending_data


# Endpoint to fetch data and store it in MongoDB
@app.route('/fetch-and-store', methods=['POST'])
def fetch_and_store():
    try:
        trending_data = fetch_trending_data()
        if not trending_data:
            return jsonify({"error": "No data found to store"}), 500
        
        collection.insert_many(trending_data)  # Store in MongoDB
        return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to retrieve data for the frontend
@app.route('/trending', methods=['GET'])
def get_trending():
    try:
        # Fetch the latest data from MongoDB
        data = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB's _id field
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Adjust port as needed
