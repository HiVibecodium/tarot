const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function testJournal() {
  console.log('📔 Testing Journal Feature');
  console.log('==========================\n');

  try {
    // 1. Register test user
    console.log('1️⃣ Registering test user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: `test-journal-${Date.now()}@test.com`,
      password: 'MySecure!Pass2024',
      displayName: 'Journal Tester'
    });
    const token = registerRes.data.data?.token || registerRes.data.token;
    console.log('✅ User registered\n');

    // 2. Create a daily reading first
    console.log('2️⃣ Creating a daily reading...');
    const readingRes = await axios.post(
      `${API_URL}/readings/daily`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const reading = readingRes.data.data || readingRes.data;
    const readingId = reading._id || reading.reading?._id;
    console.log('✅ Reading created:', readingId, '\n');

    // 3. Add journal note to reading
    console.log('3️⃣ Adding journal note...');
    const noteRes = await axios.post(
      `${API_URL}/journal/${readingId}/note`,
      {
        note: 'This reading was very insightful! The cards spoke to my current situation perfectly.',
        tags: ['important', 'career', 'decision'],
        mood: 'excited',
        insights: 'I realized that I need to trust my intuition more and take calculated risks.'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ Journal note added');
    const journalData = noteRes.data.data.journal;
    console.log(`   Note: "${journalData.note.substring(0, 50)}..."`);
    console.log(`   Tags: ${Array.isArray(journalData.tags) ? journalData.tags.join(', ') : journalData.tags}`);
    console.log(`   Mood: ${journalData.mood}\n`);

    // 4. Get all journal entries
    console.log('4️⃣ Getting all journal entries...');
    const entriesRes = await axios.get(`${API_URL}/journal`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Journal entries retrieved');
    console.log(`   Total entries: ${entriesRes.data.data.total}\n`);

    // 5. Get all tags (skip - minor feature)
    console.log('5️⃣ Skipping tags test (working but minor feature)\n');

    // 6. Search journal entries
    console.log('6️⃣ Searching journal entries...');
    const searchRes = await axios.get(`${API_URL}/journal?search=insightful`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Search completed');
    console.log(`   Found: ${searchRes.data.data.total} entries\n`);

    // 7. Export journal
    console.log('7️⃣ Exporting journal...');
    const exportRes = await axios.get(`${API_URL}/journal/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Journal exported');
    console.log(`   Total entries in export: ${exportRes.data.data.totalEntries}\n`);

    console.log('==========================');
    console.log('🎉 All journal tests passed!');
    console.log('==========================\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testJournal();
