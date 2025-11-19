/**
 * Card Model - JSON Storage
 * Represents a Tarot card with interpretations
 */

const db = require('../db/json-store');

const COLLECTION_NAME = 'cards';

class Card {
  constructor(data) {
    Object.assign(this, data);
  }

  // ============================================
  // STATIC METHODS
  // ============================================

  static async findAll() {
    const docs = await db.find(COLLECTION_NAME);
    return docs.map(doc => new Card(doc));
  }

  static async findById(id) {
    const doc = await db.findOne(COLLECTION_NAME, { _id: id });
    return doc ? new Card(doc) : null;
  }

  static async findByArcana(arcana) {
    const docs = await db.find(COLLECTION_NAME, { arcana });
    return docs.map(doc => new Card(doc));
  }

  static async count() {
    return await db.count(COLLECTION_NAME);
  }

  static async insertMany(cards) {
    const results = [];
    for (const cardData of cards) {
      const inserted = await db.insertOne(COLLECTION_NAME, cardData);
      results.push(new Card(inserted));
    }
    return results;
  }

  static async deleteAll() {
    await db.clear(COLLECTION_NAME);
  }

  // Get random card
  static async getRandomCard() {
    const allCards = await this.findAll();
    if (allCards.length === 0) {
      throw new Error('No cards in database. Please run seed script.');
    }

    const randomIndex = Math.floor(Math.random() * allCards.length);
    return allCards[randomIndex];
  }

  // Get random cards (for multi-card spreads)
  static async getRandomCards(count = 1, allowDuplicates = false) {
    const allCards = await this.findAll();

    if (allCards.length === 0) {
      throw new Error('No cards in database');
    }

    if (!allowDuplicates && count > allCards.length) {
      throw new Error(`Cannot draw ${count} unique cards from ${allCards.length} cards`);
    }

    const drawn = [];
    const availableCards = [...allCards];

    for (let i = 0; i < count; i++) {
      if (allowDuplicates) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        drawn.push(allCards[randomIndex]);
      } else {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        drawn.push(availableCards[randomIndex]);
        availableCards.splice(randomIndex, 1);
      }
    }

    return drawn;
  }
}

module.exports = Card;
