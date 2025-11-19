/**
 * Astrology Service
 * Calculate zodiac signs and natal chart basics
 */

// Zodiac sign dates
const ZODIAC_SIGNS = [
  { sign: 'Овен', start: [3, 21], end: [4, 19], element: 'Огонь', planet: 'Марс' },
  { sign: 'Телец', start: [4, 20], end: [5, 20], element: 'Земля', planet: 'Венера' },
  { sign: 'Близнецы', start: [5, 21], end: [6, 20], element: 'Воздух', planet: 'Меркурий' },
  { sign: 'Рак', start: [6, 21], end: [7, 22], element: 'Вода', planet: 'Луна' },
  { sign: 'Лев', start: [7, 23], end: [8, 22], element: 'Огонь', planet: 'Солнце' },
  { sign: 'Дева', start: [8, 23], end: [9, 22], element: 'Земля', planet: 'Меркурий' },
  { sign: 'Весы', start: [9, 23], end: [10, 22], element: 'Воздух', planet: 'Венера' },
  { sign: 'Скорпион', start: [10, 23], end: [11, 21], element: 'Вода', planet: 'Плутон' },
  { sign: 'Стрелец', start: [11, 22], end: [12, 21], element: 'Огонь', planet: 'Юпитер' },
  { sign: 'Козерог', start: [12, 22], end: [1, 19], element: 'Земля', planet: 'Сатурн' },
  { sign: 'Водолей', start: [1, 20], end: [2, 18], element: 'Воздух', planet: 'Уран' },
  { sign: 'Рыбы', start: [2, 19], end: [3, 20], element: 'Вода', planet: 'Нептун' }
];

// Tarot - Zodiac correspondences (traditional)
const TAROT_ZODIAC_MAP = {
  'Овен': ['Император'],
  'Телец': ['Иерофант'],
  'Близнецы': ['Влюблённые'],
  'Рак': ['Колесница'],
  'Лев': ['Сила'],
  'Дева': ['Отшельник'],
  'Весы': ['Справедливость'],
  'Скорпион': ['Смерть'],
  'Стрелец': ['Умеренность'],
  'Козерог': ['Дьявол'],
  'Водолей': ['Звезда'],
  'Рыбы': ['Луна']
};

/**
 * Calculate Sun Sign (знак зодиака по дате рождения)
 */
function calculateSunSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const zodiac of ZODIAC_SIGNS) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;

    // Handle year boundary (Capricorn)
    if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return zodiac;
      }
    } else {
      if ((month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)) {
        return zodiac;
      }
    }
  }

  return ZODIAC_SIGNS[0]; // fallback
}

/**
 * Calculate Moon Sign (simplified - needs birth time)
 * This is approximate without full ephemeris
 */
function calculateMoonSign(birthDate, birthTime) {
  // Simplified: Moon moves ~13 degrees/day through signs
  // For MVP, we'll use day of month as approximation
  // Real calculation would need ephemeris data

  const date = new Date(birthDate);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  // Moon cycle is ~28 days, 12 signs
  const signIndex = Math.floor((dayOfYear % 336) / 28) % 12;

  return ZODIAC_SIGNS[signIndex];
}

/**
 * Calculate Rising Sign (Ascendant)
 * Simplified calculation - real one needs precise time and location
 */
function calculateRisingSign(birthDate, birthTime, latitude) {
  // Simplified: Based on birth hour
  // Real calculation needs sidereal time + house system

  if (!birthTime) return null;

  const [hours] = birthTime.split(':').map(Number);

  // Approximate: 2 hours per sign
  const signIndex = Math.floor(hours / 2) % 12;

  return ZODIAC_SIGNS[signIndex];
}

/**
 * Get Tarot cards associated with zodiac sign
 */
function getTarotForSign(sign) {
  return TAROT_ZODIAC_MAP[sign.sign] || [];
}

/**
 * Generate personalized reading context based on astrology
 */
function generateAstroContext(sunSign, moonSign, risingSign) {
  let context = '';

  if (sunSign) {
    context += `Ваш знак Солнца (${sunSign.sign}) управляется ${sunSign.planet}. `;
    context += `Элемент: ${getElementName(sunSign.element)}. `;
  }

  if (moonSign) {
    context += `Луна в ${moonSign.sign} влияет на ваши эмоции. `;
  }

  if (risingSign) {
    context += `Восходящий ${risingSign.sign} формирует вашу внешность и первое впечатление. `;
  }

  return context;
}

function getElementName(element) {
  const names = {
    fire: 'Огонь',
    earth: 'Земля',
    air: 'Воздух',
    water: 'Вода'
  };
  return names[element] || element;
}

/**
 * Main function to calculate full astrology profile
 */
async function calculateAstrologyProfile(birthInfo) {
  const { birthDate, birthTime, birthCity, latitude, longitude } = birthInfo;

  if (!birthDate) {
    return null;
  }

  const sunSign = calculateSunSign(birthDate);
  const moonSign = birthTime ? calculateMoonSign(birthDate, birthTime) : null;
  const risingSign = (birthTime && latitude) ? calculateRisingSign(birthDate, birthTime, latitude) : null;

  return {
    sunSign: sunSign ? {
      sign: sunSign.sign,
      element: sunSign.element,
      planet: sunSign.planet,
      tarotCards: getTarotForSign(sunSign)
    } : null,
    moonSign: moonSign ? {
      sign: moonSign.sign,
      element: moonSign.element
    } : null,
    risingSign: risingSign ? {
      sign: risingSign.sign,
      element: risingSign.element
    } : null,
    personalizedContext: generateAstroContext(sunSign, moonSign, risingSign),
    calculated: true,
    calculatedAt: new Date().toISOString()
  };
}

module.exports = {
  calculateSunSign,
  calculateMoonSign,
  calculateRisingSign,
  calculateAstrologyProfile,
  getTarotForSign,
  ZODIAC_SIGNS,
  TAROT_ZODIAC_MAP
};
