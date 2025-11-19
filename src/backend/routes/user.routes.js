const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const astrologyController = require('../controllers/astrology.controller');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', authenticate, userController.getStats);

/**
 * @route   GET /api/users/export
 * @desc    Export user data (GDPR)
 * @access  Private
 */
router.get('/export', authenticate, userController.exportData);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account (GDPR)
 * @access  Private
 */
router.delete('/account', authenticate, userController.deleteAccount);

/**
 * @route   PUT /api/users/birth-info
 * @desc    Update birth info and calculate astrology
 * @access  Private
 */
router.put('/birth-info', authenticate, astrologyController.updateBirthInfo);

/**
 * @route   GET /api/users/astrology
 * @desc    Get astrology profile
 * @access  Private
 */
router.get('/astrology', authenticate, astrologyController.getAstrologyProfile);

/**
 * @route   GET /api/users/analytics/advanced
 * @desc    Get advanced analytics (card frequency, patterns, success rate)
 * @access  Private
 */
router.get('/analytics/advanced', authenticate, userController.getAdvancedAnalytics);

/**
 * @route   GET /api/users/analytics/export
 * @desc    Export analytics data (CSV/JSON)
 * @access  Private
 */
router.get('/analytics/export', authenticate, userController.exportAnalytics);

module.exports = router;
