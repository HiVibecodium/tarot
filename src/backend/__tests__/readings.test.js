/**
 * Readings API Tests
 * Tests for tarot readings generation and retrieval
 */

const request = require('supertest');
const app = require('../index-json');

describe('Readings API', () => {
  let testEmail;
  let testToken;
  let userId;

  beforeAll(async () => {
    // Create a test user
    testEmail = `test-readings-${Date.now()}@example.com`;

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'SecurePass2024',
        displayName: 'Test User'
      });

    testToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  describe('POST /api/readings/daily', () => {
    it('should generate daily reading for authenticated user', async () => {
      const response = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          mood: 'curious'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('reading');
      expect(response.body.data.isNew).toBe(true);

      const reading = response.body.data.reading;

      expect(reading).toHaveProperty('_id');
      expect(reading).toHaveProperty('cards');
      expect(reading).toHaveProperty('interpretation');
      expect(reading).toHaveProperty('createdAt');
      expect(reading.context.type).toBe('daily');
    });

    it('should return existing daily reading for same day', async () => {
      // First reading
      await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ mood: 'curious' });

      // Second reading on same day
      const response = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ mood: 'happy' });

      expect(response.status).toBe(200); // 200, not 201
      expect(response.body.success).toBe(true);
      expect(response.body.data.isNew).toBe(false);
    });

    it('should reject daily reading without authentication', async () => {
      const response = await request(app)
        .post('/api/readings/daily')
        .send({ mood: 'curious' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return card with proper structure', async () => {
      const response = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ mood: 'curious' });

      const cards = response.body.data.reading.cards;

      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBeGreaterThan(0);

      const card = cards[0];
      expect(card).toHaveProperty('cardId');
      expect(card).toHaveProperty('cardName');
      expect(card).toHaveProperty('arcana');
      expect(card).toHaveProperty('reversed');

      expect(typeof card.reversed).toBe('boolean');
    });
  });

  describe('POST /api/readings/decision', () => {
    it('should generate 3-card decision reading', async () => {
      const response = await request(app)
        .post('/api/readings/decision')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          question: 'Should I change my career?',
          context: 'Thinking about switching to tech industry'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('reading');

      const reading = response.body.data.reading;

      expect(reading.cards.length).toBe(3);
      expect(reading.context.type).toBe('decision');
      expect(reading.context.question).toBe('Should I change my career?');
    });

    it('should require question for decision reading', async () => {
      const response = await request(app)
        .post('/api/readings/decision')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          // Missing question
          context: 'Some context'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/readings/history', () => {
    it('should return user reading history', async () => {
      // Generate a reading first
      await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ mood: 'curious' });

      // Get history
      const response = await request(app)
        .get('/api/readings/history')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('readings');
      expect(Array.isArray(response.body.data.readings)).toBe(true);
      expect(response.body.data.readings.length).toBeGreaterThan(0);
    });

    it('should require authentication for history', async () => {
      const response = await request(app)
        .get('/api/readings/history');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return readings sorted by date (newest first)', async () => {
      const response = await request(app)
        .get('/api/readings/history')
        .set('Authorization', `Bearer ${testToken}`);

      const readings = response.body.data.readings;

      if (readings.length > 1) {
        const firstDate = new Date(readings[0].createdAt);
        const secondDate = new Date(readings[1].createdAt);

        expect(firstDate >= secondDate).toBe(true);
      }
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/readings/history?page=1&limit=5')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.readings.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/readings/:id', () => {
    it('should return specific reading by ID', async () => {
      // Generate a reading
      const createResponse = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ mood: 'curious' });

      const readingId = createResponse.body.data.reading._id;

      // Get that specific reading
      const response = await request(app)
        .get(`/api/readings/${readingId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reading._id).toBe(readingId);
    });

    it('should not allow accessing other users readings', async () => {
      // Create another user
      const anotherUserEmail = `test-other-${Date.now()}@example.com`;
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: anotherUserEmail,
          password: 'SecurePass2024',
          displayName: 'Other User'
        });

      const anotherToken = registerResponse.body.data.token;

      // Generate reading for first user
      const createResponse = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ mood: 'curious' });

      const readingId = createResponse.body.data.reading._id;

      // Try to access with second user
      const response = await request(app)
        .get(`/api/readings/${readingId}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Reading Statistics', () => {
    it('should return reading stats for user', async () => {
      const response = await request(app)
        .get('/api/readings/mood/stats')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalReadings');
      expect(response.body.data).toHaveProperty('moodFrequency');
      expect(response.body.data).toHaveProperty('period');

      expect(typeof response.body.data.totalReadings).toBe('number');
    });
  });
});
