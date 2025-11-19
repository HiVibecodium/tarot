const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const db = require('../db/json-store');

/**
 * POST /api/journal/:readingId/note
 * Добавить/обновить заметку к раскладу
 */
router.post('/:readingId/note', authenticate, async (req, res) => {
  try {
    const { readingId } = req.params;
    const { note, tags, mood, insights } = req.body;

    // Найти расклад
    const reading = await db.findOne('readings', { _id: readingId, userId: req.user.userId });

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Расклад не найден'
      });
    }

    // Обновить расклад с заметкой
    await db.updateOne('readings',
      { _id: readingId },
      {
        journal: {
          note: note || '',
          tags: tags || [],
          mood: mood || null,
          insights: insights || '',
          createdAt: reading.journal?.createdAt || new Date(),
          updatedAt: new Date()
        },
        updatedAt: new Date()
      }
    );

    const updatedReading = await db.findOne('readings', { _id: readingId });

    res.json({
      success: true,
      data: updatedReading
    });
  } catch (error) {
    console.error('Add journal note error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении заметки'
    });
  }
});

/**
 * GET /api/journal
 * Получить все записи дневника (расклады с заметками)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, tags, mood, startDate, endDate } = req.query;

    // Получить все расклады пользователя
    let readings = await db.find('readings', { userId: req.user.userId });

    // Фильтровать только те, у которых есть заметки
    readings = readings.filter(r => r.journal && r.journal.note);

    // Применить фильтры
    if (search) {
      const searchLower = search.toLowerCase();
      readings = readings.filter(r =>
        r.journal.note.toLowerCase().includes(searchLower) ||
        r.journal.insights?.toLowerCase().includes(searchLower) ||
        r.question?.toLowerCase().includes(searchLower)
      );
    }

    if (tags) {
      const tagArray = tags.split(',');
      readings = readings.filter(r =>
        r.journal.tags && r.journal.tags.some(tag => tagArray.includes(tag))
      );
    }

    if (mood) {
      readings = readings.filter(r => r.journal.mood === mood);
    }

    if (startDate) {
      const start = new Date(startDate);
      readings = readings.filter(r => new Date(r.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      readings = readings.filter(r => new Date(r.createdAt) <= end);
    }

    // Сортировать по дате (новые первыми)
    readings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        entries: readings,
        total: readings.length
      }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении записей дневника'
    });
  }
});

/**
 * GET /api/journal/tags
 * Получить все используемые теги
 */
router.get('/tags', authenticate, async (req, res) => {
  try {
    const readings = await db.find('readings', { userId: req.user.userId });

    const tagsSet = new Set();
    readings.forEach(reading => {
      if (reading.journal && reading.journal.tags) {
        reading.journal.tags.forEach(tag => tagsSet.add(tag));
      }
    });

    const tags = Array.from(tagsSet).sort();

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении тегов'
    });
  }
});

/**
 * GET /api/journal/reflection
 * Получить запись "месяц назад" для рефлексии
 */
router.get('/reflection', authenticate, async (req, res) => {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const readings = await db.find('readings', { userId: req.user.userId });

    // Найти расклады примерно месяц назад (±3 дня)
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const reflectionReadings = readings.filter(r => {
      const readingDate = new Date(r.createdAt);
      const diff = Math.abs(readingDate - monthAgo);
      return diff <= threeDays && r.journal && r.journal.note;
    });

    // Сортировать по близости к месяцу назад
    reflectionReadings.sort((a, b) => {
      const diffA = Math.abs(new Date(a.createdAt) - monthAgo);
      const diffB = Math.abs(new Date(b.createdAt) - monthAgo);
      return diffA - diffB;
    });

    res.json({
      success: true,
      data: reflectionReadings.slice(0, 5) // Вернуть до 5 записей
    });
  } catch (error) {
    console.error('Get reflection entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении записей для рефлексии'
    });
  }
});

/**
 * DELETE /api/journal/:readingId/note
 * Удалить заметку из расклада
 */
router.delete('/:readingId/note', authenticate, async (req, res) => {
  try {
    const { readingId } = req.params;

    const reading = await db.findOne('readings', { _id: readingId, userId: req.user.userId });

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Расклад не найден'
      });
    }

    // Удалить journal поле
    await db.updateOne('readings',
      { _id: readingId },
      {
        journal: null,
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Заметка удалена'
    });
  } catch (error) {
    console.error('Delete journal note error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении заметки'
    });
  }
});

/**
 * GET /api/journal/export
 * Экспорт дневника в JSON
 */
router.get('/export', authenticate, async (req, res) => {
  try {
    const readings = await db.find('readings', { userId: req.user.userId });

    // Фильтровать только записи с заметками
    const journalEntries = readings
      .filter(r => r.journal && r.journal.note)
      .map(r => ({
        date: r.createdAt,
        type: r.readingType,
        question: r.question,
        cards: r.cards,
        interpretation: r.interpretation,
        journal: r.journal
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: journalEntries.length,
      entries: journalEntries
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Export journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при экспорте дневника'
    });
  }
});

module.exports = router;
