/**
 * Production Build Check
 * Comprehensive smoke tests for production deployment
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://ai-tarot-assistant.vercel.app';
const TIMEOUT = 10000;

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper functions
const log = {
  test: (name) => console.log(`\n🧪 Testing: ${name}...`),
  pass: (msg) => { console.log(`  ✅ ${msg}`); results.passed.push(msg); },
  fail: (msg) => { console.log(`  ❌ ${msg}`); results.failed.push(msg); },
  warn: (msg) => { console.log(`  ⚠️  ${msg}`); results.warnings.push(msg); },
  info: (msg) => console.log(`  ℹ️  ${msg}`)
};

// Tests
async function testHealthEndpoint() {
  log.test('Health Endpoint');

  try {
    const response = await axios.get(`${PRODUCTION_URL}/health`, { timeout: TIMEOUT });

    if (response.status === 200) {
      log.pass('Health endpoint returns 200');
    } else {
      log.fail(`Health endpoint returns ${response.status}`);
    }

    if (response.data.success) {
      log.pass('Health response has success:true');
    } else {
      log.fail('Health response missing success field');
    }

    if (response.data.environment === 'production') {
      log.pass('Environment is production');
    } else {
      log.warn(`Environment is ${response.data.environment}, expected production`);
    }

    if (response.data.storage) {
      log.info(`Storage type: ${response.data.storage}`);
    }

    if (response.data.uptime) {
      log.info(`Server uptime: ${Math.floor(response.data.uptime)}s`);
    }

  } catch (error) {
    log.fail(`Health endpoint failed: ${error.message}`);
  }
}

async function testPWAAssets() {
  log.test('PWA Icons and Assets');

  const assets = [
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/icon-192.png',
    '/icon-512.png',
    '/apple-touch-icon.png',
    '/tarot-icon.svg',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml'
  ];

  for (const asset of assets) {
    try {
      const response = await axios.head(`${PRODUCTION_URL}${asset}`, { timeout: TIMEOUT });

      if (response.status === 200) {
        log.pass(`${asset} exists (${response.status})`);
      } else {
        log.warn(`${asset} returns ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        log.fail(`${asset} not found (404)`);
      } else {
        log.fail(`${asset} error: ${error.message}`);
      }
    }
  }
}

async function testAPIEndpoints() {
  log.test('API Endpoints');

  // Test cards endpoint (public)
  try {
    const response = await axios.get(`${PRODUCTION_URL}/api/cards`, { timeout: TIMEOUT });

    if (response.status === 200) {
      log.pass('GET /api/cards returns 200');
    }

    if (response.data.data && response.data.data.cards) {
      const cardCount = response.data.data.cards.length;
      if (cardCount === 78) {
        log.pass(`All 78 tarot cards loaded`);
      } else {
        log.warn(`Only ${cardCount} cards found, expected 78`);
      }
    }
  } catch (error) {
    log.fail(`GET /api/cards failed: ${error.message}`);
  }

  // Test auth endpoint (should reject without credentials)
  try {
    const response = await axios.post(`${PRODUCTION_URL}/api/readings/daily`, {}, {
      timeout: TIMEOUT,
      validateStatus: () => true // Don't throw on 401
    });

    if (response.status === 401) {
      log.pass('Protected endpoint requires authentication (401)');
    } else {
      log.warn(`Protected endpoint returns ${response.status}, expected 401`);
    }
  } catch (error) {
    log.fail(`Auth test failed: ${error.message}`);
  }
}

async function testSecurity() {
  log.test('Security Headers');

  try {
    const response = await axios.get(`${PRODUCTION_URL}/health`, { timeout: TIMEOUT });

    const headers = response.headers;

    // Check helmet security headers
    if (headers['x-dns-prefetch-control']) {
      log.pass('X-DNS-Prefetch-Control header present');
    } else {
      log.warn('X-DNS-Prefetch-Control header missing');
    }

    if (headers['x-frame-options']) {
      log.pass(`X-Frame-Options: ${headers['x-frame-options']}`);
    } else {
      log.warn('X-Frame-Options header missing');
    }

    if (headers['strict-transport-security']) {
      log.pass('HSTS header present');
    } else {
      log.warn('Strict-Transport-Security header missing (Render should add this)');
    }

    if (headers['x-content-type-options']) {
      log.pass('X-Content-Type-Options header present');
    } else {
      log.warn('X-Content-Type-Options header missing');
    }

  } catch (error) {
    log.fail(`Security headers check failed: ${error.message}`);
  }
}

async function testCORS() {
  log.test('CORS Configuration');

  try {
    const response = await axios.options(`${PRODUCTION_URL}/api/cards`, {
      headers: {
        'Origin': PRODUCTION_URL,
        'Access-Control-Request-Method': 'GET'
      },
      timeout: TIMEOUT,
      validateStatus: () => true
    });

    if (response.headers['access-control-allow-origin']) {
      log.pass(`CORS allows origin: ${response.headers['access-control-allow-origin']}`);
    } else {
      log.warn('CORS headers not found');
    }

  } catch (error) {
    log.info(`CORS test skipped: ${error.message}`);
  }
}

async function testFrontendBuild() {
  log.test('Frontend Build');

  try {
    const response = await axios.get(PRODUCTION_URL, { timeout: TIMEOUT });

    if (response.status === 200) {
      log.pass('Frontend index.html loads (200)');
    }

    const html = response.data;

    // Check for critical elements
    if (html.includes('<div id="root">')) {
      log.pass('React root element present');
    } else {
      log.fail('React root element missing');
    }

    if (html.includes('manifest.json')) {
      log.pass('PWA manifest linked');
    } else {
      log.warn('PWA manifest link missing');
    }

    if (html.includes('icon')) {
      log.pass('Favicon links present');
    } else {
      log.warn('Favicon links missing');
    }

    // Check for assets
    const scriptMatches = html.match(/<script.*?src="([^"]+)"/g);
    if (scriptMatches && scriptMatches.length > 0) {
      log.pass(`${scriptMatches.length} script tags found`);
    } else {
      log.fail('No script tags found');
    }

    const cssMatches = html.match(/<link.*?href="([^"]+\.css)"/g);
    if (cssMatches && cssMatches.length > 0) {
      log.pass(`${cssMatches.length} CSS links found`);
    } else {
      log.warn('No CSS links found (might be in JS)');
    }

  } catch (error) {
    log.fail(`Frontend build check failed: ${error.message}`);
  }
}

async function testLocalBuild() {
  log.test('Local Frontend Build');

  const distPath = path.join(__dirname, '../src/frontend/dist');

  if (fs.existsSync(distPath)) {
    log.pass('dist/ folder exists');

    // Check index.html
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      log.pass('dist/index.html exists');

      const indexSize = fs.statSync(indexPath).size;
      log.info(`index.html size: ${(indexSize / 1024).toFixed(2)} KB`);
    } else {
      log.fail('dist/index.html missing');
    }

    // Check assets
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const files = fs.readdirSync(assetsPath);
      log.pass(`${files.length} files in assets/`);

      const jsFiles = files.filter(f => f.endsWith('.js'));
      const cssFiles = files.filter(f => f.endsWith('.css'));

      log.info(`${jsFiles.length} JS files, ${cssFiles.length} CSS files`);

      // Check bundle sizes
      const mainJsFile = jsFiles.find(f => f.startsWith('index-'));
      if (mainJsFile) {
        const size = fs.statSync(path.join(assetsPath, mainJsFile)).size;
        const sizeKB = (size / 1024).toFixed(0);

        if (size < 500 * 1024) { // < 500KB
          log.pass(`Main bundle: ${sizeKB} KB (good)`);
        } else if (size < 1000 * 1024) { // < 1MB
          log.warn(`Main bundle: ${sizeKB} KB (acceptable, but large)`);
        } else {
          log.fail(`Main bundle: ${sizeKB} KB (too large!)`);
        }
      }
    } else {
      log.warn('assets/ folder missing');
    }

    // Check icons
    const icons = [
      'favicon.ico',
      'icon-192.png',
      'icon-512.png',
      'apple-touch-icon.png'
    ];

    for (const icon of icons) {
      if (fs.existsSync(path.join(distPath, icon))) {
        log.pass(`${icon} in dist/`);
      } else {
        log.fail(`${icon} missing from dist/`);
      }
    }

  } else {
    log.fail('dist/ folder not found. Run: cd src/frontend && npm run build');
  }
}

async function testEnvironmentVariables() {
  log.test('Environment Variables Configuration');

  log.info('Checking if critical env vars are likely set...');

  // We can't check server env vars directly, but we can infer from behavior
  try {
    // Check if JWT auth works (needs JWT_SECRET)
    const testEmail = `test-${Date.now()}@example.com`;
    const response = await axios.post(`${PRODUCTION_URL}/api/auth/register`, {
      email: testEmail,
      password: 'Test123!',
      displayName: 'Test User'
    }, {
      timeout: TIMEOUT,
      validateStatus: () => true
    });

    if (response.status === 201 && response.data.data && response.data.data.token) {
      log.pass('JWT_SECRET configured (registration works)');
      log.info('Test user created successfully');
    } else if (response.status === 500 && response.data.error && response.data.error.message.includes('secret')) {
      log.fail('JWT_SECRET not configured');
    } else {
      log.info(`Registration response: ${response.status}`);
    }

  } catch (error) {
    log.warn(`Could not test env vars: ${error.message}`);
  }
}

// Main execution
async function runTests() {
  console.log('🚀 ================================');
  console.log('🚀 PRODUCTION BUILD CHECK');
  console.log(`🌐 Target: ${PRODUCTION_URL}`);
  console.log('🚀 ================================\n');

  await testHealthEndpoint();
  await testPWAAssets();
  await testAPIEndpoints();
  await testSecurity();
  await testCORS();
  await testFrontendBuild();
  await testLocalBuild();
  await testEnvironmentVariables();

  // Summary
  console.log('\n📊 ================================');
  console.log('📊 TEST SUMMARY');
  console.log('📊 ================================\n');

  console.log(`✅ Passed:   ${results.passed.length}`);
  console.log(`❌ Failed:   ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  const total = results.passed.length + results.failed.length + results.warnings.length;
  const passRate = total > 0 ? Math.round((results.passed.length / total) * 100) : 0;

  console.log(`\n📈 Pass Rate: ${passRate}%`);

  if (results.failed.length === 0) {
    console.log('\n🎉 ALL CRITICAL TESTS PASSED!');
    console.log('✅ Ready for production deployment');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED:');
    results.failed.forEach(msg => console.log(`   - ${msg}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (non-critical):');
    results.warnings.forEach(msg => console.log(`   - ${msg}`));
  }

  console.log('\n🚀 ================================\n');

  // Exit code
  if (results.failed.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run
runTests().catch(error => {
  console.error('❌ Production check failed:', error);
  process.exit(1);
});
