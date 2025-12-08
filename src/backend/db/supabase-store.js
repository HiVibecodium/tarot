/**
 * Supabase Storage Adapter
 * Drop-in replacement for json-store.js
 * Uses Supabase PostgreSQL database
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend

let supabase = null;

// Collection name mapping (JSON -> Supabase table names)
const TABLE_MAP = {
  'users': 'users',
  'readings': 'readings',
  'cards': 'cards',
  'notifications': 'notifications',
  'journal_entries': 'journal_entries'
};

// Field name mapping (camelCase -> snake_case)
const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const _toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Convert object keys between cases
const _convertKeys = (obj, converter) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => _convertKeys(item, converter));
  if (typeof obj !== 'object') return obj;

  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = converter(key);
    converted[newKey] = (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date))
      ? _convertKeys(value, converter)
      : value;
  }
  return converted;
};

// Convert DB row to app format
const fromDB = (row) => {
  if (!row) return null;

  const converted = {
    _id: row.id,
    ...row
  };
  delete converted.id;

  // Convert snake_case to camelCase for specific fields
  if (converted.display_name !== undefined) {
    converted.displayName = converted.display_name;
    delete converted.display_name;
  }
  if (converted.subscription_tier !== undefined) {
    converted.subscriptionTier = converted.subscription_tier;
    delete converted.subscription_tier;
  }
  if (converted.subscription_expiry !== undefined) {
    converted.subscriptionExpiry = converted.subscription_expiry;
    delete converted.subscription_expiry;
  }
  if (converted.stripe_customer_id !== undefined) {
    converted.stripeCustomerId = converted.stripe_customer_id;
    delete converted.stripe_customer_id;
  }
  if (converted.stripe_subscription_id !== undefined) {
    converted.stripeSubscriptionId = converted.stripe_subscription_id;
    delete converted.stripe_subscription_id;
  }
  if (converted.birth_info !== undefined) {
    converted.birthInfo = converted.birth_info;
    delete converted.birth_info;
  }
  if (converted.astrology_profile !== undefined) {
    converted.astrologyProfile = converted.astrology_profile;
    delete converted.astrology_profile;
  }
  if (converted.is_active !== undefined) {
    converted.isActive = converted.is_active;
    delete converted.is_active;
  }
  if (converted.is_email_verified !== undefined) {
    converted.isEmailVerified = converted.is_email_verified;
    delete converted.is_email_verified;
  }
  if (converted.created_at !== undefined) {
    converted.createdAt = converted.created_at;
    delete converted.created_at;
  }
  if (converted.updated_at !== undefined) {
    converted.updatedAt = converted.updated_at;
    delete converted.updated_at;
  }
  if (converted.user_id !== undefined) {
    converted.userId = converted.user_id;
    delete converted.user_id;
  }
  if (converted.user_context !== undefined) {
    converted.userContext = converted.user_context;
    delete converted.user_context;
  }
  if (converted.spread_data !== undefined) {
    converted.spreadData = converted.spread_data;
    delete converted.spread_data;
  }

  return converted;
};

// Convert app format to DB format
const toDB = (doc) => {
  if (!doc) return null;

  const converted = { ...doc };

  // Convert _id to id
  if (converted._id) {
    converted.id = converted._id;
    delete converted._id;
  }

  // Convert camelCase to snake_case
  if (converted.displayName !== undefined) {
    converted.display_name = converted.displayName;
    delete converted.displayName;
  }
  if (converted.subscriptionTier !== undefined) {
    converted.subscription_tier = converted.subscriptionTier;
    delete converted.subscriptionTier;
  }
  if (converted.subscriptionExpiry !== undefined) {
    converted.subscription_expiry = converted.subscriptionExpiry;
    delete converted.subscriptionExpiry;
  }
  if (converted.stripeCustomerId !== undefined) {
    converted.stripe_customer_id = converted.stripeCustomerId;
    delete converted.stripeCustomerId;
  }
  if (converted.stripeSubscriptionId !== undefined) {
    converted.stripe_subscription_id = converted.stripeSubscriptionId;
    delete converted.stripeSubscriptionId;
  }
  if (converted.birthInfo !== undefined) {
    converted.birth_info = converted.birthInfo;
    delete converted.birthInfo;
  }
  if (converted.astrologyProfile !== undefined) {
    converted.astrology_profile = converted.astrologyProfile;
    delete converted.astrologyProfile;
  }
  if (converted.isActive !== undefined) {
    converted.is_active = converted.isActive;
    delete converted.isActive;
  }
  if (converted.isEmailVerified !== undefined) {
    converted.is_email_verified = converted.isEmailVerified;
    delete converted.isEmailVerified;
  }
  if (converted.createdAt !== undefined) {
    converted.created_at = converted.createdAt;
    delete converted.createdAt;
  }
  if (converted.updatedAt !== undefined) {
    converted.updated_at = converted.updatedAt;
    delete converted.updatedAt;
  }
  if (converted.userId !== undefined) {
    converted.user_id = converted.userId;
    delete converted.userId;
  }
  if (converted.userContext !== undefined) {
    converted.user_context = converted.userContext;
    delete converted.userContext;
  }
  if (converted.spreadData !== undefined) {
    converted.spread_data = converted.spreadData;
    delete converted.spreadData;
  }

  // Remove internal fields
  delete converted._passwordModified;
  delete converted.isPremium;

  return converted;
};

class SupabaseStore {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY');
      throw new Error('Supabase credentials not configured');
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Supabase Store initialized');
    this.initialized = true;
  }

  getClient() {
    if (!supabase) {
      throw new Error('Supabase not initialized. Call init() first.');
    }
    return supabase;
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  async findOne(collectionName, query) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    let queryBuilder = client.from(tableName).select('*');

    // Build query
    for (const [key, value] of Object.entries(query)) {
      if (key === '_id') {
        queryBuilder = queryBuilder.eq('id', value);
      } else {
        const dbKey = toSnakeCase(key);
        queryBuilder = queryBuilder.eq(dbKey, value);
      }
    }

    const { data, error } = await queryBuilder.limit(1).single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Supabase findOne error:', error);
      return null;
    }

    return fromDB(data);
  }

  async find(collectionName, query = {}) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    let queryBuilder = client.from(tableName).select('*');

    // Build query
    for (const [key, value] of Object.entries(query)) {
      if (key === '_id') {
        queryBuilder = queryBuilder.eq('id', value);
      } else {
        const dbKey = toSnakeCase(key);
        queryBuilder = queryBuilder.eq(dbKey, value);
      }
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Supabase find error:', error);
      return [];
    }

    return (data || []).map(fromDB);
  }

  async insertOne(collectionName, document) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    const dbDoc = toDB(document);
    delete dbDoc.id; // Let Supabase generate UUID

    const { data, error } = await client
      .from(tableName)
      .insert(dbDoc)
      .select()
      .single();

    if (error) {
      console.error('Supabase insertOne error:', error);
      throw error;
    }

    return fromDB(data);
  }

  async updateOne(collectionName, query, update) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    const dbUpdate = toDB(update);
    delete dbUpdate.id; // Don't update ID

    let queryBuilder = client.from(tableName).update(dbUpdate);

    // Build query
    for (const [key, value] of Object.entries(query)) {
      if (key === '_id') {
        queryBuilder = queryBuilder.eq('id', value);
      } else {
        const dbKey = toSnakeCase(key);
        queryBuilder = queryBuilder.eq(dbKey, value);
      }
    }

    const { data, error } = await queryBuilder.select().single();

    if (error) {
      console.error('Supabase updateOne error:', error);
      return null;
    }

    return fromDB(data);
  }

  async deleteOne(collectionName, query) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    let queryBuilder = client.from(tableName).delete();

    // Build query
    for (const [key, value] of Object.entries(query)) {
      if (key === '_id') {
        queryBuilder = queryBuilder.eq('id', value);
      } else {
        const dbKey = toSnakeCase(key);
        queryBuilder = queryBuilder.eq(dbKey, value);
      }
    }

    const { data, error } = await queryBuilder.select().single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase deleteOne error:', error);
      return null;
    }

    return fromDB(data);
  }

  async count(collectionName, query = {}) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    let queryBuilder = client.from(tableName).select('id', { count: 'exact', head: true });

    // Build query
    for (const [key, value] of Object.entries(query)) {
      if (key === '_id') {
        queryBuilder = queryBuilder.eq('id', value);
      } else {
        const dbKey = toSnakeCase(key);
        queryBuilder = queryBuilder.eq(dbKey, value);
      }
    }

    const { count, error } = await queryBuilder;

    if (error) {
      console.error('Supabase count error:', error);
      return 0;
    }

    return count || 0;
  }

  async clear(collectionName) {
    const tableName = TABLE_MAP[collectionName] || collectionName;
    const client = this.getClient();

    const { error } = await client.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Supabase clear error:', error);
    }
  }

  // ============================================
  // HELPER METHODS (for compatibility)
  // ============================================

  async getUser(userId) {
    return await this.findOne('users', { _id: userId });
  }

  async updateUser(userId, updates) {
    return await this.updateOne('users', { _id: userId }, updates);
  }

  async addToCollection(collectionName, item) {
    return await this.insertOne(collectionName, item);
  }

  async updateInCollection(collectionName, id, updates) {
    return await this.updateOne(collectionName, { _id: id }, updates);
  }

  // Placeholder for collections that stay in JSON (like cards)
  async loadCollection(name) {
    // For cards, fallback to JSON
    if (name === 'cards') {
      const fs = require('fs').promises;
      const path = require('path');
      const filePath = path.join(__dirname, 'data', `${name}.json`);
      try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return await this.find(name);
  }

  async getCollection(name) {
    return await this.loadCollection(name);
  }

  async saveCollection(name, _data) {
    // Not needed for Supabase - individual operations handle persistence
    console.log(`saveCollection called for ${name} - using Supabase, no action needed`);
  }
}

// Singleton instance
const db = new SupabaseStore();

module.exports = db;
