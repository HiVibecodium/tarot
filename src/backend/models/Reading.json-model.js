/**
 * Reading Model - JSON Storage
 * Represents a tarot reading (daily, decision, purchase)
 */

const db = require('../db/json-store');

const COLLECTION_NAME = 'readings';

class Reading {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    this.updatedAt = new Date().toISOString();

    if (this._id) {
      const updated = await db.updateOne(COLLECTION_NAME, { _id: this._id }, this);
      return new Reading(updated);
    } else {
      const inserted = await db.insertOne(COLLECTION_NAME, this);
      return new Reading(inserted);
    }
  }

  // ============================================
  // STATIC METHODS
  // ============================================

  static async create(readingData) {
    const reading = new Reading({
      ...readingData,
      createdAt: new Date().toISOString()
    });
    return await reading.save();
  }

  static async findById(id) {
    const doc = await db.findOne(COLLECTION_NAME, { _id: id });
    return doc ? new Reading(doc) : null;
  }

  static async findByUserId(userId, limit = 10) {
    const allReadings = await db.find(COLLECTION_NAME, { userId });

    // Sort by createdAt descending
    allReadings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allReadings.slice(0, limit).map(doc => new Reading(doc));
  }

  static async findByUserIdAndType(userId, type) {
    const readings = await db.find(COLLECTION_NAME, { userId, type });
    readings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return readings.map(doc => new Reading(doc));
  }

  static async countByUserId(userId) {
    return await db.count(COLLECTION_NAME, { userId });
  }

  static async deleteById(id) {
    return await db.deleteOne(COLLECTION_NAME, { _id: id });
  }

  // Check if user already has daily reading today
  static async hasDailyReadingToday(userId) {
    const today = new Date().setHours(0, 0, 0, 0);

    const allReadings = await db.find(COLLECTION_NAME, {
      userId,
      type: 'daily'
    });

    return allReadings.some(reading => {
      const readingDate = new Date(reading.createdAt).setHours(0, 0, 0, 0);
      return readingDate === today;
    });
  }

  // Get today's daily reading if exists
  static async getTodaysDailyReading(userId) {
    const today = new Date().setHours(0, 0, 0, 0);

    const allReadings = await db.find(COLLECTION_NAME, {
      userId,
      type: 'daily'
    });

    const todaysReading = allReadings.find(reading => {
      const readingDate = new Date(reading.createdAt).setHours(0, 0, 0, 0);
      return readingDate === today;
    });

    return todaysReading ? new Reading(todaysReading) : null;
  }

  // Get mood statistics for user
  static async getMoodStats(userId, days = 30) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const allReadings = await db.find(COLLECTION_NAME, { userId });

    const readingsWithMood = allReadings.filter(reading =>
      reading.userContext?.mood &&
      new Date(reading.createdAt) >= dateThreshold
    );

    // Mood frequency
    const moodFrequency = {};
    const moodByCard = {};
    const moodTrends = [];

    readingsWithMood.forEach(reading => {
      const mood = reading.userContext.mood;
      moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;

      // Track mood trends by date
      const date = new Date(reading.createdAt).toISOString().split('T')[0];
      moodTrends.push({
        date,
        mood,
        energy: reading.userContext.energy || 3
      });

      // Correlate mood with cards
      if (reading.cards && reading.cards.length > 0) {
        const cardName = reading.cards[0].name;
        if (!moodByCard[mood]) moodByCard[mood] = {};
        moodByCard[mood][cardName] = (moodByCard[mood][cardName] || 0) + 1;
      }
    });

    return {
      totalReadings: readingsWithMood.length,
      moodFrequency,
      moodTrends,
      moodByCard,
      period: `${days} days`
    };
  }

  // Update reading with mood/emotion context
  async updateMoodContext(moodData) {
    this.userContext = {
      ...(this.userContext || {}),
      mood: moodData.mood,
      energy: moodData.energy,
      tags: moodData.tags || [],
      notes: moodData.notes || ''
    };
    return await this.save();
  }

  static async deleteAll() {
    return await db.clear(COLLECTION_NAME);
  }
}

module.exports = Reading;
