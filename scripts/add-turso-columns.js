/**
 * Add missing columns to Turso users table
 */

require('dotenv').config({ path: '.env.production.local' });

const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  console.log('Adding missing columns to users table...\n');

  try {
    // Add data_export_requested column
    await db.execute(`
      ALTER TABLE users ADD COLUMN data_export_requested INTEGER DEFAULT 0
    `);
    console.log('Added: data_export_requested');
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log('Column data_export_requested already exists');
    } else {
      console.log('data_export_requested:', error.message);
    }
  }

  try {
    // Add data_export_requested_at column
    await db.execute(`
      ALTER TABLE users ADD COLUMN data_export_requested_at TEXT
    `);
    console.log('Added: data_export_requested_at');
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log('Column data_export_requested_at already exists');
    } else {
      console.log('data_export_requested_at:', error.message);
    }
  }

  // Verify columns
  console.log('\nVerifying table structure...');
  const result = await db.execute('PRAGMA table_info(users)');
  console.log('\nUsers table columns:');
  result.rows.forEach(row => {
    console.log(`  - ${row.name} (${row.type})`);
  });

  console.log('\nDone!');
}

main().catch(console.error);
