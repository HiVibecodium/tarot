/**
 * Migration Script: JSON Store -> Turso
 * Transfers all data from local JSON files to Turso cloud database
 */

require('dotenv').config({ path: '.env.production.local' });

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Data directory
const DATA_DIR = path.join(__dirname, '..', 'src', 'backend', 'db', 'data');

// Turso client
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function createTables() {
  console.log('Creating tables...');

  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      display_name TEXT,
      subscription_tier TEXT DEFAULT 'free',
      subscription_expiry TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      birth_info TEXT DEFAULT '{}',
      astrology_profile TEXT DEFAULT '{}',
      preferences TEXT DEFAULT '{}',
      stats TEXT DEFAULT '{}',
      numerology TEXT,
      astrology TEXT,
      notification_settings TEXT,
      push_subscription TEXT,
      is_active INTEGER DEFAULT 1,
      is_email_verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Readings table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS readings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      type TEXT NOT NULL,
      question TEXT,
      cards TEXT DEFAULT '[]',
      interpretation TEXT,
      user_context TEXT DEFAULT '{}',
      spread_data TEXT DEFAULT '{}',
      journal TEXT,
      outcome TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Cards table - drop and recreate with correct schema
  await db.execute(`DROP TABLE IF EXISTS cards`);
  await db.execute(`
    CREATE TABLE cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      arcana TEXT,
      suit TEXT,
      number INTEGER,
      keywords TEXT DEFAULT '{}',
      interpretations TEXT DEFAULT '{}',
      image_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Shares table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      reading_id TEXT,
      share_type TEXT,
      share_data TEXT DEFAULT '{}',
      views INTEGER DEFAULT 0,
      expires_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(type)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_shares_reading_id ON shares(reading_id)`);

  console.log('Tables created successfully!');
}

async function loadJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

async function migrateCards() {
  console.log('\nMigrating cards...');
  const cards = await loadJSON('cards.json');

  if (cards.length === 0) {
    console.log('No cards to migrate');
    return;
  }

  let migrated = 0;
  for (const card of cards) {
    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO cards (id, name, name_en, arcana, suit, number, keywords, interpretations, image_url, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          card._id || card.id,
          card.name,
          card.nameEn || card.name_en || null,
          card.arcana,
          card.suit || null,
          card.number,
          JSON.stringify(card.keywords || {}),
          JSON.stringify(card.interpretations || {}),
          card.imageUrl || card.image_url || null,
          card.createdAt || card.created_at || new Date().toISOString()
        ]
      });
      migrated++;
    } catch (error) {
      console.error(`Error migrating card ${card._id}:`, error.message);
    }
  }

  console.log(`Migrated ${migrated}/${cards.length} cards`);
}

async function migrateUsers() {
  console.log('\nMigrating users...');
  const users = await loadJSON('users.json');

  if (users.length === 0) {
    console.log('No users to migrate');
    return;
  }

  let migrated = 0;
  for (const user of users) {
    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO users (id, email, password, display_name, subscription_tier, subscription_expiry,
              stripe_customer_id, stripe_subscription_id, birth_info, astrology_profile, preferences, stats,
              numerology, astrology, notification_settings, push_subscription, is_active, is_email_verified, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          user._id || user.id,
          user.email,
          user.password,
          user.displayName || user.display_name || null,
          user.subscriptionTier || user.subscription_tier || 'free',
          user.subscriptionExpiry || user.subscription_expiry || null,
          user.stripeCustomerId || user.stripe_customer_id || null,
          user.stripeSubscriptionId || user.stripe_subscription_id || null,
          JSON.stringify(user.birthInfo || user.birth_info || {}),
          JSON.stringify(user.astrologyProfile || user.astrology_profile || {}),
          JSON.stringify(user.preferences || {}),
          JSON.stringify(user.stats || {}),
          JSON.stringify(user.numerology || null),
          JSON.stringify(user.astrology || null),
          JSON.stringify(user.notificationSettings || user.notification_settings || null),
          JSON.stringify(user.pushSubscription || user.push_subscription || null),
          user.isActive !== false ? 1 : 0,
          user.isEmailVerified ? 1 : 0,
          user.createdAt || user.created_at || new Date().toISOString(),
          user.updatedAt || user.updated_at || new Date().toISOString()
        ]
      });
      migrated++;
    } catch (error) {
      console.error(`Error migrating user ${user.email}:`, error.message);
    }
  }

  console.log(`Migrated ${migrated}/${users.length} users`);
}

async function migrateReadings() {
  console.log('\nMigrating readings...');
  const readings = await loadJSON('readings.json');

  if (readings.length === 0) {
    console.log('No readings to migrate');
    return;
  }

  let migrated = 0;
  for (const reading of readings) {
    try {
      const id = reading._id || reading.id || `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await db.execute({
        sql: `INSERT OR REPLACE INTO readings (id, user_id, type, question, cards, interpretation, user_context, spread_data, journal, outcome, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          reading.userId || reading.user_id || null,
          reading.type || 'daily',
          reading.question || null,
          JSON.stringify(reading.cards || []),
          JSON.stringify(reading.interpretation || {}),
          JSON.stringify(reading.userContext || reading.user_context || reading.context || {}),
          JSON.stringify(reading.spreadData || reading.spread_data || {}),
          JSON.stringify(reading.journal || null),
          reading.outcome || null,
          reading.createdAt || reading.created_at || new Date().toISOString(),
          reading.updatedAt || reading.updated_at || new Date().toISOString()
        ]
      });
      migrated++;
    } catch (error) {
      console.error(`Error migrating reading:`, error.message);
    }
  }

  console.log(`Migrated ${migrated}/${readings.length} readings`);
}

async function migrateShares() {
  console.log('\nMigrating shares...');
  const shares = await loadJSON('shares.json');

  if (shares.length === 0) {
    console.log('No shares to migrate');
    return;
  }

  let migrated = 0;
  for (const share of shares) {
    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO shares (id, user_id, reading_id, share_type, share_data, views, expires_at, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          share._id || share.id,
          share.userId || share.user_id || null,
          share.readingId || share.reading_id || null,
          share.shareType || share.share_type || 'link',
          JSON.stringify(share.shareData || share.share_data || {}),
          share.views || 0,
          share.expiresAt || share.expires_at || null,
          share.createdAt || share.created_at || new Date().toISOString()
        ]
      });
      migrated++;
    } catch (error) {
      console.error(`Error migrating share:`, error.message);
    }
  }

  console.log(`Migrated ${migrated}/${shares.length} shares`);
}

async function verifyCounts() {
  console.log('\n--- Verification ---');

  const tables = ['cards', 'users', 'readings', 'shares'];

  for (const table of tables) {
    try {
      const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table}: ${result.rows[0].count} records`);
    } catch (error) {
      console.log(`${table}: Error - ${error.message}`);
    }
  }
}

async function main() {
  console.log('=== Turso Migration Script ===\n');

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('Missing Turso credentials!');
    console.error('Make sure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set in .env.production.local');
    process.exit(1);
  }

  console.log('Turso URL:', process.env.TURSO_DATABASE_URL);
  console.log('Data directory:', DATA_DIR);

  try {
    await createTables();
    await migrateCards();
    await migrateUsers();
    await migrateReadings();
    await migrateShares();
    await verifyCounts();

    console.log('\n=== Migration Complete ===');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
