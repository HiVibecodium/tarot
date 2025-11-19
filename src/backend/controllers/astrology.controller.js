const User = require('../models/User.json-model');
const { calculateAstrologyProfile } = require('../services/astrology.service');
const { calculateNatalChart, getSignInterpretation } = require('../services/enhanced-astrology.service');

/**
 * @desc    Calculate astrology profile without saving (for compatibility checks)
 * @route   POST /api/astrology/calculate-temp
 * @access  Public (no auth required)
 */
async function calculateTemporary(req, res) {
  try {
    const { birthDate, birthTime, birthPlace, timezone } = req.body;

    if (!birthDate) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_BIRTH_DATE', message: 'Дата рождения обязательна' }
      });
    }

    // Calculate natal chart with provided coordinates or default Moscow
    const { latitude, longitude, birthCity } = req.body;
    const profile = calculateNatalChart({
      birthDate,
      birthTime: birthTime || '12:00',
      birthCity: birthCity || birthPlace || 'Москва',
      latitude: latitude || 55.7558, // Москва по умолчанию
      longitude: longitude || 37.6173, // Москва по умолчанию
      timezone: timezone || 'Europe/Moscow'
    });

    // Add calculated flag to match authenticated user response
    profile.calculated = true;
    profile.calculatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Calculate temporary astrology error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CALCULATION_ERROR', message: 'Ошибка расчёта астрологии' }
    });
  }
}

/**
 * @desc    Update user birth info and calculate astrology profile
 * @route   PUT /api/users/birth-info
 * @access  Private
 */
async function updateBirthInfo(req, res) {
  try {
    const userId = req.user.userId;
    const { fullName, birthDate, birthTime, birthCity, birthCountry, latitude, longitude, timezone } = req.body;

    if (!birthDate) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_BIRTH_DATE', message: 'Дата рождения обязательна' }
      });
    }

    // Calculate both basic and enhanced profiles
    const basicProfile = await calculateAstrologyProfile({
      birthDate, birthTime, birthCity, latitude, longitude
    });

    const enhancedProfile = calculateNatalChart({
      birthDate, birthTime, birthCity, latitude, longitude, timezone
    });

    // Get detailed interpretation
    const sunInterp = getSignInterpretation(enhancedProfile.sunSign.sign);

    // Merge both profiles
    const fullProfile = {
      ...basicProfile,
      ...enhancedProfile,
      // Add detailed interpretations
      sunInterpretation: sunInterp,
      calculated: true,
      calculatedAt: new Date().toISOString()
    };

    const updateData = {
      birthInfo: {
        fullName: fullName || null,
        birthDate,
        birthTime: birthTime || null,
        birthCity: birthCity || null,
        birthCountry: birthCountry || null,
        timezone: timezone || null,
        latitude: latitude || null,
        longitude: longitude || null
      },
      astrologyProfile: fullProfile,
      'preferences.useAstrology': true
    };

    await User.update(userId, updateData);

    res.status(200).json({
      success: true,
      data: {
        astrologyProfile: fullProfile,
        message: 'Полная натальная карта рассчитана успешно!'
      }
    });

  } catch (error) {
    console.error('Update birth info error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message }
    });
  }
}

/**
 * @desc    Get user astrology profile
 * @route   GET /api/users/astrology
 * @access  Private
 */
async function getAstrologyProfile(req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        birthInfo: user.birthInfo,
        astrologyProfile: user.astrologyProfile,
        useAstrology: user.preferences?.useAstrology || false
      }
    });

  } catch (error) {
    console.error('Get astrology profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message }
    });
  }
}

/**
 * @desc    Get zodiac sign information
 * @route   GET /api/astrology/zodiac-info/:sign
 * @access  Public
 */
async function getZodiacInfo(req, res) {
  try {
    const { sign } = req.params;

    // Validate sign
    const validSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    if (!validSigns.includes(sign.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SIGN', message: 'Invalid zodiac sign' }
      });
    }

    // Get interpretation
    const interpretation = getSignInterpretation(sign);

    return res.status(200).json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    console.error('Get zodiac info error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: 'Failed to get zodiac information' }
    });
  }
}

module.exports = { updateBirthInfo, getAstrologyProfile, calculateTemporary, getZodiacInfo };
