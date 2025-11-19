const express = require('express');
const router = express.Router();
const moonPhasesService = require('../services/moon-phases.service');

/**
 * GET /api/moon/current
 * Получить текущую фазу Луны
 */
router.get('/current', (req, res) => {
  try {
    const currentPhase = moonPhasesService.calculateMoonPhase();

    res.json({
      success: true,
      data: currentPhase
    });
  } catch (error) {
    console.error('Get current moon phase error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении фазы Луны'
    });
  }
});

/**
 * GET /api/moon/phase/:date
 * Получить фазу Луны на конкретную дату
 */
router.get('/phase/:date', (req, res) => {
  try {
    const date = new Date(req.params.date);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат даты'
      });
    }

    const phase = moonPhasesService.calculateMoonPhase(date);

    res.json({
      success: true,
      data: phase
    });
  } catch (error) {
    console.error('Get moon phase error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении фазы Луны'
    });
  }
});

/**
 * GET /api/moon/calendar
 * Получить лунный календарь на месяц
 */
router.get('/calendar', (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const month = req.query.month ? parseInt(req.query.month) - 1 : new Date().getMonth();

    const calendar = moonPhasesService.getMonthCalendar(year, month);

    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    console.error('Get moon calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении календаря'
    });
  }
});

/**
 * GET /api/moon/next-full-moon
 * Получить дату следующего полнолуния
 */
router.get('/next-full-moon', (req, res) => {
  try {
    const nextFullMoon = moonPhasesService.getNextFullMoon();

    res.json({
      success: true,
      data: nextFullMoon
    });
  } catch (error) {
    console.error('Get next full moon error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении даты полнолуния'
    });
  }
});

/**
 * GET /api/moon/next-new-moon
 * Получить дату следующего новолуния
 */
router.get('/next-new-moon', (req, res) => {
  try {
    const nextNewMoon = moonPhasesService.getNextNewMoon();

    res.json({
      success: true,
      data: nextNewMoon
    });
  } catch (error) {
    console.error('Get next new moon error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении даты новолуния'
    });
  }
});

/**
 * GET /api/moon/reading-favorable
 * Проверить, благоприятно ли текущее время для расклада
 */
router.get('/reading-favorable', (req, res) => {
  try {
    const favorable = moonPhasesService.isFavorableForReading();

    res.json({
      success: true,
      data: favorable
    });
  } catch (error) {
    console.error('Check favorable time error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке времени'
    });
  }
});

module.exports = router;
