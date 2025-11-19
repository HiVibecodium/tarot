#!/bin/bash

echo "🔮 Testing Production Deployment"
echo "================================"
echo ""

PROD_URL="https://tarot-a2oi.onrender.com"

# Test health
echo "1. Health Check..."
curl -s $PROD_URL/health | grep -o '"success":true' && echo "✅ PASS" || echo "❌ FAIL"

# Test cards API
echo "2. Cards API..."
curl -s $PROD_URL/api/cards | grep -o '"success":true' && echo "✅ PASS" || echo "❌ FAIL"

# Test payment pricing
echo "3. Payment Pricing..."
curl -s $PROD_URL/api/payment/pricing | grep -o '"success":true' && echo "✅ PASS" || echo "❌ FAIL"

# Test registration (with unique email)
echo "4. User Registration..."
TIMESTAMP=$(date +%s)
curl -s -X POST $PROD_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test-$TIMESTAMP@example.com\",\"password\":\"TestPass2025!#\",\"displayName\":\"Test\"}" \
  | grep -o '"success":true' && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "================================"
echo "Production tests complete!"
