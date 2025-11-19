/**
 * Visual styles for each tarot card
 * Unique gradients and emojis
 */

export const CARD_VISUALS = {
  // Major Arcana
  'major-00-fool': { gradient: ['#FF6B6B', '#FFE66D'], emoji: '🤡', symbol: '∞' },
  'major-01-magician': { gradient: ['#A8E6CF', '#DCEDC1'], emoji: '🎩', symbol: '∞' },
  'major-02-priestess': { gradient: ['#C7CEEA', '#B5B9D8'], emoji: '🌙', symbol: '⚕️' },
  'major-03-empress': { gradient: ['#FFB6C1', '#FFE4E1'], emoji: '👑', symbol: '♀' },
  'major-04-emperor': { gradient: ['#FF7F50', '#FFA07A'], emoji: '🦁', symbol: '♂' },
  'major-05-hierophant': { gradient: ['#DDA15E', '#BC6C25'], emoji: '📿', symbol: '🔑' },
  'major-06-lovers': { gradient: ['#FF69B4', '#FFB6C1'], emoji: '💕', symbol: '♊' },
  'major-07-chariot': { gradient: ['#4ECDC4', '#44A08D'], emoji: '🏇', symbol: '♋' },
  'major-08-strength': { gradient: ['#FECA57', '#FF9FF3'], emoji: '🦁', symbol: '♌' },
  'major-09-hermit': { gradient: ['#9B59B6', '#8E44AD'], emoji: '🏮', symbol: '♍' },
  'major-10-wheel': { gradient: ['#3498DB', '#2980B9'], emoji: '🎡', symbol: '☸' },
  'major-11-justice': { gradient: ['#E67E22', '#D35400'], emoji: '⚖️', symbol: '♎' },
  'major-12-hanged': { gradient: ['#1ABC9C', '#16A085'], emoji: '🙃', symbol: '☤' },
  'major-13-death': { gradient: ['#34495E', '#2C3E50'], emoji: '💀', symbol: '♏' },
  'major-14-temperance': { gradient: ['#95E1D3', '#F38181'], emoji: '👼', symbol: '♐' },
  'major-15-devil': { gradient: ['#8B0000', '#DC143C'], emoji: '😈', symbol: '♑' },
  'major-16-tower': { gradient: ['#FF4757', '#FF6348'], emoji: '🏰', symbol: '⚡' },
  'major-17-star': { gradient: ['#48C9B0', '#1ABC9C'], emoji: '⭐', symbol: '♒' },
  'major-18-moon': { gradient: ['#5F27CD', '#341F97'], emoji: '🌙', symbol: '♓' },
  'major-19-sun': { gradient: ['#FFA502', '#FF7F50'], emoji: '☀️', symbol: '☉' },
  'major-20-judgement': { gradient: ['#EE5A6F', '#F79F1F'], emoji: '📯', symbol: '♇' },
  'major-21-world': { gradient: ['#00D2FF', '#3A7BD5'], emoji: '🌍', symbol: '♄' },

  // Wands (Fire - Red/Orange tones)
  'wands-ace': { gradient: ['#FF6B35', '#F7931E'], emoji: '🔥', symbol: 'I' },
  'wands-02': { gradient: ['#FF8C42', '#FFA559'], emoji: '🔥', symbol: 'II' },
  'wands-03': { gradient: ['#FFA07A', '#FFB6C1'], emoji: '🔥', symbol: 'III' },
  'wands-04': { gradient: ['#FF7F50', '#FF6347'], emoji: '🔥', symbol: 'IV' },
  'wands-05': { gradient: ['#FF4500', '#FF6347'], emoji: '🔥', symbol: 'V' },
  'wands-06': { gradient: ['#FF8C00', '#FFA500'], emoji: '🔥', symbol: 'VI' },
  'wands-07': { gradient: ['#FFB84D', '#F5A962'], emoji: '🔥', symbol: 'VII' },
  'wands-08': { gradient: ['#FF9966', '#FF6B6B'], emoji: '🔥', symbol: 'VIII' },
  'wands-09': { gradient: ['#FF7043', '#FF5722'], emoji: '🔥', symbol: 'IX' },
  'wands-10': { gradient: ['#D84315', '#BF360C'], emoji: '🔥', symbol: 'X' },
  'wands-page': { gradient: ['#FFB300', '#FF6F00'], emoji: '🔥', symbol: 'P' },
  'wands-knight': { gradient: ['#F4511E', '#E64A19'], emoji: '🔥', symbol: 'Kn' },
  'wands-queen': { gradient: ['#FF6E40', '#FF3D00'], emoji: '🔥', symbol: 'Q' },
  'wands-king': { gradient: ['#DD2C00', '#BF360C'], emoji: '🔥', symbol: 'K' },

  // Cups (Water - Blue/Silver tones)
  'cups-ace': { gradient: ['#42A5F5', '#1E88E5'], emoji: '💧', symbol: 'I' },
  'cups-02': { gradient: ['#64B5F6', '#42A5F5'], emoji: '💧', symbol: 'II' },
  'cups-03': { gradient: ['#90CAF9', '#64B5F6'], emoji: '💧', symbol: 'III' },
  'cups-04': { gradient: ['#BBDEFB', '#90CAF9'], emoji: '💧', symbol: 'IV' },
  'cups-05': { gradient: ['#2196F3', '#1976D2'], emoji: '💧', symbol: 'V' },
  'cups-06': { gradient: ['#03A9F4', '#0288D1'], emoji: '💧', symbol: 'VI' },
  'cups-07': { gradient: ['#00BCD4', '#0097A7'], emoji: '💧', symbol: 'VII' },
  'cups-08': { gradient: ['#00ACC1', '#00838F'], emoji: '💧', symbol: 'VIII' },
  'cups-09': { gradient: ['#0097A7', '#00838F'], emoji: '💧', symbol: 'IX' },
  'cups-10': { gradient: ['#006064', '#004D40'], emoji: '💧', symbol: 'X' },
  'cups-page': { gradient: ['#4FC3F7', '#29B6F6'], emoji: '💧', symbol: 'P' },
  'cups-knight': { gradient: ['#039BE5', '#0277BD'], emoji: '💧', symbol: 'Kn' },
  'cups-queen': { gradient: ['#0288D1', '#01579B'], emoji: '💧', symbol: 'Q' },
  'cups-king': { gradient: ['#01579B', '#003366'], emoji: '💧', symbol: 'K' },

  // Swords (Air - Yellow/White tones)
  'swords-ace': { gradient: ['#FFEB3B', '#FDD835'], emoji: '⚔️', symbol: 'I' },
  'swords-02': { gradient: ['#FFEE58', '#FDD835'], emoji: '⚔️', symbol: 'II' },
  'swords-03': { gradient: ['#FFF176', '#FFEE58'], emoji: '⚔️', symbol: 'III' },
  'swords-04': { gradient: ['#FFF59D', '#FFF176'], emoji: '⚔️', symbol: 'IV' },
  'swords-05': { gradient: ['#FFEB3B', '#FBC02D'], emoji: '⚔️', symbol: 'V' },
  'swords-06': { gradient: ['#FDD835', '#F9A825'], emoji: '⚔️', symbol: 'VI' },
  'swords-07': { gradient: ['#F9A825', '#F57F17'], emoji: '⚔️', symbol: 'VII' },
  'swords-08': { gradient: ['#F57F17', '#E65100'], emoji: '⚔️', symbol: 'VIII' },
  'swords-09': { gradient: ['#FFD54F', '#FFCA28'], emoji: '⚔️', symbol: 'IX' },
  'swords-10': { gradient: ['#FFC107', '#FF8F00'], emoji: '⚔️', symbol: 'X' },
  'swords-page': { gradient: ['#FFECB3', '#FFE082'], emoji: '⚔️', symbol: 'P' },
  'swords-knight': { gradient: ['#FFE082', '#FFD54F'], emoji: '⚔️', symbol: 'Kn' },
  'swords-queen': { gradient: ['#FFCA28', '#FFB300'], emoji: '⚔️', symbol: 'Q' },
  'swords-king': { gradient: ['#FFB300', '#FF6F00'], emoji: '⚔️', symbol: 'K' },

  // Pentacles (Earth - Green/Brown tones)
  'pentacles-ace': { gradient: ['#66BB6A', '#43A047'], emoji: '⭐', symbol: 'I' },
  'pentacles-02': { gradient: ['#81C784', '#66BB6A'], emoji: '⭐', symbol: 'II' },
  'pentacles-03': { gradient: ['#A5D6A7', '#81C784'], emoji: '⭐', symbol: 'III' },
  'pentacles-04': { gradient: ['#C8E6C9', '#A5D6A7'], emoji: '⭐', symbol: 'IV' },
  'pentacles-05': { gradient: ['#4CAF50', '#388E3C'], emoji: '⭐', symbol: 'V' },
  'pentacles-06': { gradient: ['#8BC34A', '#689F38'], emoji: '⭐', symbol: 'VI' },
  'pentacles-07': { gradient: ['#9CCC65', '#7CB342'], emoji: '⭐', symbol: 'VII' },
  'pentacles-08': { gradient: ['#AED581', '#9CCC65'], emoji: '⭐', symbol: 'VIII' },
  'pentacles-09': { gradient: ['#7CB342', '#558B2F'], emoji: '⭐', symbol: 'IX' },
  'pentacles-10': { gradient: ['#558B2F', '#33691E'], emoji: '⭐', symbol: 'X' },
  'pentacles-page': { gradient: ['#8BC34A', '#7CB342'], emoji: '⭐', symbol: 'P' },
  'pentacles-knight': { gradient: ['#689F38', '#558B2F'], emoji: '⭐', symbol: 'Kn' },
  'pentacles-queen': { gradient: ['#558B2F', '#33691E'], emoji: '⭐', symbol: 'Q' },
  'pentacles-king': { gradient: ['#33691E', '#1B5E20'], emoji: '⭐', symbol: 'K' }
};

export function getCardVisual(cardId) {
  return CARD_VISUALS[cardId] || {
    gradient: ['#667eea', '#764ba2'],
    emoji: '🔮',
    symbol: '?'
  };
}
