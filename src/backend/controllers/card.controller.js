/**
 * Card Controller
 * Handles tarot card endpoints
 */

const Card = require('../models/Card.json-model');

// In-memory cache for cards (they don't change)
let cardsCache = null;
let cardsCacheTime = 0;
const CARDS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * @desc    Get all cards
 * @route   GET /api/cards
 * @access  Public
 */
exports.getAllCards = async (req, res) => {
  try {
    // Check cache first
    const now = Date.now();
    if (cardsCache && (now - cardsCacheTime) < CARDS_CACHE_TTL) {
      // Set cache headers
      res.set('Cache-Control', 'public, max-age=3600'); // 1 hour browser cache
      res.set('X-Cache', 'HIT');

      return res.status(200).json({
        success: true,
        data: cardsCache,
        count: cardsCache.length
      });
    }

    const cards = await Card.findAll();

    // Update cache
    cardsCache = cards;
    cardsCacheTime = now;

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('X-Cache', 'MISS');

    res.status(200).json({
      success: true,
      data: cards,
      count: cards.length
    });

  } catch (error) {
    console.error('Get all cards error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CARDS_FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get card by ID
 * @route   GET /api/cards/:id
 * @access  Public
 */
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CARD_NOT_FOUND',
          message: 'Card not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: card
    });

  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CARD_FETCH_FAILED',
        message: error.message
      }
    });
  }
};
