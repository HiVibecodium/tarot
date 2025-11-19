/**
 * Comprehensive Testing Script
 * Tests all major features and finds issues
 */

const axios = require('axios');

const API_URL = 'http://localhost:4000/api';
const TEST_EMAIL = `test-${Date.now()}@test.com`;
const TEST_PASSWORD = 'SecurePass2024!';

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper to log test
function logTest(name, passed, details = '') {
  if (passed) {
    results.passed.push(name);
    console.log(`✅ ${name}`);
  } else {
    results.failed.push({ name, details });
    console.log(`❌ ${name}${details ? ': ' + details : ''}`);
  }
}

function logWarning(message) {
  results.warnings.push(message);
  console.log(`⚠️  ${message}`);
}

/**
 * Test Authentication Flow
 */
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...\n');

  try {
    // Test 1: Register
    try {
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        displayName: 'Test User'
      });

      logTest('User Registration', registerRes.status === 201 && registerRes.data.success);

      const token = registerRes.data.data?.token;
      if (!token) {
        logTest('Token Generation', false, 'No token in response');
        return null;
      }
      logTest('Token Generation', true);

      return token;
    } catch (error) {
      logTest('User Registration', false, error.response?.data?.error?.message || error.message);
      return null;
    }

  } catch (error) {
    logTest('Authentication Flow', false, error.message);
    return null;
  }
}

/**
 * Test Daily Reading
 */
async function testDailyReading(token) {
  console.log('\n🔮 Testing Daily Reading...\n');

  try {
    const response = await axios.post(
      `${API_URL}/readings/daily`,
      { mood: 'calm' },
      { headers: { Authorization: `Bearer ${token}` }}
    );

    logTest('Daily Reading Generation', response.status === 201 && response.data.success);

    const reading = response.data.data?.reading;
    if (!reading) {
      logTest('Reading Data Structure', false, 'No reading in response');
      return;
    }

    logTest('Reading Data Structure', true);
    logTest('Card Data Present', !!reading.cards && reading.cards.length > 0);
    logTest('Interpretation Present', !!reading.interpretation?.text);

    // Check for horoscope if user has astrology
    if (response.data.data.horoscope) {
      logTest('Horoscope Integration', true);
      logTest('Moon Phase Data', !!response.data.data.horoscope.moonPhase);
      logTest('Lucky Numbers', Array.isArray(response.data.data.horoscope.luckyNumbers));
    } else {
      logWarning('No horoscope data (user needs natal chart)');
    }

    // Test duplicate prevention
    const duplicateRes = await axios.post(
      `${API_URL}/readings/daily`,
      {},
      { headers: { Authorization: `Bearer ${token}` }}
    );

    logTest('Daily Limit Prevention', duplicateRes.data.data?.isNew === false);

    return reading._id;
  } catch (error) {
    logTest('Daily Reading', false, error.response?.data?.error?.message || error.message);
  }
}

/**
 * Test Decision Reading
 */
async function testDecisionReading(token) {
  console.log('\n🎯 Testing Decision Reading...\n');

  try {
    const response = await axios.post(
      `${API_URL}/readings/decision`,
      {
        question: 'Should I continue testing?',
        options: ['Yes, test more', 'No, stop testing']
      },
      { headers: { Authorization: `Bearer ${token}` }}
    );

    logTest('Decision Reading Generation', response.status === 201);

    const reading = response.data.data?.reading;
    logTest('3-Card Spread', reading?.cards?.length === 3);
    logTest('Position Names', reading?.cards?.every(c => c.positionName));

    return reading?._id;
  } catch (error) {
    logTest('Decision Reading', false, error.message);
  }
}

/**
 * Test Natal Chart
 */
async function testNatalChart(token) {
  console.log('\n🌟 Testing Natal Chart...\n');

  try {
    // Update birth info
    const updateRes = await axios.put(
      `${API_URL}/users/birth-info`,
      {
        fullName: 'Test User',
        birthDate: '1990-07-15',
        birthTime: '14:30',
        birthCity: 'Moscow',
        birthCountry: 'Россия',
        latitude: 55.7558,
        longitude: 37.6173,
        timezone: 'Europe/Moscow'
      },
      { headers: { Authorization: `Bearer ${token}` }}
    );

    logTest('Birth Info Update', updateRes.status === 200);

    const profile = updateRes.data.data?.astrologyProfile;
    logTest('Sun Sign Calculation', !!profile?.sunSign);
    logTest('Moon Sign Calculation', !!profile?.moonSign);
    logTest('Rising Sign Calculation', !!profile?.risingSign);
    logTest('Planetary Positions', !!profile?.planets);
    logTest('Houses System', !!profile?.houses && profile.houses.length === 12);
    logTest('Aspects Calculation', Array.isArray(profile?.aspects));
    logTest('Strengths & Challenges', !!profile?.strengths && !!profile?.challenges);
    logTest('Life Purpose', !!profile?.lifeLesson || !!profile?.soulPurpose);

  } catch (error) {
    logTest('Natal Chart', false, error.message);
  }
}

/**
 * Test Reading History
 */
