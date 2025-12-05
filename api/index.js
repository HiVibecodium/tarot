/**
 * Vercel Serverless API Entry Point
 */

// Load environment variables first
require('dotenv').config();

// Import and export the Express app
const app = require('../src/backend/index-json');

module.exports = app;
