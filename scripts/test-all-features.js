#!/usr/bin/env node

/**
 * Comprehensive Feature Testing Script
 * Tests all major features of the application
 */

const axios = require('axios');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const API_URL = process.env.API_URL || 'http://localhost:4000/api';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

class FeatureTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: []
    };
    this.token = null;
    this.testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass2025!#',
      displayName: 'Test User'
    };
  }

  log(type, message) {
    const icons = {
      pass: '✅',
      fail: '❌',
      skip: '⏭️',
      info: 'ℹ️',
      test: '🧪'
    };

    const colorMap = {
      pass: colors.green,
      fail: colors.red,
      skip: colors.yellow,
      info: colors.blue,
      test: colors.cyan
    };

    console.log(`${colorMap[type] || ''}${icons[type] || ''} ${message}${colors.reset}`);
  }

  async runTest(name, testFn) {
    this.log('test', `Testing: ${name}`);

    try {
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'passed' });
      this.log('pass', `PASSED: ${name}`);
      return true;
    } catch (error) {
      this.results.failed++;
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.error || error.message;
      this.results.tests.push({ name, status: 'failed', error: errorMsg });
      this.log('fail', `FAILED: ${name} - ${errorMsg}`);
      return false;
    }
  }

  async skipTest(name, reason) {
    this.results.skipped++;
    this.results.tests.push({ name, status: 'skipped', reason });
    this.log('skip', `SKIPPED: ${name} - ${reason}`);
  }

  // ===== HEALTH CHECKS =====

  async testHealthCheck() {
    await this.runTest('Health Check', async () => {
      const response = await axios.get(`${API_URL.replace('/api', '')}/health`);

      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }

      if (!response.data.success) {
        throw new Error('Health check failed');
      }
    });
  }

  async testFrontendAvailable() {
    await this.runTest('Frontend Available', async () => {
      const response = await axios.get(FRONTEND_URL);

      if (response.status !== 200) {
        throw new Error(`Frontend not available: ${response.status}`);
      }
    });
  }

  // ===== AUTHENTICATION =====

  async testRegistration() {
    await this.runTest('User Registration', async () => {
      const response = await axios.post(`${API_URL}/auth/register`, this.testUser);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }

      const token = response.data.token || response.data.data?.token;

      if (!token) {
        throw new Error('No token returned');
      }

      this.token = token;
    });
  }

  async testLogin() {
    await this.runTest('User Login', async () => {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: this.testUser.email,
        password: this.testUser.password
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed');
      }

      const token = response.data.token || response.data.data?.token;

      if (!token) {
        throw new Error('No token returned');
      }

      this.token = token;
    });
  }

  // ===== READINGS =====

  async testDailyReading() {
    await this.runTest('Daily Reading', async () => {
      const response = await axios.post(
        `${API_URL}/readings/daily`,
        {},
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Daily reading failed');
      }

      const reading = response.data.reading || response.data.data?.reading;

      if (!reading || !reading.cards) {
        throw new Error('No cards in reading');
      }
    });
  }

  async testDecisionReading() {
    await this.runTest('Decision Reading', async () => {
      const response = await axios.post(
        `${API_URL}/readings/decision`,
        {
          question: 'Should I test this feature?',
          context: 'work'
        },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Decision reading failed');
      }

      const reading = response.data.reading || response.data.data?.reading;

      if (!reading || !reading.cards) {
        throw new Error('No cards in reading');
      }

      if (reading.cards.length !== 3) {
        throw new Error('Expected 3 cards for decision reading');
      }
    });
  }

  // ===== ANALYTICS =====

  async testAnalyticsStats() {
    await this.runTest('Analytics Stats', async () => {
      const response = await axios.get(
        `${API_URL}/analytics/stats`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Stats failed');
      }

      if (!response.data.stats) {
        throw new Error('No stats returned');
      }

      // Check for expected fields
      const requiredFields = ['total', 'cards', 'engagement'];
      requiredFields.forEach(field => {
        if (!response.data.stats[field]) {
          throw new Error(`Missing field: ${field}`);
        }
      });
    });
  }

  async testAnalyticsInsights() {
    await this.runTest('Analytics Insights', async () => {
      const response = await axios.get(
        `${API_URL}/analytics/insights`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Insights failed');
      }

      if (!Array.isArray(response.data.insights)) {
        throw new Error('Insights should be an array');
      }
    });
  }

  // ===== SOCIAL FEATURES =====

  async testSocialSharing() {
    await this.runTest('Social Sharing', async () => {
      // First create a reading
      const readingResponse = await axios.post(
        `${API_URL}/readings/daily`,
        {},
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      const reading = readingResponse.data.reading || readingResponse.data.data?.reading;
      const readingId = reading?.id || reading?._id;

      if (!readingId) {
        throw new Error('No reading ID returned');
      }

      // Create share
      const shareResponse = await axios.post(
        `${API_URL}/social/share/create`,
        { readingId, privacy: 'public' },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!shareResponse.data.success) {
        throw new Error('Share creation failed');
      }

      if (!shareResponse.data.share.url) {
        throw new Error('No share URL returned');
      }
    });
  }

  async testReferralCode() {
    await this.runTest('Referral Code', async () => {
      const response = await axios.get(
        `${API_URL}/social/referral/code`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.data.success) {
        throw new Error('Referral code failed');
      }

      if (!response.data.referralCode) {
        throw new Error('No referral code returned');
      }

      if (!response.data.referralUrl) {
        throw new Error('No referral URL returned');
      }
    });
  }

  // ===== PAYMENT =====

  async testPaymentPricing() {
    await this.runTest('Payment Pricing', async () => {
      const response = await axios.get(`${API_URL}/payment/pricing`);

      if (!response.data.success) {
        throw new Error('Pricing failed');
      }

      if (!Array.isArray(response.data.plans)) {
        throw new Error('Plans should be an array');
      }

      if (response.data.plans.length === 0) {
        throw new Error('No plans returned');
      }
    });
  }

  // ===== CARDS =====

  async testGetCards() {
    await this.runTest('Get Tarot Cards', async () => {
      const response = await axios.get(`${API_URL}/cards`);

      if (!response.data.success) {
        throw new Error('Get cards failed');
      }

      const cards = response.data.cards || response.data.data;

      if (!Array.isArray(cards)) {
        throw new Error('Cards should be an array');
      }

      if (cards.length === 0) {
        throw new Error('No cards returned');
      }
    });
  }

  // ===== FILE CHECKS =====

  async testServiceWorker() {
    await this.runTest('Service Worker File Exists', async () => {
      const fs = require('fs');
      const path = require('path');

      const swPath = path.join(__dirname, '../src/frontend/public/service-worker.js');

      if (!fs.existsSync(swPath)) {
        throw new Error('Service Worker file not found');
      }
    });
  }

  async testExtensionManifest() {
    await this.runTest('Extension Manifest Exists', async () => {
      const fs = require('fs');
      const path = require('path');

      const manifestPath = path.join(__dirname, '../extension/manifest.json');

      if (!fs.existsSync(manifestPath)) {
        throw new Error('Extension manifest not found');
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      if (manifest.manifest_version !== 3) {
        throw new Error('Expected Manifest V3');
      }
    });
  }

  // ===== RUN ALL TESTS =====

  async runAll() {
    console.log(`\n${colors.blue}${'='.repeat(60)}`);
    console.log(`🧪 COMPREHENSIVE FEATURE TESTING`);
    console.log(`${'='.repeat(60)}${colors.reset}\n`);

    this.log('info', `API URL: ${API_URL}`);
    this.log('info', `Frontend URL: ${FRONTEND_URL}`);
    console.log('');

    // Health Checks
    console.log(`${colors.cyan}--- HEALTH CHECKS ---${colors.reset}`);
    await this.testHealthCheck();
    await this.testFrontendAvailable();
    console.log('');

    // File Checks
    console.log(`${colors.cyan}--- FILE STRUCTURE ---${colors.reset}`);
    await this.testServiceWorker();
    await this.testExtensionManifest();
    console.log('');

    // Public Endpoints
    console.log(`${colors.cyan}--- PUBLIC ENDPOINTS ---${colors.reset}`);
    await this.testGetCards();
    await this.testPaymentPricing();
    console.log('');

    // Authentication
    console.log(`${colors.cyan}--- AUTHENTICATION ---${colors.reset}`);
    await this.testRegistration();
    await this.testLogin();
    console.log('');

    // Readings
    console.log(`${colors.cyan}--- READINGS ---${colors.reset}`);
    await this.testDailyReading();
    await this.testDecisionReading();
    console.log('');

    // Analytics
    console.log(`${colors.cyan}--- ANALYTICS ---${colors.reset}`);
    await this.testAnalyticsStats();
    await this.testAnalyticsInsights();
    console.log('');

    // Social Features
    console.log(`${colors.cyan}--- SOCIAL FEATURES ---${colors.reset}`);
    await this.testSocialSharing();
    await this.testReferralCode();
    console.log('');

    // Print Results
    this.printResults();
  }

  printResults() {
    const total = this.results.passed + this.results.failed + this.results.skipped;
    const passRate = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;

    console.log(`\n${colors.blue}${'='.repeat(60)}`);
    console.log(`📊 TEST RESULTS`);
    console.log(`${'='.repeat(60)}${colors.reset}\n`);

    console.log(`${colors.green}✅ Passed:  ${this.results.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed:  ${this.results.failed}${colors.reset}`);
    console.log(`${colors.yellow}⏭️  Skipped: ${this.results.skipped}${colors.reset}`);
    console.log(`${colors.cyan}📈 Total:   ${total}${colors.reset}`);
    console.log(`${colors.blue}📊 Pass Rate: ${passRate}%${colors.reset}\n`);

    if (this.results.failed > 0) {
      console.log(`${colors.red}Failed Tests:${colors.reset}`);
      this.results.tests
        .filter(t => t.status === 'failed')
        .forEach((test, i) => {
          console.log(`  ${i + 1}. ${test.name}`);
          console.log(`     ${colors.red}${test.error}${colors.reset}`);
        });
      console.log('');
    }

    const statusColor = passRate === 100 ? colors.green :
                       passRate >= 80 ? colors.yellow : colors.red;

    console.log(`${statusColor}${'─'.repeat(60)}`);
    console.log(`OVERALL: ${passRate >= 80 ? 'PASSED' : 'FAILED'} (${passRate}%)`);
    console.log(`${'─'.repeat(60)}${colors.reset}\n`);

    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run tests
const tester = new FeatureTester();
tester.runAll().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
