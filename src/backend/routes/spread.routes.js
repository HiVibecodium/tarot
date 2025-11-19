/**
 * Spread Routes
 * API endpoints for universal tarot spread system
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getAllSpreads, getSpreadTemplate } = require('../services/spread-templates.service');
const { interpretSpread } = require('../services/spread-interpretation.service');
const { saveReading } = require('../controllers/reading.controller');

/**
 * @route   GET /api/spreads
 * @desc    Get all available spread templates
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const spreads = getAllSpreads();
    res.json({ success: true, data: spreads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/spreads/:id
 * @desc    Get specific spread template
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const spread = getSpreadTemplate(req.params.id);

    if (!spread) {
      return res.status(404).json({
        success: false,
        error: 'Spread template not found'
      });
    }

    res.json({ success: true, data: spread });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/spreads/:id/interpret
 * @desc    Generate interpretation for a spread reading
 * @access  Private
 */
router.post('/:id/interpret', authenticate, async (req, res) => {
  try {
    const { cards, question, context } = req.body;
    const spreadId = req.params.id;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({
        success: false,
        error: 'Cards array is required'
      });
    }

    const interpretation = await interpretSpread(spreadId, cards, question, context);

    res.json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/spreads/:id/save
 * @desc    Save spread reading to user history
 * @access  Private
 */
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const { cards, interpretation, question, context } = req.body;
    const spreadId = req.params.id;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({
        success: false,
        error: 'Cards array is required'
      });
    }

    // Get spread template for name
    const template = getSpreadTemplate(spreadId);

    // Create reading object matching existing structure
    const reading = {
      userId: req.user.userId, // Исправлено с req.user.id на req.user.userId
      type: 'spread',
      spreadType: spreadId,
      spreadName: template?.name || spreadId,
      question: question || '',
      context: context || {},
      cards: cards,
      interpretation: interpretation || {},
      createdAt: new Date().toISOString()
    };

    // Save using existing reading controller
    req.body = {
      type: 'spread',
      spreadType: spreadId,
      spreadName: template?.name,
      question,
      context,
      cards,
      interpretation
    };

    // Delegate to saveReading
    await saveReading(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
