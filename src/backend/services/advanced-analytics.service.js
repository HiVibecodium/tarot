/**
 * Advanced Analytics Service
 * Card frequency heatmaps, decision success tracking, pattern recognition
 */

const Reading = require('../models/Reading.json-model');
const db = require('../db/json-store');

class AdvancedAnalyticsService {
  /**
   * Get card frequency analysis
   */
  static async getCardFrequency(userId, days = 90) {
    const readings = await Reading.findByUserId(userId, 1000);

    // Filter by date
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const recentReadings = readings.filter(r =>
      new Date(r.createdAt) >= dateThreshold
    );

    const cardFrequency = {};
    const arcanaFrequency = { major: 0, minor: 0 };
    const suitFrequency = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
    const positionFrequency = { upright: 0, reversed: 0 };

    recentReadings.forEach(reading => {
      if (!reading.cards) return;

      reading.cards.forEach(card => {
        // Overall frequency
        const cardId = card._id || card.id;
        cardFrequency[cardId] = (cardFrequency[cardId] || 0) + 1;

        // Arcana type
        if (card.arcana) {
          arcanaFrequency[card.arcana] = (arcanaFrequency[card.arcana] || 0) + 1;
        }

        // Suit frequency (minor arcana only)
        if (card.suit) {
          suitFrequency[card.suit] = (suitFrequency[card.suit] || 0) + 1;
        }

        // Position frequency
        if (card.position) {
          positionFrequency[card.position] = (positionFrequency[card.position] || 0) + 1;
        }
      });
    });

    // Find most frequent cards
    const sortedCards = Object.entries(cardFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([cardId, count]) => ({
        cardId,
        count,
        percentage: Math.round((count / recentReadings.length) * 100)
      }));

    return {
      totalReadings: recentReadings.length,
      period: `${days} days`,
      cardFrequency: sortedCards,
      arcanaDistribution: arcanaFrequency,
      suitDistribution: suitFrequency,
      positionDistribution: positionFrequency
    };
  }

  /**
   * Get decision success rate
   */
  static async getDecisionSuccessRate(userId) {
    const allReadings = await db.find('readings', { userId, type: 'decision' });

    const decisionsWithOutcome = allReadings.filter(r =>
      r.outcome && r.outcome.recorded
    );

    if (decisionsWithOutcome.length === 0) {
      return {
        totalDecisions: allReadings.length,
        decisionsWithOutcome: 0,
        successRate: null,
        message: 'Недостаточно данных. Отмечайте результаты решений для анализа.'
      };
    }

    const successful = decisionsWithOutcome.filter(r =>
      r.outcome.wasSuccessful || r.outcome.satisfactionScore >= 4
    );

    const successRate = Math.round((successful.length / decisionsWithOutcome.length) * 100);

    // Success by card
    const cardSuccessRate = {};
    decisionsWithOutcome.forEach(reading => {
      if (!reading.cards) return;

      reading.cards.forEach(card => {
        const cardId = card._id || card.id;
        if (!cardSuccessRate[cardId]) {
          cardSuccessRate[cardId] = { total: 0, successful: 0 };
        }
        cardSuccessRate[cardId].total++;
        if (reading.outcome.wasSuccessful) {
          cardSuccessRate[cardId].successful++;
        }
      });
    });

    // Calculate rates
    const cardRates = Object.entries(cardSuccessRate)
      .map(([cardId, data]) => ({
        cardId,
        successRate: Math.round((data.successful / data.total) * 100),
        totalDecisions: data.total
      }))
      .filter(c => c.totalDecisions >= 3) // Min 3 decisions for statistical relevance
      .sort((a, b) => b.successRate - a.successRate);

    return {
      totalDecisions: allReadings.length,
      decisionsWithOutcome: decisionsWithOutcome.length,
      successful: successful.length,
      successRate,
      cardSuccessRates: cardRates.slice(0, 10),
      averageSatisfaction: this._calculateAverageSatisfaction(decisionsWithOutcome)
    };
  }

  /**
   * Pattern recognition
   */
  static async getPatterns(userId) {
    const readings = await Reading.findByUserId(userId, 500);

    const patterns = {
      timeOfDay: this._analyzeTimePatterns(readings),
      dayOfWeek: this._analyzeDayPatterns(readings),
      readingTypes: this._analyzeTypePatterns(readings),
      streaks: this._analyzeStreaks(readings)
    };

    return patterns;
  }

  /**
   * Complete analytics dashboard data
   */
  static async getCompleteAnalytics(userId, days = 90) {
    const [cardFrequency, decisionSuccess, patterns, moodStats] = await Promise.all([
      this.getCardFrequency(userId, days),
      this.getDecisionSuccessRate(userId),
      this.getPatterns(userId),
      Reading.getMoodStats(userId, days)
    ]);

    return {
      cardFrequency,
      decisionSuccess,
      patterns,
      moodStats,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Export analytics as CSV
   */
  static async exportAsCSV(userId) {
    const analytics = await this.getCompleteAnalytics(userId);
    const { stringify } = require('csv-stringify/sync');

    // Card frequency CSV
    const cardData = analytics.cardFrequency.cardFrequency.map(c => ({
      'Card ID': c.cardId,
      'Frequency': c.count,
      'Percentage': c.percentage + '%'
    }));

    const csv = stringify(cardData, { header: true });

    return {
      filename: `tarot-analytics-${userId}-${Date.now()}.csv`,
      data: csv,
      contentType: 'text/csv'
    };
  }

  // Helper methods
  static _calculateAverageSatisfaction(readings) {
    const withSatisfaction = readings.filter(r =>
      r.outcome?.satisfactionScore
    );

    if (withSatisfaction.length === 0) return null;

    const total = withSatisfaction.reduce((sum, r) =>
      sum + r.outcome.satisfactionScore, 0
    );

    return Math.round((total / withSatisfaction.length) * 10) / 10;
  }

  static _analyzeTimePatterns(readings) {
    const hourCounts = {};

    readings.forEach(reading => {
      const hour = new Date(reading.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const mostActiveHour = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      mostActiveHour: mostActiveHour ? parseInt(mostActiveHour[0]) : null,
      hourDistribution: hourCounts
    };
  }

  static _analyzeDayPatterns(readings) {
    const dayCounts = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    readings.forEach(reading => {
      const day = new Date(reading.createdAt).getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const mostActiveDay = Object.entries(dayCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      mostActiveDay: mostActiveDay ? dayNames[parseInt(mostActiveDay[0])] : null,
      dayDistribution: dayCounts
    };
  }

  static _analyzeTypePatterns(readings) {
    const typeCounts = {};

    readings.forEach(reading => {
      const type = reading.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return typeCounts;
  }

  static _analyzeStreaks(readings) {
    if (readings.length === 0) return { current: 0, longest: 0 };

    // Sort by date ascending
    const sorted = [...readings].sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    sorted.forEach(reading => {
      const readingDate = new Date(reading.createdAt);
      readingDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const dayDiff = Math.floor((readingDate - lastDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (dayDiff > 1) {
          currentStreak = 1;
        }
      }

      lastDate = readingDate;
    });

    // Check if streak is current (today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isCurrentStreak = lastDate &&
      (lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime());

    return {
      current: isCurrentStreak ? currentStreak : 0,
      longest: longestStreak
    };
  }
}

module.exports = AdvancedAnalyticsService;
