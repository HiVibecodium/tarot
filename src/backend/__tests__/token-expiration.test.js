/**
 * Token Expiration Tests
 * Tests for JWT token expiration handling and auto-logout
 */

const request = require('supertest');
const app = require('../index-json');
const jwt = require('jsonwebtoken');

describe('Token Expiration API', () => {
  let testEmail;
  let validToken;
  let expiredToken;
  let userId;

  beforeAll(async () => {
    // Create a test user and get valid token
    testEmail = `test-token-${Date.now()}@example.com`;

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'SecurePass2024',
        displayName: 'Token Test User'
      });

    validToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;

    // Create an expired token (expired 1 hour ago)
    expiredToken = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET,
      { expiresIn: '-1h' }
    );
  });

  describe('Expired Token Handling', () => {
    it('should reject request with expired token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOKEN_EXPIRED');
      expect(response.body.error.message).toBe('Authentication token has expired');
    });

    it('should reject daily reading with expired token', async () => {
      const response = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ mood: 'curious' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOKEN_EXPIRED');
    });

    it('should reject decision reading with expired token', async () => {
      const response = await request(app)
        .post('/api/readings/decision')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          question: 'Test question?',
          options: ['Option 1', 'Option 2']
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOKEN_EXPIRED');
    });
  });

  describe('Invalid Token Handling', () => {
    it('should reject request with invalid token format', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject request with malformed token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer malformed-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NO_TOKEN');
    });
  });

  describe('Valid Token Handling', () => {
    it('should accept request with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testEmail);
    });

    it('should allow daily reading with valid token', async () => {
      const response = await request(app)
        .post('/api/readings/daily')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ mood: 'curious' });

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Public Endpoints (No Token Required)', () => {
    it('should allow access to cards without token', async () => {
      const response = await request(app)
        .get('/api/cards');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should allow natal chart calculation without token', async () => {
      const response = await request(app)
        .post('/api/astrology/calculate-temp')
        .send({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          birthCity: 'Moscow',
          latitude: 55.7558,
          longitude: 37.6173,
          timezone: 'Europe/Moscow'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('calculated');
    });

    it('should allow moon phase access without token', async () => {
      const response = await request(app)
        .get('/api/moon/current');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Token Refresh Scenarios', () => {
    it('should work after re-login with new token', async () => {
      // Login again to get new token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'SecurePass2024'
        });

      expect(loginResponse.status).toBe(200);
      const newToken = loginResponse.body.data.token;

      // Use new token
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${newToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
