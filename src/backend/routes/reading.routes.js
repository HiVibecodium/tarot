const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { readingLimiter } = require('../middleware/rateLimiter');
const readingController = require('../controllers/reading.controller');
const pdfController = require('../controllers/pdf.controller');

/**
 * @route   POST /api/readings/daily
 * @desc    Generate daily reading
 * @access  Private
 */
router.post('/daily', readingLimiter, authenticate, readingController.getDailyReading);

/**
 * @route   GET /api/readings/history
 * @desc    Get user reading history
 * @access  Private
 */
router.get('/history', authenticate, readingController.getHistory);

/**
 * @route   GET /api/readings/:id
 * @desc    Get specific reading
 * @access  Private
 */
router.get('/:id', authenticate, readingController.getReadingById);

/**
 * @route   POST /api/readings/decision
 * @desc    Generate decision analysis reading
 * @access  Private
 */
router.post('/decision', readingLimiter, authenticate, readingController.generateDecisionReading);

/**
 * @route   PUT /api/readings/:id/feedback
 * @desc    Update reading feedback
 * @access  Private
 */
router.put('/:id/feedback', authenticate, readingController.updateFeedback);

/**
 * @route   GET /api/readings/:id/pdf
 * @desc    Export reading as PDF
 * @access  Private
 */
router.get('/:id/pdf', authenticate, pdfController.exportReadingPDF);

/**
 * @route   PUT /api/readings/:id/mood
 * @desc    Update reading with mood/emotion context
 * @access  Private
 */
router.put('/:id/mood', authenticate, readingController.updateMood);

/**
 * @route   GET /api/readings/mood/stats
 * @desc    Get mood statistics and trends
 * @access  Private
 */
router.get('/mood/stats', authenticate, readingController.getMoodStats);

module.exports = router;
