/**
 * Reading Service
 * Business logic for creating and managing tarot readings
 */

const Card = require('../models/Card.json-model');
const Reading = require('../models/Reading.json-model');
const User = require('../models/User.json-model');
const { TAROT_ZODIAC_MAP: _TAROT_ZODIAC_MAP } = require('./astrology.service');
const { getCombinedReading: _getCombinedReading } = require('./horoscope.service');
const { generateDailyPrediction, formatPredictionAsText } = require('./enhanced-interpretation.service');
const {
  generateDailyHoroscope,
  combineTarotWithAstrology,
  selectPersonalizedCard
} = require('./daily-horoscope.service');

class ReadingService {
  /**
   * Generate daily reading for user
   */
  static async generateDailyReading(userId, mood = null) {
    // Check if user already has reading today
    const existingReading = await Reading.getTodaysDailyReading(userId);

    if (existingReading) {
      return {
        reading: existingReading,
        isNew: false
      };
    }

    // Get user for astrology context
    const user = await User.findById(userId);

    // Check if user has astrology profile
    const hasAstrology = user?.astrologyProfile?.calculated;

    // Get all available cards
    const allCards = await Card.findAll();

    // Select card (personalized if astrology available)
    const card = hasAstrology
      ? selectPersonalizedCard(allCards, user.astrologyProfile)
      : await Card.getRandomCard();

    // Determine if reversed (30% chance)
    const isReversed = Math.random() < 0.3;
    const orientation = isReversed ? 'reversed' : 'upright';

    // Generate daily horoscope if astrology available
    const horoscope = hasAstrology
      ? generateDailyHoroscope(user.astrologyProfile.sunSign.sign)
      : null;

    // Generate enhanced prediction (horoscope-style)
    const prediction = generateDailyPrediction(
      card,
      isReversed,
      user?.astrologyProfile?.calculated ? user.astrologyProfile : null,
      mood
    );

    // Format as text
    let selectedInterpretation = formatPredictionAsText(prediction);

    // Combine with astrology if available
    if (hasAstrology && horoscope) {
      selectedInterpretation = combineTarotWithAstrology(
        { ...card, interpretation: selectedInterpretation },
        user.astrologyProfile,
        horoscope
      );
    }

    // Create reading with optional astrology data
    const reading = await Reading.create({
      userId,
      type: 'daily',
      cards: [{
        cardId: card._id,
        cardName: card.name,
        position: 0,
        reversed: isReversed,
        suit: card.suit,
        arcana: card.arcana
      }],
      interpretation: {
        summary: `${card.name}${isReversed ? ' (Reversed)' : ''}`,
        text: selectedInterpretation,
        keywords: card.keywords[orientation] || card.keywords,
        cardImageUrl: card.imageUrl
      },
      context: {
        type: 'daily',
        question: null,
        // Include astrology context if available
        ...(horoscope && {
          horoscope: {
            zodiacSign: user.astrologyProfile.sunSign.sign,
            moonPhase: horoscope.moonPhase,
            dayEnergy: horoscope.dayEnergy,
            luckyNumbers: horoscope.luckyNumbers,
            luckyColors: horoscope.luckyColors,
            personalizedCard: hasAstrology // Flag that card was personalized
          }
        })
      },
      userFeedback: {
        rating: null,
        notes: null
      }
    });

    // Update user stats (reuse user from earlier)
    if (user) {
      await user.incrementReadings();
    }

    return {
      reading,
      isNew: true,
      // Include horoscope in response for UI display
      ...(horoscope && { horoscope })
    };
  }

