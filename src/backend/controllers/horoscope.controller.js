const User = require('../models/User.json-model');
const { generateWeeklyHoroscope } = require('../services/horoscope.service');

/**
 * @desc    Get weekly horoscope
 * @route   GET /api/horoscope/weekly
 * @access  Private
 */
exports.getWeeklyHoroscope = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    // Check if astrology profile exists
    if (!user.astrologyProfile?.calculated) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_ASTROLOGY_DATA',
          message: 'Пожалуйста, заполните данные рождения для получения прогноза',
          action: 'Go to /natal-chart to set up'
        }
      });
    }

    const sunSign = user.astrologyProfile.sunSign?.sign;
    const element = user.astrologyProfile.sunSign?.element;

    if (!sunSign || !element) {
      return res.status(400).json({
        success: false,
        error: { code: 'INCOMPLETE_DATA', message: 'Incomplete astrology data' }
      });
    }

    // Generate weekly horoscope
    const horoscope = generateWeeklyHoroscope(sunSign, element);

    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday

    res.status(200).json({
      success: true,
      data: {
        horoscope,
        zodiacSign: sunSign,
        element,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get weekly horoscope error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'HOROSCOPE_ERROR', message: error.message }
    });
  }
};

module.exports = { getWeeklyHoroscope: exports.getWeeklyHoroscope };
