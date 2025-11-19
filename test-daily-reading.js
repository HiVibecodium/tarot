/**
 * Test script for daily reading generation
 */

require('dotenv').config();

const Card = require('./src/backend/models/Card.json-model');
const ReadingService = require('./src/backend/services/reading.service');
const db = require('./src/backend/db/json-store');

async function testDailyReading() {
  try {
    console.log('🧪 Testing Daily Reading Generation...\n');

    // Initialize database
    await db.init();
    console.log('✅ Database initialized\n');

    // Check cards
    const cards = await Card.findAll();
    console.log(`📚 Found ${cards.length} cards in database\n`);

    if (cards.length === 0) {
      console.error('❌ No cards found! Run seed script first.');
      process.exit(1);
    }

    // Test card structure
    const testCard = cards[0];
    console.log('Testing first card structure:');
    console.log(`- Name: ${testCard.name}`);
    console.log(`- Has interpretations: ${!!testCard.interpretations}`);
    console.log(`- Has daily: ${!!testCard.interpretations?.daily}`);
    console.log(`- Has upright: ${!!testCard.interpretations?.daily?.upright}`);
    console.log(`- Has reversed: ${!!testCard.interpretations?.daily?.reversed}`);
    console.log(`- Has keywords: ${!!testCard.keywords}\n`);

    // Generate daily reading
    console.log('🔮 Generating daily reading...\n');

    const userId = 'test-user-123';
    const mood = 'calm';

    const result = await ReadingService.generateDailyReading(userId, mood);

    console.log('✅ Daily reading generated successfully!\n');
    console.log('Reading details:');
    console.log(`- Type: ${result.reading.type}`);
    console.log(`- Cards: ${result.reading.cards.length}`);
    console.log(`- Card name: ${result.reading.cards[0].cardName}`);
    console.log(`- Reversed: ${result.reading.cards[0].reversed}`);
    console.log(`- Interpretation length: ${result.reading.interpretation.text.length} chars`);
    console.log(`\nInterpretation preview:`);
    console.log(result.reading.interpretation.text.substring(0, 200) + '...\n');

    console.log('✅ Test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

testDailyReading();
