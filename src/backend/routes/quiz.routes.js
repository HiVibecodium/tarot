const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const quizController = require('../controllers/quiz.controller');

/**
 * @route   GET /api/quiz/questions
 * @desc    Get all quiz questions
 * @access  Public
 */
router.get('/questions', quizController.getQuestions);

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit quiz answer and update progress
 * @access  Private
 */
router.post('/submit', authenticate, quizController.submitAnswer);

/**
 * @route   GET /api/quiz/progress
 * @desc    Get user quiz progress
 * @access  Private
 */
router.get('/progress', authenticate, quizController.getProgress);

/**
 * @route   POST /api/quiz/reset
 * @desc    Reset quiz progress
 * @access  Private
 */
router.post('/reset', authenticate, quizController.resetProgress);

module.exports = router;
