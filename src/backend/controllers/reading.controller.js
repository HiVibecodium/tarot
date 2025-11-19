/**
 * Reading Controller
 * Handles tarot reading endpoints
 */

const ReadingService = require('../services/reading.service');

/**
 * @desc    Generate or get daily reading
 * @route   POST /api/readings/daily
 * @access  Private
 */
exports.getDailyReading = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mood } = req.body;

    const result = await ReadingService.generateDailyReading(userId, mood);

    res.status(result.isNew ? 201 : 200).json({
      success: true,
      data: {
        reading: result.reading,
        isNew: result.isNew,
        // Include horoscope if generated
        ...(result.horoscope && { horoscope: result.horoscope })
      },
      message: result.isNew ? 'Daily reading generated' : 'Today\'s reading already exists'
    });

  } catch (error) {
    console.error('Get daily reading error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DAILY_READING_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Generate decision reading
 * @route   POST /api/readings/decision
 * @access  Private
 */
exports.generateDecisionReading = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { question, options } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_QUESTION',
          message: 'Question is required'
        }
      });
    }

    const reading = await ReadingService.generateDecisionReading(userId, question, options);

    res.status(201).json({
      success: true,
      data: { reading },
      message: 'Decision reading generated'
    });

  } catch (error) {
    console.error('Generate decision reading error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DECISION_READING_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get user's reading history
 * @route   GET /api/readings/history
 * @access  Private
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const readings = await ReadingService.getUserReadings(userId, limit);

    res.status(200).json({
      success: true,
      data: {
        readings,
        count: readings.length
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'HISTORY_FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get specific reading by ID
 * @route   GET /api/readings/:id
 * @access  Private
 */
exports.getReadingById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const readingId = req.params.id;

    const reading = await ReadingService.getReadingById(readingId, userId);

    if (!reading) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'READING_NOT_FOUND',
          message: 'Reading not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: { reading }
    });

  } catch (error) {
    console.error('Get reading error:', error);

    if (error.message === 'Unauthorized access to reading') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'READING_FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Update reading feedback
 * @route   PUT /api/readings/:id/feedback
 * @access  Private
 */
exports.updateFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const readingId = req.params.id;
    const feedback = req.body;

    const reading = await ReadingService.updateFeedback(readingId, userId, feedback);

    res.status(200).json({
      success: true,
      data: { reading },
      message: 'Feedback updated'
    });

  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FEEDBACK_UPDATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Update reading with mood/emotion context
 * @route   PUT /api/readings/:id/mood
 * @access  Private
 */
exports.updateMood = async (req, res) => {
  try {
    const userId = req.user.userId;
    const readingId = req.params.id;
    const { mood, energy, tags, notes } = req.body;

    // Validate mood
    const validMoods = ['anxious', 'calm', 'excited', 'sad', 'neutral', 'happy', 'confused'];
    if (mood && !validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MOOD',
          message: `Invalid mood. Must be one of: ${validMoods.join(', ')}`
        }
      });
    }

    // Validate energy (1-5)
    if (energy && (energy < 1 || energy > 5)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ENERGY',
          message: 'Energy must be between 1 and 5'
        }
      });
    }

    const reading = await ReadingService.updateMoodContext(readingId, userId, {
      mood,
      energy,
      tags: tags || [],
      notes: notes || ''
    });

    res.status(200).json({
      success: true,
      data: { reading },
      message: 'Mood context updated'
    });

  } catch (error) {
    console.error('Update mood error:', error);

    if (error.message === 'Reading not found' || error.message === 'Unauthorized access to reading') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'READING_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'MOOD_UPDATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * @desc    Get mood statistics and trends
 * @route   GET /api/readings/mood/stats
 * @access  Private
 */
exports.getMoodStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;

    // Validate days
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DAYS',
          message: 'Days must be between 1 and 365'
        }
      });
    }

    const stats = await ReadingService.getMoodStatistics(userId, days);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MOOD_STATS_FAILED',
        message: error.message
      }
    });
  }
};
