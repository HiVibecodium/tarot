/**
 * Cards API Tests
 * Tests for tarot cards endpoints and data structure
 */

const request = require('supertest');
const app = require('../index-json');

describe('Cards API', () => {
  let allCards;

  describe('GET /api/cards', () => {
    it('should return all tarot cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Save for later tests
      allCards = response.body.data;
    });

    it('should return exactly 78 tarot cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      expect(response.body.data.length).toBe(78);
    });

    it('should have 22 Major Arcana cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      const majorArcana = response.body.data.filter(
        card => card.arcana === 'major'
      );

      expect(majorArcana.length).toBe(22);
    });

    it('should have 56 Minor Arcana cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      const minorArcana = response.body.data.filter(
        card => card.arcana === 'minor'
      );

      expect(minorArcana.length).toBe(56);
    });

    it('should have 4 suits in Minor Arcana', async () => {
      const response = await request(app)
        .get('/api/cards');

      const minorArcana = response.body.data.filter(
        card => card.arcana === 'minor'
      );

      const suits = [...new Set(minorArcana.map(card => card.suit))];

      expect(suits.length).toBe(4);
      expect(suits).toContain('wands');
      expect(suits).toContain('cups');
      expect(suits).toContain('swords');
      expect(suits).toContain('pentacles');
    });

    it('should have valid card structure', async () => {
      const response = await request(app)
        .get('/api/cards');

      const card = response.body.data[0];

      expect(card).toHaveProperty('_id');
      expect(card).toHaveProperty('name');
      expect(card).toHaveProperty('arcana');
      expect(card).toHaveProperty('keywords');
      expect(card).toHaveProperty('interpretations');

      expect(typeof card._id).toBe('string');
      expect(typeof card.name).toBe('string');
      expect(['major', 'minor']).toContain(card.arcana);
    });

    it('should have Russian names', async () => {
      const response = await request(app)
        .get('/api/cards');

      const card = response.body.data[0];

      // Check that names contain Cyrillic characters
      expect(/[а-яА-ЯёЁ]/.test(card.name)).toBe(true);
    });

    it('should have interpretations in Russian', async () => {
      const response = await request(app)
        .get('/api/cards');

      const card = response.body.data[0];

      expect(card.interpretations).toHaveProperty('daily');
      expect(Array.isArray(card.interpretations.daily.upright)).toBe(true);
      expect(/[а-яА-ЯёЁ]/.test(card.interpretations.daily.upright[0])).toBe(true);
    });
  });

  describe('GET /api/cards/:id', () => {
    it('should return a specific card by ID', async () => {
      // First get all cards
      const allCardsResponse = await request(app)
        .get('/api/cards');

      const firstCard = allCardsResponse.body.data[0];

      // Then get that specific card
      const response = await request(app)
        .get(`/api/cards/${firstCard._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(firstCard._id);
      expect(response.body.data.name).toBe(firstCard.name);
    });

    it('should return 404 for non-existent card', async () => {
      const response = await request(app)
        .get('/api/cards/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Card Content Quality', () => {
    it('should have upright meanings for all cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      const cards = response.body.data;

      cards.forEach(card => {
        expect(card.keywords).toHaveProperty('upright');
        expect(Array.isArray(card.keywords.upright)).toBe(true);
        expect(card.keywords.upright.length).toBeGreaterThan(0);
      });
    });

    it('should have reversed meanings for all cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      const cards = response.body.data;

      cards.forEach(card => {
        expect(card.keywords).toHaveProperty('reversed');
        expect(Array.isArray(card.keywords.reversed)).toBe(true);
        expect(card.keywords.reversed.length).toBeGreaterThan(0);
      });
    });

    it('should have keywords for all cards', async () => {
      const response = await request(app)
        .get('/api/cards');

      const cards = response.body.data;

      cards.forEach(card => {
        expect(card).toHaveProperty('keywords');
        expect(card.keywords).toHaveProperty('upright');
        expect(card.keywords).toHaveProperty('reversed');
        expect(Array.isArray(card.keywords.upright)).toBe(true);
        expect(Array.isArray(card.keywords.reversed)).toBe(true);
      });
    });
  });
});
