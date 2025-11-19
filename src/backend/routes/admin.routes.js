const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const User = require('../models/User.json-model');
const Card = require('../models/Card.json-model');
const Reading = require('../models/Reading.json-model');

// Simple admin check middleware (check if user email is admin)
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');

    if (!adminEmails.includes(user.email)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: error.message }
    });
  }
};

// Get system statistics
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    const cards = await Card.findAll();
    const readings = await Reading.findAll();

    const stats = {
      users: {
        total: users.length,
        premium: users.filter(u => u.subscriptionTier === 'premium').length,
        active: users.filter(u => u.isActive).length
      },
      cards: {
        total: cards.length,
        major: cards.filter(c => c.arcana === 'major').length,
        minor: cards.filter(c => c.arcana === 'minor').length
      },
      readings: {
        total: readings.length,
        daily: readings.filter(r => r.type === 'daily').length,
        decision: readings.filter(r => r.type === 'decision').length,
        today: readings.filter(r => {
          const today = new Date().setHours(0, 0, 0, 0);
          const readingDate = new Date(r.createdAt).setHours(0, 0, 0, 0);
          return readingDate === today;
        }).length
      }
    };

    res.json({ success: true, data: { stats } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'STATS_ERROR', message: error.message }
    });
  }
});

// Get all users (with pagination)
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const users = await User.find({});

    const usersData = users.slice(offset, offset + parseInt(limit)).map(u => ({
      id: u._id,
      email: u.email,
      displayName: u.displayName,
      subscriptionTier: u.subscriptionTier,
      totalReadings: u.stats?.totalReadings || 0,
      currentStreak: u.stats?.currentStreak || 0,
      createdAt: u.createdAt,
      isActive: u.isActive
    }));

    res.json({
      success: true,
      data: {
        users: usersData,
        total: users.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'USERS_ERROR', message: error.message }
    });
  }
});

module.exports = router;
