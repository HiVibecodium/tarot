/**
 * Authentication Tests
 * Tests for user registration, login, and JWT token validation
 */

const request = require('supertest');
const app = require('../index-json');

describe('Authentication API', () => {
  let testEmail;
  let testToken;

  beforeAll(() => {
    // Generate unique email for this test run
    testEmail = `test-${Date.now()}@example.com`;
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'SecurePass2024',
          displayName: 'Test User'
        });

      if (response.status !== 201) {
        console.log('Registration failed:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testEmail);
      expect(response.body.data.user).not.toHaveProperty('password'); // Password should not be returned

      // Save token for later tests
      testToken = response.body.data.token;
    });

    it('should reject registration with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail, // Same email as before
          password: 'Test123!@#',
          displayName: 'Another User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'Test123!@#',
          displayName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-weak-${Date.now()}@example.com`,
          password: '123', // Too weak
          displayName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration without displayName', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-noname-${Date.now()}@example.com`,
          password: 'Test123!@#'
          // Missing displayName
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Register user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'SecurePass2024',
          displayName: 'Test User'
        });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'SecurePass2024'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testEmail);

      // Save token for later tests
      testToken = response.body.data.token;
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toMatch(/INVALID_CREDENTIALS|AUTHENTICATION_FAILED|WRONG_PASSWORD/);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!@#'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login without password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('JWT Token Validation', () => {
    let jwtToken;
    let jwtEmail;

    beforeAll(async () => {
      // Register and login to get a valid token
      jwtEmail = `jwt-test-${Date.now()}@example.com`;
      const regResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: jwtEmail,
          password: 'SecurePass2024',
          displayName: 'JWT Test User'
        });

      jwtToken = regResponse.body.data.token;
    });

    it('should accept valid JWT token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(jwtEmail);
    });

    it('should reject invalid JWT token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request without JWT token', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
