import {
  getCardImagePath,
  getFallbackImagePath,
  preloadCardImage,
  checkImageExists
} from '../cardImages';

describe('cardImages utilities', () => {
  describe('getCardImagePath', () => {
    describe('null/undefined handling', () => {
      it('returns placeholder for null card', () => {
        expect(getCardImagePath(null)).toBe('/images/cards/placeholder.webp');
      });

      it('returns placeholder for undefined card', () => {
        expect(getCardImagePath(undefined)).toBe('/images/cards/placeholder.webp');
      });
    });

    describe('Major Arcana', () => {
      it('returns correct path for The Fool', () => {
        const card = { name: 'Шут', _id: '00' };
        expect(getCardImagePath(card)).toBe('/cards/major-00.svg');
      });

      it('returns correct path for The Magician', () => {
        const card = { name: 'Маг', _id: '01' };
        expect(getCardImagePath(card)).toBe('/cards/major-01.svg');
      });

      it('returns correct path for The World', () => {
        const card = { name: 'Мир', _id: '21' };
        expect(getCardImagePath(card)).toBe('/cards/major-21.svg');
      });

      it('handles English card names', () => {
        const card = { name: 'The Fool', _id: '00' };
        expect(getCardImagePath(card)).toBe('/cards/major-00.svg');
      });

      it('handles Death card', () => {
        const card = { name: 'Смерть', _id: '13' };
        expect(getCardImagePath(card)).toBe('/cards/major-13.svg');
      });
    });

    describe('Minor Arcana - Wands', () => {
      it('returns correct path for Ace of Wands', () => {
        const card = { name: 'Туз Жезлов', suit: 'wands', _id: 'wands-ace' };
        expect(getCardImagePath(card)).toBe('/cards/wands-ace.svg');
      });

      it('returns correct path for numbered card', () => {
        const card = { name: '3 Жезлов', suit: 'wands', number: 3, _id: 'wands-03' };
        expect(getCardImagePath(card)).toBe('/cards/wands-03.svg');
      });

      it('returns correct path for Page of Wands', () => {
        const card = { name: 'Паж Жезлов', suit: 'wands', _id: 'wands-page' };
        expect(getCardImagePath(card)).toBe('/cards/wands-page.svg');
      });

      it('returns correct path for King of Wands', () => {
        const card = { name: 'Король Жезлов', suit: 'wands', _id: 'wands-king' };
        expect(getCardImagePath(card)).toBe('/cards/wands-king.svg');
      });
    });

    describe('Minor Arcana - Cups', () => {
      it('returns correct path for Ace of Cups', () => {
        const card = { name: 'Туз Кубков', suit: 'cups', _id: 'cups-ace' };
        expect(getCardImagePath(card)).toBe('/cards/cups-ace.svg');
      });

      it('returns correct path for Queen of Cups', () => {
        const card = { name: 'Королева Кубков', suit: 'cups', _id: 'cups-queen' };
        expect(getCardImagePath(card)).toBe('/cards/cups-queen.svg');
      });
    });

    describe('Minor Arcana - Swords', () => {
      it('returns correct path for Ace of Swords', () => {
        const card = { name: 'Туз Мечей', suit: 'swords', _id: 'swords-ace' };
        expect(getCardImagePath(card)).toBe('/cards/swords-ace.svg');
      });

      it('returns correct path for Knight of Swords', () => {
        const card = { name: 'Рыцарь Мечей', suit: 'swords', _id: 'swords-knight' };
        expect(getCardImagePath(card)).toBe('/cards/swords-knight.svg');
      });
    });

    describe('Minor Arcana - Pentacles', () => {
      it('returns correct path for Ace of Pentacles', () => {
        const card = { name: 'Туз Пентаклей', suit: 'pentacles', _id: 'pentacles-ace' };
        expect(getCardImagePath(card)).toBe('/cards/pentacles-ace.svg');
      });

      it('returns correct path for 10 of Pentacles', () => {
        const card = { name: '10 Пентаклей', suit: 'pentacles', number: 10, _id: 'pentacles-10' };
        expect(getCardImagePath(card)).toBe('/cards/pentacles-10.svg');
      });
    });

    describe('Edge cases', () => {
      it('handles uppercase suit', () => {
        const card = { name: 'Туз Жезлов', suit: 'WANDS', _id: 'wands-ace' };
        expect(getCardImagePath(card)).toBe('/cards/wands-ace.svg');
      });

      it('extracts suit from _id when suit not provided', () => {
        const card = { name: 'Туз Жезлов', _id: 'wands-ace' };
        expect(getCardImagePath(card)).toBe('/cards/wands-ace.svg');
      });

      it('returns placeholder for card without valid id', () => {
        const card = { name: 'Unknown Card' };
        expect(getCardImagePath(card)).toBe('/cards/placeholder.svg');
      });
    });
  });

  describe('getFallbackImagePath', () => {
    it('returns Fool card as fallback', () => {
      expect(getFallbackImagePath()).toBe('/cards/major-00-fool.svg');
    });
  });

  describe('preloadCardImage', () => {
    beforeEach(() => {
      // Mock Image constructor
      global.Image = class {
        constructor() {
          setTimeout(() => {
            if (this.src.includes('error')) {
              this.onerror && this.onerror();
            } else {
              this.onload && this.onload();
            }
          }, 10);
        }
      };
    });

    it('resolves with image path on successful load', async () => {
      const result = await preloadCardImage('/cards/major-00.svg');
      expect(result).toBe('/cards/major-00.svg');
    });

    it('rejects on image load error', async () => {
      await expect(preloadCardImage('/cards/error.svg')).rejects.toThrow(
        'Failed to load: /cards/error.svg'
      );
    });
  });

  describe('checkImageExists', () => {
    beforeEach(() => {
      global.Image = class {
        constructor() {
          setTimeout(() => {
            if (this.src.includes('error')) {
              this.onerror && this.onerror();
            } else {
              this.onload && this.onload();
            }
          }, 10);
        }
      };
    });

    it('returns true for existing image', async () => {
      const exists = await checkImageExists('/cards/major-00.svg');
      expect(exists).toBe(true);
    });

    it('returns false for non-existing image', async () => {
      const exists = await checkImageExists('/cards/error.svg');
      expect(exists).toBe(false);
    });
  });
});
