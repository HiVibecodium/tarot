/**
 * Feedback Routes
 */

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/', feedbackController.submitFeedback);

// Admin routes (require authentication)
router.get('/', authenticate, feedbackController.getFeedback);
router.patch('/:id', authenticate, feedbackController.updateFeedbackStatus);

module.exports = router;
