const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testMoonPhases() {
  console.log('🌙 Testing Moon Phases Feature');
  console.log('================================\n');

  try {
    // 1. Get current moon phase
    console.log('1️⃣  Getting current moon phase...');
    const currentResponse = await axios.get(`${API_URL}/moon/current`);
    const currentPhase = currentResponse.data.data;
    console.log('✅ Current phase retrieved');
    console.log(`   ${currentPhase.emoji} ${currentPhase.phaseName}`);
    console.log(`   Illumination: ${currentPhase.illumination}%`);
    console.log(`   ${currentPhase.description}\n`);

    // 2. Get next full moon
    console.log('2️⃣  Finding next full moon...');
    const fullMoonResponse = await axios.get(`${API_URL}/moon/next-full-moon`);
    const nextFullMoon = fullMoonResponse.data.data;
    console.log('✅ Next full moon found');
    console.log(`   Date: ${nextFullMoon.dateFormatted}`);
    console.log(`   Days until: ${nextFullMoon.daysUntil}\n`);

    // 3. Get next new moon
    console.log('3️⃣  Finding next new moon...');
    const newMoonResponse = await axios.get(`${API_URL}/moon/next-new-moon`);
    const nextNewMoon = newMoonResponse.data.data;
    console.log('✅ Next new moon found');
    console.log(`   Date: ${nextNewMoon.dateFormatted}`);
    console.log(`   Days until: ${nextNewMoon.daysUntil}\n`);

    // 4. Check if favorable for reading
    console.log('4️⃣  Checking if time is favorable for reading...');
    const favorableResponse = await axios.get(`${API_URL}/moon/reading-favorable`);
    const favorable = favorableResponse.data.data;
    console.log(favorable.isFavorable ? '✅ Favorable time!' : '⚠️  Not optimal time');
    console.log(`   ${favorable.reason}`);
    console.log(`   Tip: ${favorable.recommendation}\n`);

    // 5. Get calendar for current month
    console.log('5️⃣  Getting moon calendar...');
    const calendarResponse = await axios.get(`${API_URL}/moon/calendar`);
    const calendar = calendarResponse.data.data;
    console.log('✅ Calendar retrieved');
    console.log(`   Month: ${calendar.monthName} ${calendar.year}`);
    console.log(`   Days in month: ${calendar.days.length}`);

    const specialDays = calendar.days.filter(d => d.isSpecial);
    console.log(`   Special days (${specialDays.length}):`);
    specialDays.forEach(day => {
      console.log(`     ${day.date} - ${day.emoji} ${day.phase}`);
    });

    console.log('\n================================');
    console.log('🎉 All moon phases tests passed!');
    console.log('================================\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testMoonPhases();
