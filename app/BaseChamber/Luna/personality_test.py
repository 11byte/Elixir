import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
from flask_cors import CORS  # Fix CORS issue

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow frontend access

# Load dataset
df = pd.read_csv("data-final.csv",delimiter="\t")

# Remove unnecessary columns
columns_to_remove = ['dateload', 'screenw', 'screenh', 'introelapse', 'testelapse', 'endelapse', 'IPC', 'country', 'lat_appx_lots_of_err', 'long_appx_lots_of_err']
df = df.drop(columns=columns_to_remove, errors='ignore')

# Keep only numeric data
df = df.select_dtypes(include=[np.number])

# Fill missing values with column means
df = df.fillna(df.mean())

# Standardize data
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df)

# Apply KMeans clustering
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df['Cluster'] = kmeans.fit_predict(scaled_features)

# Define personality traits
traits = ["EXT", "EST", "AGR", "CSN", "OPN"]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get("responses", [])
    
    # Ensure correct number of responses
    expected_features = df.shape[1] - 1  # Excluding 'Cluster' column
    if len(data) != expected_features:
        return jsonify({"error": f"Expected {expected_features} responses, got {len(data)}."}), 400
    
    try:
        # Standardize input
        user_scaled = scaler.transform([data])
        
        # Predict cluster
        cluster = kmeans.predict(user_scaled)[0]
        
        # Compute trait scores
        trait_scores = {traits[i // 10]: sum(data[i:i+10]) / 10 for i in range(0, 50, 10)}
        
        return jsonify({
            "personality_traits": trait_scores,
            "cluster": int(cluster),
            "interpretation": f"Personality type {cluster} insights."
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
