/**
 * Quick check of Turso data
 */

require('dotenv').config({ path: '.env.production.local' });

const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  console.log('Checking Turso data...\n');

  // Check cards
  const cards = await db.execute('SELECT * FROM cards LIMIT 3');
  console.log('Cards sample:');
  console.log(JSON.stringify(cards.rows, null, 2));

  // Check users count
  const usersCount = await db.execute('SELECT COUNT(*) as count FROM users');
  console.log('\nUsers count:', usersCount.rows[0].count);

  // Check readings count
  const readingsCount = await db.execute('SELECT COUNT(*) as count FROM readings');
  console.log('Readings count:', readingsCount.rows[0].count);
}

main().catch(console.error);
