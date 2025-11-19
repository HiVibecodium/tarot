/**
 * Card Controller
 * Handles tarot card endpoints
 */

const Card = require('../models/Card.json-model');

/**
 * @desc    Get all cards
 * @route   GET /api/cards
 * @access  Public
 */
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll();

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
