const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');

/**
 * @route   GET /api/cards
 * @desc    Get all tarot cards
 * @access  Public
 */
router.get('/', cardController.getAllCards);

/**
 * @route   GET /api/cards/:id
 * @desc    Get specific card details
 * @access  Public
 */
router.get('/:id', cardController.getCardById);

module.exports = router;
