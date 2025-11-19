/**
 * Jest Setup
 * Runs before all tests
 */

// Set test environment variables BEFORE any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing';
process.env.DATA_DIR = './test-data';

// Increase timeout for slow tests
jest.setTimeout(10000);

// Initialize database before all tests
beforeAll(async () => {
  const db = require('./src/backend/db/json-store');
  const Card = require('./src/backend/models/Card.json-model');
  const User = require('./src/backend/models/User.json-model');
  const Reading = require('./src/backend/models/Reading.json-model');

  try {
    // Initialize database
    await db.init();

    // Clear existing data for clean test runs
    await User.deleteAll();
    await Reading.deleteAll();

    // Seed cards if empty
    const cardCount = await Card.count();
    if (cardCount === 0) {
      const { allCards } = require('./src/backend/scripts/seed-cards');
      await Card.insertMany(allCards);
      console.log(`✅ Test database seeded with ${allCards.length} cards`);
    }
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
});

// Clean up test data after all tests
afterAll(async () => {
  console.log('Tests completed');
});