  /**
   * Generate 3-card decision reading
   */
  static async generateDecisionReading(userId, question, options = []) {
    // Draw 3 unique cards
    const cards = await Card.getRandomCards(3, false);

    const drawnCards = cards.map((card, index) => {
      const isReversed = Math.random() < 0.3;
      const orientation = isReversed ? 'reversed' : 'upright';
      const interpretations = card.interpretations.decision[orientation];
      const interpretation = interpretations[Math.floor(Math.random() * interpretations.length)];

      return {
        cardId: card._id,
        cardName: card.name,
        position: index,
        positionName: ['Past', 'Present', 'Future'][index],
        reversed: isReversed,
        suit: card.suit,
        arcana: card.arcana,
        interpretation: interpretation,
        keywords: card.keywords[orientation],
        imageUrl: card.imageUrl
      };
    });

    // Combine interpretations
    const combinedInterpretation = this.combineDecisionInterpretations(drawnCards, question);

    // Create reading
    const reading = await Reading.create({
      userId,
      type: 'decision',
      cards: drawnCards,
      interpretation: {
        summary: `Decision Analysis: ${question}`,
        text: combinedInterpretation,
        individualCards: drawnCards.map(c => ({
          position: c.positionName,
          card: c.cardName,
          meaning: c.interpretation
        }))
      },
      context: {
        type: 'decision',
        question,
        options
      },
      userFeedback: {
        rating: null,
        chosenOption: null,
        outcome: null,
        notes: null
      }
    });

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.stats.decisionsMade += 1;
      await user.save();
    }

    return reading;
  }

  /**
   * Combine 3-card interpretations into cohesive decision analysis
   */
  static combineDecisionInterpretations(cards, question) {
    const [past, present, future] = cards;

    let analysis = `Анализ решения: "${question}"\n\n`;

    analysis += `**Прошлое (${past.cardName}):**\n`;
    analysis += `${past.interpretation}\n\n`;

    analysis += `**Настоящее (${present.cardName}):**\n`;
    analysis += `${present.interpretation}\n\n`;

    analysis += `**Будущее (${future.cardName}):**\n`;
    analysis += `${future.interpretation}\n\n`;

    // Simple rule-based recommendation
    const reversedCount = cards.filter(c => c.reversed).length;

    if (reversedCount === 0) {
      analysis += `**Рекомендация:** Карты показывают благоприятное направление. Можно действовать уверенно.`;
    } else if (reversedCount === 1) {
      analysis += `**Рекомендация:** Ситуация требует внимания к деталям. Действуйте осторожно и обдуманно.`;
    } else if (reversedCount === 2) {
      analysis += `**Рекомендация:** Возможны препятствия. Рассмотрите альтернативные варианты.`;
    } else {
      analysis += `**Рекомендация:** Сейчас не лучшее время для этого решения. Подождите более благоприятного момента.`;
    }

    return analysis;
  }

  /**
   * Get user's reading history
   */
  static async getUserReadings(userId, limit = 10) {
    return await Reading.findByUserId(userId, limit);
  }

  /**
   * Get specific reading by ID
   */
  static async getReadingById(readingId, userId) {
    const reading = await Reading.findById(readingId);

    // Verify ownership
    if (reading && reading.userId !== userId) {
      throw new Error('Unauthorized access to reading');
    }

    return reading;
  }

  /**
   * Update reading feedback
   */
  static async updateFeedback(readingId, userId, feedback) {
    const reading = await this.getReadingById(readingId, userId);

    if (!reading) {
      throw new Error('Reading not found');
    }

    reading.userFeedback = {
      ...reading.userFeedback,
      ...feedback,
      updatedAt: new Date().toISOString()
    };

    await reading.save();
    return reading;
  }

  /**
   * Update reading mood context
   */
  static async updateMoodContext(readingId, userId, moodData) {
    const reading = await this.getReadingById(readingId, userId);

    if (!reading) {
      throw new Error('Reading not found');
    }

    await reading.updateMoodContext(moodData);
    return reading;
  }

  /**
   * Get mood statistics for user
   */
  static async getMoodStatistics(userId, days = 30) {
    const Reading = require('../models/Reading.json-model');
    return await Reading.getMoodStats(userId, days);
  }
}

module.exports = ReadingService;
