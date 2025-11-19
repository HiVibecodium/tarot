const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const horoscopeController = require('../controllers/horoscope.controller');

/**
 * @route   GET /api/horoscope/weekly
 * @desc    Get weekly horoscope based on zodiac
 * @access  Private
 */
router.get('/weekly', authenticate, horoscopeController.getWeeklyHoroscope);

module.exports = router;
