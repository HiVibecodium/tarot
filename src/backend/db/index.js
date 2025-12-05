/**
 * Database Store Selector
 * Chooses between JSON store (local dev), Supabase, or Turso (production)
 */

const USE_SUPABASE = process.env.USE_SUPABASE === 'true' || process.env.SUPABASE_URL;
const USE_TURSO = process.env.USE_TURSO === 'true' || process.env.TURSO_DATABASE_URL;

let db;

if (USE_TURSO && process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  console.log('📦 Using Turso storage');
  db = require('./turso-store');
} else if (USE_SUPABASE && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  console.log('📦 Using Supabase storage');
  db = require('./supabase-store');
} else {
  console.log('📦 Using JSON file storage');
  db = require('./json-store');
}

module.exports = db;
