/**
 * Analytics Routes
 * User statistics and insights
 */

const express = require('express');
const router = express.Router();
const { authenticate: auth } = require('../../middleware/auth.middleware');

/**
 * GET /api/analytics/stats
 * Get comprehensive user statistics
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const { user } = req;
    const db = req.app.locals.db;

    // Get all user readings
    const allReadings = await db.getCollection('readings');
    const readings = allReadings.filter(r => r.userId === user.userId);

    // Get journal entries
    const allJournal = await db.getCollection('journal');
    const journalEntries = allJournal.filter(j => j.userId === user.userId);

    // Calculate basic stats
    const totalReadings = readings.length;
    const dailyReadings = readings.filter(r => r.type === 'daily').length;
    const decisionReadings = readings.filter(r => r.type === 'decision').length;

    // Card frequency analysis
    const cardFrequency = {};
    readings.forEach(reading => {
      if (reading.cards) {
        reading.cards.forEach(card => {
          const cardId = card.id || card.cardId;
          cardFrequency[cardId] = (cardFrequency[cardId] || 0) + 1;
        });
      }
    });

    // Most drawn cards
    const mostDrawnCards = Object.entries(cardFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([cardId, count]) => ({
        cardId: parseInt(cardId),
        count
      }));

    // Mood analysis (if mood tracking enabled)
    const moodData = readings
      .filter(r => r.mood)
      .reduce((acc, reading) => {
        const mood = reading.mood;
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

    // Streak calculation
    const streak = calculateStreak(readings);

    // Time-based analysis
    const readingsByDay = getReadingsByDay(readings);
    const readingsByHour = getReadingsByHour(readings);

    // Achievements progress
    const achievements = calculateAchievements(readings, journalEntries);

    // Response data
    res.json({
      success: true,
      stats: {
        total: {
          readings: totalReadings,
          dailyReadings,
          decisionReadings,
          journalEntries: journalEntries.length
        },
        cards: {
          mostDrawn: mostDrawnCards,
          totalUnique: Object.keys(cardFrequency).length
        },
        engagement: {
          currentStreak: streak.current,
          longestStreak: streak.longest,
          lastReadingDate: readings.length > 0
            ? readings[readings.length - 1].createdAt
            : null
        },
        mood: moodData,
        patterns: {
          byDay: readingsByDay,
          byHour: readingsByHour
        },
        achievements: achievements
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

/**
 * GET /api/analytics/insights
 * Get personalized insights based on user patterns
 */
