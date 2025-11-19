const express = require('express');
const router = express.Router();
const astrologyController = require('../controllers/astrology.controller');

/**
 * @route   POST /api/astrology/calculate-temp
 * @desc    Calculate natal chart without saving (for compatibility checks)
 * @access  Public
 */
router.post('/calculate-temp', astrologyController.calculateTemporary);

/**
 * @route   GET /api/astrology/zodiac-info/:sign
 * @desc    Get zodiac sign information
 * @access  Public
 */
router.get('/zodiac-info/:sign', astrologyController.getZodiacInfo);

module.exports = router;
