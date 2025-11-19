#!/bin/bash

PROD="https://tarot-a2oi.onrender.com"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        🔮 FINAL PRODUCTION TESTING 🔮                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Production URL: $PROD"
echo ""

PASS=0
FAIL=0

test_endpoint() {
  local name=$1
  local url=$2
  local method=${3:-GET}
  local data=$4
  
  echo -n "Testing: $name ... "
  
  if [ "$method" = "POST" ]; then
    response=$(curl -s -X POST "$url" -H "Content-Type: application/json" -d "$data")
  else
    response=$(curl -s "$url")
  fi
  
  if echo "$response" | grep -q '"success":true'; then
    echo "✅ PASS"
    ((PASS++))
  else
    echo "❌ FAIL"
    echo "   Response: $(echo $response | head -c 100)..."
    ((FAIL++))
  fi
}

echo "=== INFRASTRUCTURE ==="
test_endpoint "Health Check" "$PROD/health"
echo ""

echo "=== PUBLIC ENDPOINTS ==="
test_endpoint "Get Cards" "$PROD/api/cards"
test_endpoint "Payment Pricing" "$PROD/api/payment/pricing"
test_endpoint "Moon Phase" "$PROD/api/moon/current"
echo ""

echo "=== AUTHENTICATION ==="
TIMESTAMP=$(date +%s)
REG_DATA="{\"email\":\"final-test-$TIMESTAMP@test.com\",\"password\":\"FinalTest2025!#\",\"displayName\":\"Final Test\"}"
test_endpoint "User Registration" "$PROD/api/auth/register" "POST" "$REG_DATA"
echo ""

echo "=== FRONTEND ==="
echo -n "Testing: Frontend loads ... "
if curl -s "$PROD/" | grep -q '<div id="root">'; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi

echo -n "Testing: JS Bundle exists ... "
if curl -s "$PROD/assets/index-BKJ9v5pi.js" | head -c 100 | grep -q 'const'; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi

echo -n "Testing: CSS Bundle exists ... "
if curl -I "$PROD/assets/index-BpKD9kdk.css" 2>&1 | grep -q "200 OK"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi

echo -n "Testing: Service Worker exists ... "
if curl -s "$PROD/service-worker.js" | grep -q 'CACHE_NAME'; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   FINAL RESULTS                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
TOTAL=$((PASS + FAIL))
PERCENT=$((PASS * 100 / TOTAL))
echo "📊 Pass Rate: $PERCENT%"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 ALL TESTS PASSED! PRODUCTION READY! 🚀"
  exit 0
else
  echo "⚠️  Some tests failed. Review above."
  exit 1
fi