router.get('/insights', auth, async (req, res) => {
  try {
    const { user } = req;
    const db = req.app.locals.db;

    const allReadings = await db.getCollection('readings');
    const readings = allReadings.filter(r => r.userId === user.userId);

    const insights = [];

    // Insight 1: Most active time
    const hourCounts = getReadingsByHour(readings);
    const mostActiveHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (mostActiveHour) {
      insights.push({
        type: 'time_pattern',
        icon: '⏰',
        title: 'Ваше любимое время для раскладов',
        message: `Вы чаще всего делаете расклады в ${mostActiveHour[0]}:00`,
        tip: 'Установите напоминание на это время для ежедневного расклада'
      });
    }

    // Insight 2: Favorite cards
    const cardFrequency = {};
    readings.forEach(reading => {
      if (reading.cards) {
        reading.cards.forEach(card => {
          const cardId = card.id || card.cardId;
          cardFrequency[cardId] = (cardFrequency[cardId] || 0) + 1;
        });
      }
    });

    const topCard = Object.entries(cardFrequency)
      .sort((a, b) => b[1] - a[1])[0];

    if (topCard && topCard[1] >= 3) {
      insights.push({
        type: 'card_pattern',
        icon: '🎴',
        title: 'Ваша карта-спутник',
        message: `Карта ${topCard[0]} появляется чаще других (${topCard[1]} раз)`,
        tip: 'Эта карта может отражать важный аспект вашей жизни прямо сейчас'
      });
    }

    // Insight 3: Streak motivation
    const streak = calculateStreak(readings);
    if (streak.current >= 7) {
      insights.push({
        type: 'achievement',
        icon: '🔥',
        title: 'Впечатляющая серия!',
        message: `${streak.current} дней подряд! Вы на правильном пути`,
        tip: 'Продолжайте ежедневную практику для глубокого понимания'
      });
    } else if (streak.current === 0) {
      insights.push({
        type: 'motivation',
        icon: '✨',
        title: 'Время возобновить практику',
        message: 'Ежедневные расклады помогают отслеживать ваш путь',
        tip: 'Начните новую серию сегодня!'
      });
    }

    // Insight 4: Mood correlation
    const moodReadings = readings.filter(r => r.mood);
    if (moodReadings.length >= 10) {
      const moodCardCorrelation = analyzeMoodCardCorrelation(moodReadings);

      if (moodCardCorrelation) {
        insights.push({
          type: 'mood_pattern',
          icon: '💭',
          title: 'Настроение и карты',
          message: moodCardCorrelation.message,
          tip: 'Обратите внимание на связь между вашими эмоциями и раскладами'
        });
      }
    }

    // Insight 5: Learning progress
    const userData = db.getUser(user.userId);
    if (userData && userData.quizProgress) {
      const progress = Object.keys(userData.quizProgress).length;
      const total = 22; // Major Arcana

      if (progress > 0) {
        insights.push({
          type: 'learning',
          icon: '📚',
          title: 'Прогресс обучения',
          message: `Вы изучили ${progress} из ${total} Старших Арканов`,
          tip: progress === total
            ? 'Отличная работа! Переходите к Младшим Арканам'
            : 'Продолжайте учиться, чтобы углубить понимание'
        });
      }
    }

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

/**
 * GET /api/analytics/trends
 * Get reading trends over time
 */
router.get('/trends', auth, async (req, res) => {
  try {
    const { user } = req;
    const { period = '30' } = req.query; // days
    const db = req.app.locals.db;

    const readings = db.getCollection('readings')
      .filter(r => r.userId === user.userId);

    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Filter readings within period
    const periodReadings = readings.filter(r =>
      new Date(r.createdAt) >= startDate
    );

    // Group by date
    const trendData = {};
    periodReadings.forEach(reading => {
      const date = new Date(reading.createdAt).toISOString().split('T')[0];
      if (!trendData[date]) {
        trendData[date] = {
          count: 0,
          types: {},
          moods: {}
        };
      }

      trendData[date].count++;
      trendData[date].types[reading.type] = (trendData[date].types[reading.type] || 0) + 1;

      if (reading.mood) {
        trendData[date].moods[reading.mood] = (trendData[date].moods[reading.mood] || 0) + 1;
      }
    });

    res.json({
      success: true,
      trends: {
        period: days,
        data: trendData,
        summary: {
          totalReadings: periodReadings.length,
          averagePerDay: (periodReadings.length / days).toFixed(2),
          mostActiveDay: Object.entries(trendData)
            .sort((a, b) => b[1].count - a[1].count)[0]?.[0]
        }
      }
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trends'
    });
  }
});

// ===== HELPER FUNCTIONS =====

function calculateStreak(readings) {
  if (readings.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Sort readings by date (newest first)
  const sorted = readings
    .map(r => new Date(r.createdAt))
    .sort((a, b) => b - a);

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let prevDate = null;

  sorted.forEach(date => {
    const dayStr = date.toISOString().split('T')[0];

    if (!prevDate) {
      // First reading
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (dayStr === today || dayStr === yesterday) {
        current = 1;
        tempStreak = 1;
      }
    } else {
      const dayDiff = Math.floor((prevDate - date) / 86400000);

      if (dayDiff === 1) {
        // Consecutive day
        tempStreak++;
        if (current === 0) {
          // Still within current streak
          current = tempStreak;
        }
      } else if (dayDiff > 1) {
        // Streak broken
        tempStreak = 1;
      }
    }

    longest = Math.max(longest, tempStreak);
    prevDate = date;
  });

  return { current, longest };
}

function getReadingsByDay(readings) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const counts = {};

  readings.forEach(reading => {
    const day = days[new Date(reading.createdAt).getDay()];
    counts[day] = (counts[day] || 0) + 1;
  });

  return counts;
}

function getReadingsByHour(readings) {
  const counts = {};

  readings.forEach(reading => {
    const hour = new Date(reading.createdAt).getHours();
    counts[hour] = (counts[hour] || 0) + 1;
  });

  return counts;
}

function calculateAchievements(readings, journalEntries) {
  const achievements = {
    firstReading: readings.length > 0,
    readings10: readings.length >= 10,
    readings50: readings.length >= 50,
    readings100: readings.length >= 100,
    weekStreak: calculateStreak(readings).current >= 7,
    monthStreak: calculateStreak(readings).current >= 30,
    journaler: journalEntries.length >= 10,
    explorer: new Set(readings.flatMap(r => r.cards?.map(c => c.id || c.cardId) || [])).size >= 22
  };

  return achievements;
}

function analyzeMoodCardCorrelation(moodReadings) {
  const moodCards = {};

  moodReadings.forEach(reading => {
    const mood = reading.mood;
    if (!moodCards[mood]) {
      moodCards[mood] = [];
    }

    if (reading.cards) {
      reading.cards.forEach(card => {
        moodCards[mood].push(card.id || card.cardId);
      });
    }
  });

  // Find most common card for each mood
  const correlations = Object.entries(moodCards).map(([mood, cards]) => {
    const frequency = {};
    cards.forEach(cardId => {
      frequency[cardId] = (frequency[cardId] || 0) + 1;
    });

    const topCard = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])[0];

    return { mood, cardId: topCard?.[0], count: topCard?.[1] };
  }).filter(c => c.count >= 3);

  if (correlations.length > 0) {
    const top = correlations[0];
    return {
      message: `Когда вы чувствуете "${top.mood}", часто появляется карта ${top.cardId}`,
      correlation: top
    };
  }

  return null;
}

module.exports = router;
