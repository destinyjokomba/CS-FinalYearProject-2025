#!/usr/bin/env bash
set -e

# Navigate to project backend directory
cd ~/Documents/FYP/CS-FinalYearProject-2025/backend

# ------ Register test user -------
#echo "Registering user..."
#curl -s -X POST http://127.0.0.1:5001/register \
  #-H "Content-Type: application/json" \
  #-d '{"username":"alice","password":"password123"}'

# ------ Log in and grab the JWT token ------
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://127.0.0.1:5001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"frankwhite","password":"password123"}')

# Print the raw login response to check format
echo "Login response: $LOGIN_RESPONSE"

# Extract token safely
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')

# Check if token was extracted
if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "Failed to extract access token. Check login response above."
  exit 1
fi

echo "Token obtained."

# ------ Health check ------
echo "Performing health check..."
curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5001/ || echo "Health check failed."

# ------ Generate payload.json if not exists ------
if [[ ! -f payload.json ]]; then
  echo "Generating payload.json..."
  python3 << 'EOF' > payload.json
import json, joblib
rf = joblib.load('models/random_forest_model.joblib')
template = {feat: 0 for feat in rf.feature_names_in_}
print(json.dumps(template, indent=2))
EOF


# Show first few lines of the payload for sanity check
echo "Generated payload.json:"
head -n 5 payload.json

# ------ Random Forest prediction ------
echo "RF prediction:"
curl -s -X POST http://127.0.0.1:5001/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  --data @payload.json | jq .

# ------ Logistic Regression prediction ------
echo "LR prediction:"
curl -s -X POST http://127.0.0.1:5001/predict-lr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  --data @payload.json | jq .
