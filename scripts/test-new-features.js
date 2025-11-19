const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testAllNewFeatures() {
  console.log('🧪 ========================================');
  console.log('🧪 TESTING ALL NEW FEATURES');
  console.log('🧪 ========================================\n');

  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const test = (name, condition, actual) => {
    if (condition) {
      console.log(`✅ ${name}`);
      results.passed++;
    } else {
      console.log(`❌ ${name} - Got: ${actual}`);
      results.failed++;
      results.errors.push(name);
    }
  };

  try {
    // Setup: Register user
    console.log('📝 Setting up test user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: `test-features-${Date.now()}@test.com`,
      password: 'MyVerySecure!Pass2024',
      displayName: 'Features Tester'
    });
    const token = registerRes.data.data?.token || registerRes.data.token;
    console.log('✅ Test user created\n');

    // ==========================================
    // NUMEROLOGY TESTS
    // ==========================================
    console.log('🔢 TESTING NUMEROLOGY');
    console.log('------------------------------------------');

    // Test 1: Calculate numerology
    const numRes = await axios.post(
      `${API_URL}/numerology/calculate`,
      {
        birthDate: '15.03.1990',
        fullName: 'Александр Иванов'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    test('Numerology calculation', numRes.data.success === true);
    test('Life Path number exists', numRes.data.data.numbers.lifePath !== undefined);
    test('Destiny number exists', numRes.data.data.numbers.destiny !== undefined);
    test('Soul Urge number exists', numRes.data.data.numbers.soulUrge !== undefined);
    test('Personality number exists', numRes.data.data.numbers.personality !== undefined);
    test('Personal Year number exists', numRes.data.data.numbers.personalYear !== undefined);

    // Test 2: Get saved profile
    const profileRes = await axios.get(
      `${API_URL}/numerology/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    test('Numerology profile retrieval', profileRes.data.success === true);

    // Test 3: Compatibility
    const compatRes = await axios.post(
      `${API_URL}/numerology/compatibility`,
      { number1: 1, number2: 5 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    test('Compatibility calculation', compatRes.data.success === true);
    test('Compatibility score exists', compatRes.data.data.score !== undefined);

    // Test 4: Get interpretation
    const interpRes = await axios.get(`${API_URL}/numerology/interpretation/11`);
    test('Number interpretation', interpRes.data.success === true);
    test('Interpretation has title', interpRes.data.data.title !== undefined);

    console.log('');

    // ==========================================
    // MOON PHASES TESTS
    // ==========================================
    console.log('🌙 TESTING MOON PHASES');
    console.log('------------------------------------------');

    // Test 5: Current moon phase
    const currentMoonRes = await axios.get(`${API_URL}/moon/current`);
    test('Current moon phase', currentMoonRes.data.success === true);
    test('Moon phase has name', currentMoonRes.data.data.phaseName !== undefined);
    test('Moon phase has emoji', currentMoonRes.data.data.emoji !== undefined);
    test('Moon illumination exists', currentMoonRes.data.data.illumination !== undefined);

    // Test 6: Moon calendar
    const calendarRes = await axios.get(`${API_URL}/moon/calendar`);
    test('Moon calendar retrieval', calendarRes.data.success === true);
    test('Calendar has days', calendarRes.data.data.days.length > 0);

    // Test 7: Next full moon
    const fullMoonRes = await axios.get(`${API_URL}/moon/next-full-moon`);
    test('Next full moon', fullMoonRes.data.success === true);
    test('Full moon date exists', fullMoonRes.data.data.dateFormatted !== undefined);

    // Test 8: Reading favorable check
    const favorableRes = await axios.get(`${API_URL}/moon/reading-favorable`);
    test('Reading favorable check', favorableRes.data.success === true);
    test('Favorable has recommendation', favorableRes.data.data.recommendation !== undefined);

    console.log('');

    // ==========================================
    // JOURNAL TESTS
    // ==========================================
    console.log('📔 TESTING JOURNAL');
    console.log('------------------------------------------');

    // Create a reading first
    const readingRes = await axios.post(
      `${API_URL}/readings/daily`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const reading = readingRes.data.data || readingRes.data;
    const readingId = reading._id || reading.reading?._id;

    // Test 9: Add journal note
    const noteRes = await axios.post(
      `${API_URL}/journal/${readingId}/note`,
      {
        note: 'Amazing reading today! Very relevant to my situation.',
        tags: ['daily', 'positive'],
        mood: 'happy',
        insights: 'I need to trust the process more'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    test('Journal note creation', noteRes.data.success === true);
    test('Note saved in reading', noteRes.data.data.journal !== undefined);

    // Test 10: Get journal entries
    const journalRes = await axios.get(`${API_URL}/journal`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    test('Journal entries retrieval', journalRes.data.success === true);
    test('Journal has entries', journalRes.data.data.total >= 1);

    // Test 11: Search journal
    const searchRes = await axios.get(`${API_URL}/journal?search=amazing`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    test('Journal search', searchRes.data.success === true);

    // Test 12: Export journal
    const exportRes = await axios.get(`${API_URL}/journal/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    test('Journal export', exportRes.data.success === true);
    test('Export has entries', exportRes.data.data.totalEntries >= 1);

    console.log('');

    // ==========================================
    // RESULTS
    // ==========================================
    console.log('🧪 ========================================');
    console.log('🧪 TEST RESULTS SUMMARY');
    console.log('🧪 ========================================\n');

    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📊 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%\n`);

    if (results.failed > 0) {
      console.log('❌ FAILED TESTS:');
      results.errors.forEach(err => console.log(`   ✗ ${err}`));
      console.log('');
      process.exit(1);
    } else {
      console.log('🎉 PERFECT! All new features working!\n');
      console.log('New Features Summary:');
      console.log('  🔢 Numerology: 5 calculations + compatibility');
      console.log('  🌙 Moon Phases: 8 phases + calendar + recommendations');
      console.log('  📔 Journal: Notes + tags + search + export');
      console.log('');
    }

    console.log('🧪 ========================================\n');

  } catch (error) {
    console.error('❌ Critical error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAllNewFeatures();
