const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testNumerology() {
  console.log('🧪 Testing Numerology Feature');
  console.log('===============================\n');

  try {
    // 1. Register a test user
    console.log('1️⃣ Registering test user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      email: `test-numerology-${Date.now()}@test.com`,
      password: 'MySecure!Pass2024',
      displayName: 'Numerology Tester'
    });

    const token = registerResponse.data.data?.token || registerResponse.data.token;
    console.log('✅ User registered successfully');
    console.log(`   Token: ${token.substring(0, 20)}...\n`);

    // 2. Calculate numerology
    console.log('2️⃣ Calculating numerology...');
    const numerologyResponse = await axios.post(
      `${API_URL}/numerology/calculate`,
      {
        birthDate: '15.03.1990',
        fullName: 'Иван Иванович Иванов'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const analysis = numerologyResponse.data.data;
    console.log('✅ Numerology calculated successfully');
    console.log('\n📊 Results:');
    console.log(`   Life Path: ${analysis.numbers.lifePath.value} - ${analysis.numbers.lifePath.interpretation.title}`);
    console.log(`   Destiny: ${analysis.numbers.destiny.value} - ${analysis.numbers.destiny.interpretation.title}`);
    console.log(`   Soul Urge: ${analysis.numbers.soulUrge.value} - ${analysis.numbers.soulUrge.interpretation.title}`);
    console.log(`   Personality: ${analysis.numbers.personality.value} - ${analysis.numbers.personality.interpretation.title}`);
    console.log(`   Personal Year: ${analysis.numbers.personalYear.value} - ${analysis.numbers.personalYear.interpretation.title}\n`);

    // 3. Get saved profile
    console.log('3️⃣ Retrieving saved profile...');
    const profileResponse = await axios.get(
      `${API_URL}/numerology/profile`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ Profile retrieved successfully');
    console.log(`   Saved for: ${profileResponse.data.data.fullName}\n`);

    // 4. Test compatibility
    console.log('4️⃣ Testing compatibility...');
    const compatibilityResponse = await axios.post(
      `${API_URL}/numerology/compatibility`,
      {
        number1: analysis.numbers.lifePath.value,
        number2: 6
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const compat = compatibilityResponse.data.data;
    console.log('✅ Compatibility calculated');
    console.log(`   Score: ${compat.score}/10 - ${compat.level}`);
    console.log(`   ${compat.description}\n`);

    // 5. Test interpretation endpoint
    console.log('5️⃣ Testing interpretation endpoint...');
    const interpResponse = await axios.get(`${API_URL}/numerology/interpretation/11`);
    const interp = interpResponse.data.data;
    console.log('✅ Interpretation retrieved');
    console.log(`   Number 11: ${interp.title} ${interp.symbol}`);
    console.log(`   ${interp.description}\n`);

    console.log('===============================');
    console.log('🎉 All numerology tests passed!');
    console.log('===============================\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testNumerology();
