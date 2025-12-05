/**
 * Debug endpoint for Vercel - test backend loading
 */
module.exports = (req, res) => {
  require('dotenv').config();

  const debug = {
    success: true,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      USE_TURSO: process.env.USE_TURSO,
      HAS_TURSO_URL: !!process.env.TURSO_DATABASE_URL,
      HAS_TURSO_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
      HAS_STRIPE_KEY: !!process.env.STRIPE_SECRET_KEY,
      HAS_ALLOWED_ORIGINS: !!process.env.ALLOWED_ORIGINS,
      VERCEL: process.env.VERCEL
    },
    tests: {},
    backendLoad: null
  };

  // Test npm packages
  const packages = ['express', 'cors', 'dotenv', '@libsql/client'];
  for (const pkg of packages) {
    try {
      require(pkg);
      debug.tests[pkg] = 'OK';
    } catch (e) {
      debug.tests[pkg] = 'FAIL: ' + e.message;
    }
  }

  // Try to load the backend
  try {
    const app = require('../src/backend/index-json');
    debug.backendLoad = 'OK - Express app loaded';
  } catch (e) {
    debug.backendLoad = 'FAIL: ' + e.message + '\nStack: ' + e.stack;
  }

  res.status(200).json(debug);
};
