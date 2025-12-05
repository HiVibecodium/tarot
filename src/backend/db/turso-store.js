/**
 * Turso Storage Adapter
 * Uses libSQL (SQLite edge database)
 * Drop-in replacement for json-store.js
 */

const { createClient } = require('@libsql/client');

// Initialize Turso client
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let db = null;

class TursoStore {
  constructor() {
    this.initialized = false;
    this.dbPath = 'turso';
  }

  async init() {
    if (this.initialized) return;

    if (!tursoUrl || !tursoToken) {
      console.error('Missing Turso credentials. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
      throw new Error('Turso credentials not configured');
    }

    db = createClient({
      url: tursoUrl,
      authToken: tursoToken
    });

    // Create tables if they don't exist
    await this.createTables();

    console.log('✅ Turso Store initialized');
    this.initialized = true;
  }

  async createTables() {
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
        data_export_requested INTEGER DEFAULT 0,
        data_export_requested_at TEXT,
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

    // Cards table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_en TEXT,
        arcana TEXT,
        suit TEXT,
        number INTEGER,
        keywords TEXT DEFAULT '[]',
        meaning_upright TEXT,
        meaning_reversed TEXT,
        description TEXT,
        image_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        notification TEXT NOT NULL,
        status TEXT DEFAULT 'queued',
        sent_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(type)`);
  }

  // Generate UUID
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Convert row from DB format to app format
  fromDB(row, tableName) {
    if (!row) return null;

    const result = { _id: row.id };

    for (const [key, value] of Object.entries(row)) {
      if (key === 'id') continue;

      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

      // Parse JSON fields
      if (['birthInfo', 'astrologyProfile', 'preferences', 'stats', 'cards',
           'userContext', 'spreadData', 'keywords', 'interpretations', 'notification', 'journal',
           'outcome', 'numerology', 'astrology', 'notificationSettings', 'pushSubscription',
           'userFeedback', 'context', 'interpretation'].includes(camelKey)) {
        try {
          result[camelKey] = value ? JSON.parse(value) : (Array.isArray(value) ? [] : {});
        } catch {
          result[camelKey] = value;
        }
      } else if (['isActive', 'isEmailVerified', 'dataExportRequested'].includes(camelKey)) {
        result[camelKey] = Boolean(value);
      } else {
        result[camelKey] = value;
      }
    }

    return result;
  }

  // Convert app format to DB format
  toDB(doc) {
    if (!doc) return {};

    const result = {};

    for (const [key, value] of Object.entries(doc)) {
      if (key === '_id') {
        result.id = value;
        continue;
      }

      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

      // Stringify JSON fields
      if (['birthInfo', 'astrologyProfile', 'preferences', 'stats', 'cards',
           'userContext', 'spreadData', 'keywords', 'interpretations', 'notification', 'journal',
           'outcome', 'numerology', 'astrology', 'notificationSettings', 'pushSubscription',
           'userFeedback', 'context', 'interpretation'].includes(key)) {
        result[snakeKey] = typeof value === 'string' ? value : JSON.stringify(value || {});
      } else if (['isActive', 'isEmailVerified', 'dataExportRequested'].includes(key)) {
        result[snakeKey] = value ? 1 : 0;
      } else if (key === '_passwordModified' || key === 'isPremium') {
        // Skip internal fields
        continue;
      } else {
        result[snakeKey] = value;
      }
    }

    return result;
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  // Ensure db is initialized before any operation
  async ensureInit() {
    if (!this.initialized) {
      await this.init();
    }
  }

  async findOne(collectionName, query) {
    await this.ensureInit();

    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(query)) {
      const dbKey = key === '_id' ? 'id' : key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      conditions.push(`${dbKey} = ?`);
      params.push(value);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM ${collectionName} ${whereClause} LIMIT 1`;

    try {
      const result = await db.execute({ sql, args: params });
      if (result.rows.length === 0) return null;
      return this.fromDB(result.rows[0], collectionName);
    } catch (error) {
      console.error('Turso findOne error:', error);
      return null;
    }
  }

  async find(collectionName, query = {}) {
    await this.ensureInit();

    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(query)) {
      const dbKey = key === '_id' ? 'id' : key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      conditions.push(`${dbKey} = ?`);
      params.push(value);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM ${collectionName} ${whereClause}`;

    try {
      const result = await db.execute({ sql, args: params });
      return result.rows.map(row => this.fromDB(row, collectionName));
    } catch (error) {
      console.error('Turso find error:', error);
      return [];
    }
  }

  async insertOne(collectionName, document) {
    await this.ensureInit();

    const doc = this.toDB(document);
    if (!doc.id) {
      doc.id = this.generateId();
    }
    doc.created_at = new Date().toISOString();
    doc.updated_at = new Date().toISOString();

    const keys = Object.keys(doc);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(doc);

    const sql = `INSERT INTO ${collectionName} (${keys.join(', ')}) VALUES (${placeholders})`;

    try {
      await db.execute({ sql, args: values });
      return this.fromDB({ ...doc }, collectionName);
    } catch (error) {
      console.error('Turso insertOne error:', error);
      throw error;
    }
  }

  async updateOne(collectionName, query, update) {
    await this.ensureInit();

    const updateDoc = this.toDB(update);
    delete updateDoc.id;
    delete updateDoc.created_at;
    updateDoc.updated_at = new Date().toISOString();

    const setClauses = [];
    const setValues = [];

    for (const [key, value] of Object.entries(updateDoc)) {
      setClauses.push(`${key} = ?`);
      setValues.push(value);
    }

    const conditions = [];
    const queryValues = [];

    for (const [key, value] of Object.entries(query)) {
      const dbKey = key === '_id' ? 'id' : key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      conditions.push(`${dbKey} = ?`);
      queryValues.push(value);
    }

    const sql = `UPDATE ${collectionName} SET ${setClauses.join(', ')} WHERE ${conditions.join(' AND ')}`;

    try {
      await db.execute({ sql, args: [...setValues, ...queryValues] });
      return await this.findOne(collectionName, query);
    } catch (error) {
      console.error('Turso updateOne error:', error);
      return null;
    }
  }

  async deleteOne(collectionName, query) {
    await this.ensureInit();

    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(query)) {
      const dbKey = key === '_id' ? 'id' : key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      conditions.push(`${dbKey} = ?`);
      params.push(value);
    }

    const sql = `DELETE FROM ${collectionName} WHERE ${conditions.join(' AND ')}`;

    try {
      const result = await db.execute({ sql, args: params });
      return { deleted: result.rowsAffected > 0 };
    } catch (error) {
      console.error('Turso deleteOne error:', error);
      return null;
    }
  }

  async count(collectionName, query = {}) {
    await this.ensureInit();

    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(query)) {
      const dbKey = key === '_id' ? 'id' : key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      conditions.push(`${dbKey} = ?`);
      params.push(value);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT COUNT(*) as count FROM ${collectionName} ${whereClause}`;

    try {
      const result = await db.execute({ sql, args: params });
      return result.rows[0]?.count || 0;
    } catch (error) {
      console.error('Turso count error:', error);
      return 0;
    }
  }

  async clear(collectionName) {
    await this.ensureInit();

    try {
      await db.execute(`DELETE FROM ${collectionName}`);
    } catch (error) {
      console.error('Turso clear error:', error);
    }
  }
}

// Singleton instance
module.exports = new TursoStore();