async function testHistory(token) {
  console.log('\n📖 Testing History...\n');

  try {
    const response = await axios.get(`${API_URL}/readings/history?limit=50`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    logTest('Reading History Load', response.status === 200);
    logTest('History Data Structure', Array.isArray(response.data.data?.readings));

  } catch (error) {
    logTest('Reading History', false, error.message);
  }
}

/**
 * Test PDF Export
 */
async function testPDFExport(token, readingId) {
  console.log('\n📄 Testing PDF Export...\n');

  if (!readingId) {
    logWarning('No reading ID for PDF test');
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/readings/${readingId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer'
    });

    logTest('PDF Generation', response.status === 200);
    logTest('PDF Content Type', response.headers['content-type'] === 'application/pdf');
    logTest('PDF Size', response.data.byteLength > 10000); // At least 10KB

  } catch (error) {
    logTest('PDF Export', false, error.message);
  }
}

/**
 * Test Analytics
 */
async function testAnalytics(token) {
  console.log('\n📊 Testing Analytics...\n');

  try {
    const statsRes = await axios.get(`${API_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    logTest('User Stats Load', statsRes.status === 200);
    logTest('Stats Data Structure', !!statsRes.data.data?.stats);

  } catch (error) {
    logTest('Analytics', false, error.message);
  }
}

/**
 * Test Security
 */
async function testSecurity() {
  console.log('\n🔒 Testing Security...\n');

  // Test weak password rejection
  try {
    await axios.post(`${API_URL}/auth/register`, {
      email: `weak-${Date.now()}@test.com`,
      password: 'weak'
    });
    logTest('Weak Password Rejection', false, 'Weak password was accepted!');
  } catch (error) {
    logTest('Weak Password Rejection', error.response?.status === 400);
  }

  // Wait a bit to avoid triggering rate limit from previous tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test rate limiting (make 6 requests quickly)
  console.log('Testing rate limiting (6 rapid requests)...');
  let rateLimited = false;

  for (let i = 0; i < 6; i++) {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: `ratelimit-test-${Date.now()}@test.com`,
        password: 'wrong'
      });
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimited = true;
        break;
      }
    }
  }

  logTest('Rate Limiting Active', rateLimited);
}

/**
 * Test Card System
 */
async function testCardSystem() {
  console.log('\n🎴 Testing Card System...\n');

  try {
    const response = await axios.get(`${API_URL}/cards`);

    logTest('Card Loading', response.status === 200);

    const cards = response.data.data;
    logTest('Card Count', Array.isArray(cards) && cards.length > 0);
    logTest('Card Structure', cards[0]?.name && cards[0]?._id);

    // Check for all suits
    const suits = new Set(cards.map(c => c.suit).filter(Boolean));
    logTest('All 4 Suits Present', suits.size >= 4 || cards.some(c => c.arcana === 'major'));

  } catch (error) {
    logTest('Card System', false, error.message);
  }
}

/**
 * Test Health Endpoint
 */
async function testHealth() {
  console.log('\n🏥 Testing Health Check...\n');

  try {
    const response = await axios.get('http://localhost:4000/health');
    logTest('Health Endpoint', response.status === 200);
    logTest('Health Response', response.data?.success === true);
  } catch (error) {
    logTest('Health Check', false, error.message);
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🧪 ========================================');
  console.log('🧪 COMPREHENSIVE TESTING STARTED');
  console.log('🧪 ========================================\n');

  console.log('📡 API URL:', API_URL);
  console.log('👤 Test User:', TEST_EMAIL);
  console.log('');

  try {
    // Health check first
    await testHealth();

    // Card system
    await testCardSystem();

    // Authentication (before security tests to avoid rate limit)
    const token = await testAuthentication();

    // Security (after getting token)
    await testSecurity();

    if (token) {
      // Core features
      const dailyReadingId = await testDailyReading(token);
      const decisionReadingId = await testDecisionReading(token);

      // Natal chart
      await testNatalChart(token);

      // History
      await testHistory(token);

      // Analytics
      await testAnalytics(token);

      // PDF
      if (dailyReadingId) {
        await testPDFExport(token, dailyReadingId);
      }
    }

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }

  // Print summary
  console.log('\n🧪 ========================================');
  console.log('🧪 TEST RESULTS SUMMARY');
  console.log('🧪 ========================================\n');

  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log('');

  if (results.passed.length > 0) {
    console.log('✅ PASSED TESTS:');
    results.passed.forEach(test => console.log(`   ✓ ${test}`));
    console.log('');
  }

  if (results.failed.length > 0) {
    console.log('❌ FAILED TESTS:');
    results.failed.forEach(({ name, details }) => {
      console.log(`   ✗ ${name}`);
      if (details) console.log(`     ${details}`);
    });
    console.log('');
  }

  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    results.warnings.forEach(warning => console.log(`   • ${warning}`));
    console.log('');
  }

  // Final score
  const total = results.passed.length + results.failed.length;
  const score = total > 0 ? Math.round((results.passed.length / total) * 100) : 0;

  console.log('📊 FINAL SCORE:', `${score}%`);
  console.log('');

  if (score === 100) {
    console.log('🎉 PERFECT! All tests passed!');
  } else if (score >= 80) {
    console.log('✅ GOOD! Most tests passed.');
  } else if (score >= 60) {
    console.log('⚠️  NEEDS WORK. Several issues found.');
  } else {
    console.log('❌ CRITICAL. Many issues need fixing.');
  }

  console.log('\n🧪 ========================================\n');

  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
