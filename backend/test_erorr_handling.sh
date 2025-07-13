#!/usr/bin/env bash
set -euo pipefail

API="http://127.0.0.1:5001"
USER="alice"
PASS="password123"

echo "=== Register (idempotent) ==="
curl -s -X POST "$API/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" \
  | jq .

echo
echo "=== Login & grab token ==="
TOKEN=$(curl -s -X POST "$API/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" \
  | jq -r .access_token)
echo "Token:" "${TOKEN:0:10}…"

echo
echo "=== Missing Authorization header ==="
curl -s -X POST "$API/predict" \
  -H "Content-Type: application/json" \
  --data '{}' \
  | jq .

echo
echo "=== Invalid Authorization header ==="
curl -s -X POST "$API/predict" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer bad.token.here" \
  --data '{}' \
  | jq .

echo
echo "=== Missing features payload ==="


# Drop one required field
jq 'del(.["2024 Electorate"])' payload.json > tmp_missing.json
curl -s -X POST "$API/predict" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  --data @tmp_missing.json \
  | jq .

echo
echo "=== Invalid JSON payload ==="
curl -s -X POST "$API/predict" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ this is : not json }' \
  | jq .

echo
echo "=== Survey endpoint without responses ==="
curl -s -X POST "$API/survey" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  --data '{"foo":"bar"}' \
  | jq .

echo
echo "=== Survey endpoint with invalid JSON ==="
curl -s -X POST "$API/survey" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"responses": invalid_json }' \
  | jq .



# Cleanup
rm -f tmp_missing.json

echo
echo "=== Done error-handling tests ==="



# Run in the terminal before
# chmod +x backend/test_error_handling.sh
# ./backend/test_error_handling.sh
