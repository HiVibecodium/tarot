const express = require('express');
const router = express.Router();
const numerologyService = require('../services/numerology.service');
const { authenticate } = require('../middleware/auth.middleware');
const db = require('../db');

/**
 * POST /api/numerology/calculate
 * Рассчитать полный нумерологический анализ
 * Public endpoint - no authentication required for basic numerology
 */
router.post('/calculate', async (req, res) => {
  try {
    const { birthDate, fullName } = req.body;

    if (!birthDate || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Необходимы дата рождения и полное имя'
      });
    }

    // Валидация формата даты (dd.mm.yyyy)
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(birthDate)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат даты. Используйте DD.MM.YYYY'
      });
    }

    const analysis = numerologyService.getFullAnalysis(birthDate, fullName);

    // Сохраняем в профиль пользователя (если пользователь авторизован)
    if (req.user && req.user.userId) {
      const user = await db.findOne('users', { _id: req.user.userId });
      if (user) {
        await db.updateOne('users',
          { _id: req.user.userId },
          {
            numerology: analysis,
            updatedAt: new Date()
          }
        );
      }
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Numerology calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при расчёте нумерологии'
    });
  }
});

/**
 * GET /api/numerology/profile
 * Получить сохранённый нумерологический профиль
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await db.findOne('users', { _id: req.user.userId });

    if (!user || !user.numerology) {
      return res.status(404).json({
        success: false,
        message: 'Нумерологический профиль не найден'
      });
    }

    res.json({
      success: true,
      data: user.numerology
    });
  } catch (error) {
    console.error('Get numerology profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении профиля'
    });
  }
});

/**
 * POST /api/numerology/compatibility
 * Рассчитать совместимость с партнёром
 * Принимает дату рождения и имя партнёра, автоматически использует данные пользователя
 */
router.post('/compatibility', authenticate, async (req, res) => {
  try {
    const { partnerBirthDate, partnerName } = req.body;

    // Валидация входных данных
    if (!partnerBirthDate) {
      return res.status(400).json({
        success: false,
        message: 'Необходима дата рождения партнёра'
      });
    }

    // Получить профиль текущего пользователя из БД
    const user = await db.findOne('users', { _id: req.user.userId });

    if (!user || !user.numerology) {
      return res.status(400).json({
        success: false,
        message: 'Сначала рассчитайте свою нумерологию в разделе "Калькулятор"'
      });
    }

    const userProfile = user.numerology;

    // Рассчитать число жизненного пути партнёра
    const [day, month, year] = partnerBirthDate.split('.').map(Number);
    const partnerLifePath = numerologyService.calculateLifePath(day, month, year);

    // Получить число жизненного пути пользователя
    const userLifePath = userProfile.numbers.lifePath.value;

    // Рассчитать базовую совместимость
    const score = numerologyService.calculateCompatibility(
      userLifePath,
      partnerLifePath
    );

    // Получить детальный анализ
    const detailedCompatibility = numerologyService.getDetailedCompatibility(
      score,
      userLifePath,
      partnerLifePath
    );

    // Получить интерпретации для обоих чисел
    const userInterpretation = numerologyService.getInterpretation(userLifePath);
    const partnerInterpretation = numerologyService.getInterpretation(partnerLifePath);

    res.json({
      success: true,
      data: {
        ...detailedCompatibility,
        you: {
          lifePath: userLifePath,
          interpretation: userInterpretation,
          name: userProfile.fullName
        },
        partner: {
          lifePath: partnerLifePath,
          interpretation: partnerInterpretation,
          name: partnerName || 'Партнёр',
          birthDate: partnerBirthDate
        }
      }
    });
  } catch (error) {
    console.error('Compatibility calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при расчёте совместимости'
    });
  }
});

/**
 * GET /api/numerology/interpretation/:number
 * Получить интерпретацию конкретного числа
 */
router.get('/interpretation/:number', (req, res) => {
  try {
    const number = parseInt(req.params.number);

    if (isNaN(number) || number < 1 || (number > 9 && ![11, 22, 33].includes(number))) {
      return res.status(400).json({
        success: false,
        message: 'Неверное число. Допустимы: 1-9, 11, 22, 33'
      });
    }

    const interpretation = numerologyService.getInterpretation(number);

    res.json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    console.error('Get interpretation error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении интерпретации'
    });
  }
});

/**
 * POST /api/numerology/quick-calculate
 * Быстрый расчёт одного числа (без сохранения)
 */
router.post('/quick-calculate', (req, res) => {
  try {
    const { type, value, value2 } = req.body;

    let result;

    switch (type) {
      case 'lifePath': {
        const [day, month, year] = value.split('.').map(Number);
        result = numerologyService.calculateLifePath(day, month, year);
        break;
      }
      case 'destiny':
        result = numerologyService.calculateDestiny(value);
        break;
      case 'soulUrge':
        result = numerologyService.calculateSoulUrge(value);
        break;
      case 'personality':
        result = numerologyService.calculatePersonality(value);
        break;
      case 'personalYear': {
        const [d, m] = value.split('.').map(Number);
        const year2 = value2 || new Date().getFullYear();
        result = numerologyService.calculatePersonalYear(d, m, year2);
        break;
      }
      default:
        return res.status(400).json({
          success: false,
          message: 'Неверный тип расчёта'
        });
    }

    const interpretation = numerologyService.getInterpretation(result);

    res.json({
      success: true,
      data: {
        number: result,
        interpretation
      }
    });
  } catch (error) {
    console.error('Quick calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при расчёте'
    });
  }
});

module.exports = router;
