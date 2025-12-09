/**
 * Moon Phases Service Tests
 */

const moonService = require('../services/moon-phases.service');

describe('Moon Phases Service', () => {

  describe('calculateMoonPhase', () => {
    it('should return moon phase data', () => {
      const result = moonService.calculateMoonPhase();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('phaseName');
      expect(result).toHaveProperty('illumination');
      expect(result).toHaveProperty('emoji');
      expect(result).toHaveProperty('description');
    });

    it('should return valid phase name in Russian', () => {
      const result = moonService.calculateMoonPhase();
      const validPhases = [
        'Новолуние',
        'Растущий серп',
        'Первая четверть',
        'Растущая Луна',
        'Полнолуние',
        'Убывающая Луна',
        'Последняя четверть',
        'Убывающий серп'
      ];

      expect(validPhases).toContain(result.phaseName);
    });

    it('should return illumination between 0 and 100', () => {
      const result = moonService.calculateMoonPhase();

      expect(result.illumination).toBeGreaterThanOrEqual(0);
      expect(result.illumination).toBeLessThanOrEqual(100);
    });

    it('should return phaseValue between 0 and 1', () => {
      const result = moonService.calculateMoonPhase();

      expect(result.phaseValue).toBeGreaterThanOrEqual(0);
      expect(result.phaseValue).toBeLessThanOrEqual(1);
    });

    it('should accept custom date', () => {
      const customDate = new Date('2024-01-01');
      const result = moonService.calculateMoonPhase(customDate);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('phaseName');
    });

    it('should return recommendations object', () => {
      const result = moonService.calculateMoonPhase();

      expect(result).toHaveProperty('recommendations');
      expect(result.recommendations).toHaveProperty('tarot');
      expect(result.recommendations).toHaveProperty('general');
    });
  });

  describe('calculateMoonPhase for specific dates', () => {
    it('should calculate phase for specific date', () => {
      const testDate = new Date('2024-01-11');
      const result = moonService.calculateMoonPhase(testDate);

      expect(result).toBeDefined();
      expect(result.phaseName).toBeDefined();
    });

    it('should return consistent results for same date', () => {
      const testDate = new Date('2024-06-15');

      const result1 = moonService.calculateMoonPhase(testDate);
      const result2 = moonService.calculateMoonPhase(testDate);

      expect(result1.phaseName).toBe(result2.phaseName);
      expect(result1.illumination).toBe(result2.illumination);
      expect(result1.phaseValue).toBe(result2.phaseValue);
    });

    it('should return different phases for different dates', () => {
      const date1 = new Date('2024-01-11'); // Near new moon
      const date2 = new Date('2024-01-25'); // Near full moon

      const result1 = moonService.calculateMoonPhase(date1);
      const result2 = moonService.calculateMoonPhase(date2);

      // Phases should be different (roughly 2 weeks apart)
      expect(result1.phaseValue).not.toBe(result2.phaseValue);
    });
  });

  describe('getRecommendations', () => {
    it('should return recommendations for Новолуние', () => {
      const recommendations = moonService.getRecommendations('Новолуние');

      expect(recommendations).toBeDefined();
      expect(recommendations).toHaveProperty('tarot');
      expect(recommendations).toHaveProperty('general');
      expect(Array.isArray(recommendations.general)).toBe(true);
    });

    it('should return recommendations for Полнолуние', () => {
      const recommendations = moonService.getRecommendations('Полнолуние');

      expect(recommendations).toBeDefined();
      expect(recommendations.tarot).toBeDefined();
    });

    it('should return recommendations for all phases', () => {
      const phases = [
        'Новолуние',
        'Растущий серп',
        'Первая четверть',
        'Растущая Луна',
        'Полнолуние',
        'Убывающая Луна',
        'Последняя четверть',
        'Убывающий серп'
      ];

      phases.forEach(phase => {
        const recommendations = moonService.getRecommendations(phase);
        expect(recommendations).toBeDefined();
      });
    });
  });

  describe('Moon phase emoji', () => {
    it('should return emoji for each phase', () => {
      const phases = [
        { date: new Date('2024-01-11'), expectedEmojis: ['🌑', '🌒', '🌘'] }, // New moon area
        { date: new Date('2024-01-18'), expectedEmojis: ['🌓', '🌔'] }, // First quarter area
        { date: new Date('2024-01-25'), expectedEmojis: ['🌕', '🌔'] }, // Full moon area
      ];

      phases.forEach(({ date }) => {
        const result = moonService.calculateMoonPhase(date);
        expect(result.emoji).toBeDefined();
        expect(typeof result.emoji).toBe('string');
        expect(result.emoji.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Moon phase descriptions', () => {
    it('should return description in Russian', () => {
      const result = moonService.calculateMoonPhase();

      expect(result.description).toBeDefined();
      expect(typeof result.description).toBe('string');
      // Russian text check (contains Cyrillic)
      expect(/[а-яА-ЯёЁ]/.test(result.description)).toBe(true);
    });

    it('should return energy description', () => {
      const result = moonService.calculateMoonPhase();

      expect(result.energy).toBeDefined();
      expect(typeof result.energy).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('should handle dates in the past', () => {
      const pastDate = new Date('2000-01-01');
      const result = moonService.calculateMoonPhase(pastDate);

      expect(result).toBeDefined();
      expect(result.phaseName).toBeDefined();
    });

    it('should handle dates in the future', () => {
      const futureDate = new Date('2030-12-31');
      const result = moonService.calculateMoonPhase(futureDate);

      expect(result).toBeDefined();
      expect(result.phaseName).toBeDefined();
    });

    it('should handle date at midnight', () => {
      const midnightDate = new Date('2024-06-15T00:00:00Z');
      const result = moonService.calculateMoonPhase(midnightDate);

      expect(result).toBeDefined();
    });

    it('should return ISO date string', () => {
      const result = moonService.calculateMoonPhase();

      expect(result.date).toBeDefined();
      expect(typeof result.date).toBe('string');
      // Should be valid ISO string
      expect(new Date(result.date).toISOString()).toBe(result.date);
    });
  });
});
