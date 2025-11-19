/**
 * Full System Integration Test
 * Tests complete user flow from registration to premium
 */

const axios = require('axios');

const API_URL = 'http://localhost:4000/api';
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'test12345';
let token = null;
let userId = null;

console.log('🧪 Starting Full System Integration Test\n');
console.log('='.repeat(60));

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (!passed && details) {
    console.log(`   Error: ${details}`);
  }
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

async function runTests() {
  try {
    // ========================================
    // 1. REGISTRATION
    // ========================================
    console.log('\n📝 Testing Registration:');

    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        email: testEmail,
        password: testPassword,
        displayName: 'Test User'
      });

      logTest('Register new user', registerResponse.status === 201);
      logTest('Response contains token', !!registerResponse.data.data.token);
      logTest('Response contains user', !!registerResponse.data.data.user);

      token = registerResponse.data.data.token;
      userId = registerResponse.data.data.user.id;

    } catch (error) {
      logTest('Register new user', false, error.message);
    }

    // ========================================
    // 2. LOGIN
    // ========================================
    console.log('\n🔐 Testing Login:');

    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testEmail,
        password: testPassword
      });

      logTest('Login with credentials', loginResponse.status === 200);
      logTest('Login token received', !!loginResponse.data.data.token);

      token = loginResponse.data.data.token; // Update token

    } catch (error) {
      logTest('Login with credentials', false, error.message);
    }

    // ========================================
    // 3. PROFILE
    // ========================================
    console.log('\n👤 Testing Profile:');

    try {
      const profileResponse = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Get user profile', profileResponse.status === 200);
      logTest('Profile has email', profileResponse.data.data.user.email === testEmail);

    } catch (error) {
      logTest('Get user profile', false, error.message);
    }

    // ========================================
    // 4. CARDS
    // ========================================
    console.log('\n🃏 Testing Cards:');

    try {
      const cardsResponse = await axios.get(`${API_URL}/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Get cards list', cardsResponse.status === 200);
      logTest('Cards array returned', Array.isArray(cardsResponse.data.data));
      logTest('Has at least 22 cards (Major Arcana)', cardsResponse.data.data.length >= 22);
      logTest('Has 78 cards total (complete deck)', cardsResponse.data.data.length === 78);

      const firstCard = cardsResponse.data.data[0];
      logTest('Card has Russian name', !!firstCard.name);
      logTest('Card has interpretations', !!firstCard.interpretations);

    } catch (error) {
      logTest('Get cards list', false, error.message);
    }

    // ========================================
    // 5. DAILY READING
    // ========================================
    console.log('\n🌅 Testing Daily Reading:');

    try {
      const dailyResponse = await axios.post(`${API_URL}/readings/daily`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Create daily reading', dailyResponse.status === 201);
      logTest('Reading has card', dailyResponse.data.data.reading.cards.length > 0);
      logTest('Reading has interpretation', !!dailyResponse.data.data.reading.interpretation);
      logTest('Reading marked as new', dailyResponse.data.data.isNew === true);

    } catch (error) {
      logTest('Create daily reading', false, error.message);
    }

    // Test second daily reading (should return same)
    try {
      const dailyResponse2 = await axios.post(`${API_URL}/readings/daily`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Second daily reading returns same', dailyResponse2.data.data.isNew === false);

    } catch (error) {
      logTest('Second daily reading', false, error.message);
    }

    // ========================================
    // 6. DECISION ANALYSIS
    // ========================================
    console.log('\n🎯 Testing Decision Analysis:');

    try {
      const decisionResponse = await axios.post(`${API_URL}/readings/decision`, {
        question: 'Should I deploy to production?',
        options: ['Deploy now', 'Wait for more testing']
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Create decision reading', decisionResponse.status === 201);
      logTest('Decision has 3 cards', decisionResponse.data.data.reading.cards.length === 3);
      logTest('Decision has positions', decisionResponse.data.data.reading.cards[0].positionName !== undefined);
      logTest('Decision has interpretation', !!decisionResponse.data.data.reading.interpretation);

    } catch (error) {
      logTest('Create decision reading', false, error.message);
    }

    // ========================================
    // 7. HISTORY
    // ========================================
    console.log('\n📖 Testing History:');

    try {
      const historyResponse = await axios.get(`${API_URL}/readings/history?limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Get readings history', historyResponse.status === 200);
      logTest('History has readings', historyResponse.data.data.readings.length >= 2);
      logTest('History has daily reading', historyResponse.data.data.readings.some(r => r.type === 'daily'));
      logTest('History has decision reading', historyResponse.data.data.readings.some(r => r.type === 'decision'));

    } catch (error) {
      logTest('Get readings history', false, error.message);
    }

    // ========================================
    // 8. STATS
    // ========================================
    console.log('\n📊 Testing Stats:');

    try {
      const statsResponse = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Get user stats', statsResponse.status === 200);
      logTest('Stats has readings count', statsResponse.data.data.stats.readings.total >= 1);
      logTest('Stats has streak', statsResponse.data.data.stats.streaks.current >= 1);

    } catch (error) {
      logTest('Get user stats', false, error.message);
    }

    // ========================================
    // 9. STRIPE
    // ========================================
    console.log('\n💳 Testing Stripe Integration:');

    try {
      const stripeStatusResponse = await axios.get(`${API_URL}/stripe/subscription-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logTest('Get subscription status', stripeStatusResponse.status === 200);
      logTest('User is free tier', stripeStatusResponse.data.data.subscriptionTier === 'free');

    } catch (error) {
      logTest('Get subscription status', false, error.message);
    }

    // Note: Can't fully test Stripe checkout without real keys
    console.log('   ℹ️  Stripe checkout requires real API keys to test');

    // ========================================
    // 10. GDPR
    // ========================================
    console.log('\n🔒 Testing GDPR Compliance:');

    try {
      const exportResponse = await axios.get(`${API_URL}/users/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer'
      });

      logTest('Export user data', exportResponse.status === 200);
      logTest('Export is JSON', exportResponse.headers['content-type'].includes('application/json'));

    } catch (error) {
      logTest('Export user data', false, error.message);
    }

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY:');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Total:  ${results.passed + results.failed}`);
    console.log(`💯 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
    console.log('='.repeat(60));

    if (results.failed === 0) {
      console.log('\n🎉 All tests passed! System is working perfectly!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed. Check details above.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
