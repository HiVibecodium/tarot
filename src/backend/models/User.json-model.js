/**
 * User Model - JSON Storage Adapter
 * Drop-in replacement for Mongoose User model
 */

const bcrypt = require('bcryptjs');
const db = require('../db/json-store');

const COLLECTION_NAME = 'users';

class User {
  constructor(data) {
    Object.assign(this, data);
  }

  // ============================================
  // INSTANCE METHODS
  // ============================================

  async comparePassword(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }

  isPremium() {
    return this.subscriptionTier === 'premium' &&
           this.subscriptionExpiry &&
           new Date(this.subscriptionExpiry) > new Date();
  }

  toPublicJSON() {
    return {
      id: this._id,
      email: this.email,
      displayName: this.displayName,
      subscriptionTier: this.subscriptionTier,
      isPremium: this.isPremium ? this.isPremium() : (this.subscriptionTier === 'premium'),
      preferences: this.preferences,
      stats: {
        totalReadings: this.stats.totalReadings || 0,
        currentStreak: this.stats.currentStreak || 0,
        longestStreak: this.stats.longestStreak || 0
      },
      createdAt: this.createdAt
    };
  }

  async save() {
    // Hash password if modified
    if (this._passwordModified && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      delete this._passwordModified;
    }

    this.updatedAt = new Date().toISOString();

    if (this._id) {
      // Update existing
      const updated = await db.updateOne(COLLECTION_NAME, { _id: this._id }, this);
      return new User(updated);
    } else {
      // Insert new
      const inserted = await db.insertOne(COLLECTION_NAME, this);
      return new User(inserted);
    }
  }

  async incrementReadings() {
    this.stats.totalReadings += 1;

    // Update streak
    const today = new Date().setHours(0, 0, 0, 0);
    const lastReading = this.stats.lastReadingDate ?
      new Date(this.stats.lastReadingDate).setHours(0, 0, 0, 0) : null;

    if (!lastReading) {
      this.stats.currentStreak = 1;
    } else {
      const daysDiff = (today - lastReading) / (1000 * 60 * 60 * 24);

      if (daysDiff === 1) {
        this.stats.currentStreak += 1;
      } else if (daysDiff > 1) {
        this.stats.currentStreak = 1;
      }
    }

    if (this.stats.currentStreak > this.stats.longestStreak) {
      this.stats.longestStreak = this.stats.currentStreak;
    }

    this.stats.lastReadingDate = new Date().toISOString();

    await this.save();
  }

  // ============================================
  // STATIC METHODS
  // ============================================

  static async findByEmail(email) {
    const doc = await db.findOne(COLLECTION_NAME, { email: email.toLowerCase() });
    return doc ? new User(doc) : null;
  }

  static async findById(id) {
    const doc = await db.findOne(COLLECTION_NAME, { _id: id });
    return doc ? new User(doc) : null;
  }

  static async createUser(email, password, displayName = null) {
    const userData = {
      email: email.toLowerCase(),
      password: password,
      _passwordModified: true,
      displayName: displayName || email.split('@')[0],
      subscriptionTier: 'free',
      isPremium: false,
      subscriptionExpiry: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      birthInfo: {
        fullName: null,
        birthDate: null,
        birthTime: null,
        birthCity: null,
        birthCountry: null,
        timezone: null,
        latitude: null,
        longitude: null
      },
      astrologyProfile: {
        sunSign: null,
        moonSign: null,
        risingSign: null,
        calculated: false
      },
      preferences: {
        theme: 'auto',
        notificationsEnabled: true,
        language: 'en',
        useAstrology: false
      },
      stats: {
        totalReadings: 0,
        decisionsMade: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastReadingDate: null
      },
      isActive: true,
      isEmailVerified: false,
      dataExportRequested: false,
      dataExportRequestedAt: null
    };

    const user = new User(userData);
    return await user.save();
  }

  static async find(query = {}) {
    const docs = await db.find(COLLECTION_NAME, query);
    return docs.map(doc => new User(doc));
  }

  static async deleteOne(query) {
    return await db.deleteOne(COLLECTION_NAME, query);
  }

  static async update(id, updateData) {
    const updated = await db.updateOne(COLLECTION_NAME, { _id: id }, updateData);
    return updated ? new User(updated) : null;
  }

  static async findByStripeCustomerId(stripeCustomerId) {
    const docs = await db.find(COLLECTION_NAME, { stripeCustomerId });
    return docs.map(doc => new User(doc));
  }
}

module.exports = User;
