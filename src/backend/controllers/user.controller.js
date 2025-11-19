/**
 * User Controller
 * Handles user profile and GDPR endpoints
 */

const User = require('../models/User.json-model');
const Reading = require('../models/Reading.json-model');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { displayName, preferences } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Update allowed fields
    if (displayName !== undefined) {
      user.displayName = displayName;
    }

    if (preferences) {
      if (preferences.theme) user.preferences.theme = preferences.theme;
      if (preferences.notificationsEnabled !== undefined) {
        user.preferences.notificationsEnabled = preferences.notificationsEnabled;
      }
      if (preferences.language) user.preferences.language = preferences.language;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: user.toPublicJSON()
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Export user data (GDPR)
 * @route   GET /api/users/export
 * @access  Private
 */
exports.exportData = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all user data
    const user = await User.findById(userId);
    const readings = await Reading.findByUserId(userId, 1000); // All readings

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      userData: {
        email: user.email,
        displayName: user.displayName,
        subscriptionTier: user.subscriptionTier,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      readings: readings.map(r => ({
        type: r.type,
        cards: r.cards,
        interpretation: r.interpretation,
        context: r.context,
        userFeedback: r.userFeedback,
        createdAt: r.createdAt
      })),
      summary: {
        totalReadings: readings.length,
        dailyReadings: readings.filter(r => r.type === 'daily').length,
        decisionReadings: readings.filter(r => r.type === 'decision').length
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tarot-data-${userId}-${Date.now()}.json"`);

    res.status(200).json(exportData);

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Delete user account (GDPR)
 * @route   DELETE /api/users/account
 * @access  Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { confirmation } = req.body;

    // Require confirmation
    if (confirmation !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CONFIRMATION_REQUIRED',
          message: 'Please provide confirmation: "DELETE MY ACCOUNT"'
        }
      });
    }

    // Delete user's readings first
    const readings = await Reading.findByUserId(userId, 10000);
    for (const reading of readings) {
      await Reading.deleteById(reading._id);
    }

    // Delete user
    await User.deleteOne({ _id: userId });

    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully',
      deletedData: {
        user: 1,
        readings: readings.length
      }
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const readings = await Reading.findByUserId(userId, 1000);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const stats = {
      profile: {
        displayName: user.displayName,
        subscriptionTier: user.subscriptionTier,
        isPremium: user.isPremium ? user.isPremium() : (user.subscriptionTier === 'premium'),
        memberSince: user.createdAt
      },
      readings: {
        total: user.stats.totalReadings,
        daily: readings.filter(r => r.type === 'daily').length,
        decisions: user.stats.decisionsMade,
        thisMonth: readings.filter(r => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(r.createdAt) > monthAgo;
        }).length
      },
      streaks: {
        current: user.stats.currentStreak,
        longest: user.stats.longestStreak,
        lastReading: user.stats.lastReadingDate
      }
    };

    res.status(200).json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'STATS_FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get advanced analytics
 * @route   GET /api/users/analytics/advanced
 * @access  Private
 */
exports.getAdvancedAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 90;

    const AdvancedAnalyticsService = require('../services/advanced-analytics.service');
    const analytics = await AdvancedAnalyticsService.getCompleteAnalytics(userId, days);

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get advanced analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Export analytics data
 * @route   GET /api/users/analytics/export
 * @access  Private
 */
exports.exportAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const format = req.query.format || 'csv';

    const AdvancedAnalyticsService = require('../services/advanced-analytics.service');

    if (format === 'csv') {
      const exported = await AdvancedAnalyticsService.exportAsCSV(userId);

      res.setHeader('Content-Type', exported.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${exported.filename}"`);
      res.send(exported.data);

    } else if (format === 'json') {
      const analytics = await AdvancedAnalyticsService.getCompleteAnalytics(userId);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="tarot-analytics-${userId}-${Date.now()}.json"`);
      res.json(analytics);

    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FORMAT',
          message: 'Format must be csv or json'
        }
      });
    }

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_FAILED',
        message: error.message
      }
    });
  }
};
