/**
 * Jest Configuration
 * Testing framework configuration for AI Tarot Decision Assistant
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test files pattern
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/backend/**/*.js',
    '!src/backend/__tests__/**',
    '!src/backend/node_modules/**',
    '!src/backend/scripts/**',
    '!src/backend/config/**'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true
};
