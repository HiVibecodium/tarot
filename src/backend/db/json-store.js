/**
 * Simple JSON File Storage - MongoDB Alternative for MVP
 * Uses lowdb for lightweight JSON database
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class JSONStore {
  constructor(dbPath = process.env.DATA_DIR || path.join(__dirname, 'data')) {
    this.dbPath = dbPath;
    this.collections = new Map();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Create data directory if not exists
    try {
      await fs.mkdir(this.dbPath, { recursive: true });
      console.log('✅ JSON Store initialized:', this.dbPath);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to create data directory:', error);
      throw error;
    }
  }

  async loadCollection(name) {
    const filePath = path.join(this.dbPath, `${name}.json`);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist, return empty array
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveCollection(name, data) {
    const filePath = path.join(this.dbPath, `${name}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getCollection(name) {
    if (!this.collections.has(name)) {
      const data = await this.loadCollection(name);
      this.collections.set(name, data);
    }
    return this.collections.get(name);
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  async findOne(collectionName, query) {
    const collection = await this.getCollection(collectionName);

    return collection.find(doc => {
      return Object.keys(query).every(key => {
        if (key === '_id') {
          return doc._id === query._id;
        }
        return doc[key] === query[key];
      });
    });
  }

  async find(collectionName, query = {}) {
    const collection = await this.getCollection(collectionName);

    if (Object.keys(query).length === 0) {
      return collection;
    }

    return collection.filter(doc => {
      return Object.keys(query).every(key => doc[key] === query[key]);
    });
  }

  async insertOne(collectionName, document) {
    const collection = await this.getCollection(collectionName);

    // Generate ID if not exists
    if (!document._id) {
      document._id = crypto.randomBytes(12).toString('hex');
    }

    // Add timestamps
    const now = new Date().toISOString();
    document.createdAt = document.createdAt || now;
    document.updatedAt = now;

    collection.push(document);
    await this.saveCollection(collectionName, collection);

    return document;
  }

  async updateOne(collectionName, query, update) {
    const collection = await this.getCollection(collectionName);

    const index = collection.findIndex(doc => {
      return Object.keys(query).every(key => doc[key] === query[key]);
    });

    if (index === -1) {
      return null;
    }

    // Update document
    collection[index] = {
      ...collection[index],
      ...update,
      updatedAt: new Date().toISOString()
    };

    await this.saveCollection(collectionName, collection);

    return collection[index];
  }

  async deleteOne(collectionName, query) {
    const collection = await this.getCollection(collectionName);

    const index = collection.findIndex(doc => {
      return Object.keys(query).every(key => doc[key] === query[key]);
    });

    if (index === -1) {
      return null;
    }

    const deleted = collection.splice(index, 1)[0];
    await this.saveCollection(collectionName, collection);

    return deleted;
  }

  async count(collectionName, query = {}) {
    const results = await this.find(collectionName, query);
    return results.length;
  }

  async clear(collectionName) {
    await this.saveCollection(collectionName, []);
    this.collections.set(collectionName, []);
  }

  // ============================================
  // HELPER METHODS FOR USER OPERATIONS
  // ============================================

  async getUser(userId) {
    const users = await this.getCollection('users');
    return users.find(u => u.id === userId || u._id === userId);
  }

  async updateUser(userId, updates) {
    const users = await this.getCollection('users');
    const index = users.findIndex(u => u.id === userId || u._id === userId);

    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveCollection('users', users);
      return users[index];
    }

    return null;
  }

  async addToCollection(collectionName, item) {
    const collection = await this.getCollection(collectionName);
    collection.push(item);
    await this.saveCollection(collectionName, collection);
    return item;
  }

  async updateInCollection(collectionName, id, updates) {
    const collection = await this.getCollection(collectionName);
    const index = collection.findIndex(item => item.id === id || item._id === id);

    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveCollection(collectionName, collection);
      return collection[index];
    }

    return null;
  }
}

// Singleton instance
const db = new JSONStore();

module.exports = db;
