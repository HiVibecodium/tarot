const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const insightsService = require('../services/insights-integration.service');

/**
 * GET /api/insights/unified
 * Получить объединённые инсайты из всех источников
 */
router.get('/unified', authenticate, async (req, res) => {
  try {
    const insights = await insightsService.getUnifiedInsights(req.user.userId);

    if (!insights) {
      return res.status(404).json({
        success: false,
        message: 'Инсайты не найдены. Заполните профиль.'
      });
    }

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get unified insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении инсайтов'
    });
  }
});

/**
 * GET /api/insights/daily
 * Получить ежедневный персонализированный инсайт
 */
router.get('/daily', authenticate, async (req, res) => {
  try {
    const dailyInsight = await insightsService.getDailyPersonalizedInsight(req.user.userId);

    if (!dailyInsight) {
      return res.status(404).json({
        success: false,
        message: 'Заполните профиль для персонализированных инсайтов'
      });
    }

    res.json({
      success: true,
      data: dailyInsight
    });
  } catch (error) {
    console.error('Get daily insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении ежедневного инсайта'
    });
  }
});

module.exports = router;
