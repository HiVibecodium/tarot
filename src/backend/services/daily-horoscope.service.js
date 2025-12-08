/**
 * Daily Horoscope Service
 * Generates daily astrological predictions for each zodiac sign
 */

/**
 * Get moon phase for a date
 */
function getMoonPhase(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // Simplified moon phase calculation
  const c = year / 100;
  const e = 2 - c + Math.floor(c / 4);
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
  const daysSinceNew = (jd - 2451549.5) / 29.53;
  const phase = (daysSinceNew % 1) * 29.53;

  if (phase < 1.84566) return { name: 'Новолуние', icon: '🌑', energy: 'Начинания' };
  if (phase < 5.53699) return { name: 'Растущий Серп', icon: '🌒', energy: 'Рост' };
  if (phase < 9.22831) return { name: 'Первая Четверть', icon: '🌓', energy: 'Действие' };
  if (phase < 12.91963) return { name: 'Растущая Луна', icon: '🌔', energy: 'Развитие' };
  if (phase < 16.61096) return { name: 'Полнолуние', icon: '🌕', energy: 'Кульминация' };
  if (phase < 20.30228) return { name: 'Убывающая Луна', icon: '🌖', energy: 'Осознание' };
  if (phase < 23.99361) return { name: 'Последняя Четверть', icon: '🌗', energy: 'Отпускание' };
  return { name: 'Убывающий Серп', icon: '🌘', energy: 'Завершение' };
}

/**
 * Get day of week energy
 */
function getDayEnergy(date) {
  const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const dayEnergies = {
    'Воскресенье': { planet: 'Солнце', focus: 'Отдых и восстановление' },
    'Понедельник': { planet: 'Луна', focus: 'Эмоции и интуиция' },
    'Вторник': { planet: 'Марс', focus: 'Действие и энергия' },
    'Среда': { planet: 'Меркурий', focus: 'Общение и обучение' },
    'Четверг': { planet: 'Юпитер', focus: 'Рост и возможности' },
    'Пятница': { planet: 'Венера', focus: 'Любовь и красота' },
    'Суббота': { planet: 'Сатурн', focus: 'Структура и дисциплина' }
  };

  const dayName = dayNames[new Date(date).getDay()];
  return {
    day: dayName,
    ...dayEnergies[dayName]
  };
}

/**
 * Generate daily horoscope for zodiac sign
 */
function generateDailyHoroscope(zodiacSign, date = new Date()) {
  const moonPhase = getMoonPhase(date);
  const dayEnergy = getDayEnergy(date);

  // Sign-specific daily advice
  const dailyAdvice = {
    'Овен': [
      'Сегодня ваша энергия на пике. Идеальный день для начинаний.',
      'Действуйте смело, но помните о терпении.',
      'Ваш огонь может вдохновить других - будьте лидером.',
      'Физическая активность принесёт ясность ума.'
    ],
    'Телец': [
      'День для наслаждения красотой и комфортом.',
      'Финансовые вопросы требуют вашего внимания.',
      'Доверьтесь своим чувствам при принятии решений.',
      'Природа и стабильность - ваши союзники сегодня.'
    ],
    'Близнецы': [
      'Отличный день для общения и новых связей.',
      'Ваше любопытство откроет неожиданные возможности.',
      'Обучение и обмен идеями принесут пользу.',
      'Гибкость мышления - ваше преимущество.'
    ],
    'Рак': [
      'Прислушайтесь к своим эмоциям и интуиции.',
      'Семья и дом требуют вашей заботы.',
      'Время для эмоционального исцеления.',
      'Ваша чувствительность - дар, не слабость.'
    ],
    'Лев': [
      'Сияйте и выражайте себя творчески!',
      'Ваша харизма привлекает возможности.',
      'Щедрость принесёт вам радость.',
      'Признание близко - продолжайте усилия.'
    ],
    'Дева': [
      'Внимание к деталям откроет решение.',
      'Организация и планирование принесут результаты.',
      'Служение другим наполнит вас смыслом.',
      'Практичный подход - ваша сила.'
    ],
    'Весы': [
      'Гармония и баланс - ваши цели сегодня.',
      'Отношения требуют внимания и дипломатии.',
      'Красота и искусство вдохновляют вас.',
      'Принятие решений через равновесие.'
    ],
    'Скорпион': [
      'Глубина и трансформация - ваши темы.',
      'Доверьтесь процессу изменений.',
      'Ваша интенсивность - сила, не угроза.',
      'Тайны и исследования привлекают вас.'
    ],
    'Стрелец': [
      'Расширяйте горизонты и ищите истину.',
      'Оптимизм и вера ведут вас вперёд.',
      'Путешествия (физические или ментальные) вдохновляют.',
      'Ваша философия направляет других.'
    ],
    'Козерог': [
      'Целеустремлённость принесёт результаты.',
      'Структура и дисциплина - ваши инструменты.',
      'Долгосрочное планирование окупится.',
      'Ответственность - ваша сила.'
    ],
    'Водолей': [
      'Инновации и оригинальность выделяют вас.',
      'Сообщество и дружба важны сегодня.',
      'Ваша уникальность - дар миру.',
      'Будущее начинается с ваших идей.'
    ],
    'Рыбы': [
      'Интуиция и мечты ведут вас.',
      'Духовность и творчество - ваши источники.',
      'Сострадание к себе и другим важно.',
      'Границы защищают вашу энергию.'
    ]
  };

  // Get random advice for the sign
  const adviceArray = dailyAdvice[zodiacSign] || dailyAdvice['Овен'];
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const adviceIndex = dayOfYear % adviceArray.length;
  const advice = adviceArray[adviceIndex];

  // Moon phase influence
  const moonAdvice = {
    'Новолуние': 'Время для новых начинаний и намерений.',
    'Растущий Серп': 'Ваши планы набирают силу.',
    'Первая Четверть': 'Действуйте решительно.',
    'Растущая Луна': 'Развивайте то, что начали.',
    'Полнолуние': 'Кульминация и осознание.',
    'Убывающая Луна': 'Время понять и интегрировать.',
    'Последняя Четверть': 'Отпустите ненужное.',
    'Убывающий Серп': 'Подготовка к новому циклу.'
  };

  return {
    date: date.toLocaleDateString('ru-RU'),
    zodiacSign,
    advice,
    moonPhase: {
      ...moonPhase,
      advice: moonAdvice[moonPhase.name]
    },
    dayEnergy: {
      ...dayEnergy,
      advice: `День ${dayEnergy.planet}: ${dayEnergy.focus}`
    },
    luckyNumbers: generateLuckyNumbers(zodiacSign, date),
    luckyColors: getLuckyColors(zodiacSign),
    compatibilityToday: getCompatibilityToday(zodiacSign, date)
  };
}

/**
 * Generate lucky numbers for the day
 */
function generateLuckyNumbers(zodiacSign, date) {
  const signNumbers = {
    'Овен': [1, 9, 19],
    'Телец': [2, 6, 24],
    'Близнецы': [3, 5, 14],
    'Рак': [2, 7, 22],
    'Лев': [1, 4, 19],
    'Дева': [3, 5, 14],
    'Весы': [6, 9, 15],
    'Скорпион': [9, 18, 27],
    'Стрелец': [3, 7, 21],
    'Козерог': [4, 8, 22],
    'Водолей': [4, 11, 29],
    'Рыбы': [3, 7, 12]
  };

  const baseNumbers = signNumbers[zodiacSign] || [7, 14, 21];
  const dayOffset = new Date(date).getDate() % 10;

  return baseNumbers.map(n => (n + dayOffset) % 31 + 1);
}

/**
 * Get lucky colors for sign
 */
function getLuckyColors(zodiacSign) {
  const colors = {
    'Овен': ['Красный', 'Оранжевый'],
    'Телец': ['Зелёный', 'Розовый'],
    'Близнецы': ['Жёлтый', 'Голубой'],
    'Рак': ['Серебряный', 'Белый'],
    'Лев': ['Золотой', 'Оранжевый'],
    'Дева': ['Зелёный', 'Коричневый'],
    'Весы': ['Розовый', 'Голубой'],
    'Скорпион': ['Бордовый', 'Чёрный'],
    'Стрелец': ['Фиолетовый', 'Синий'],
    'Козерог': ['Чёрный', 'Коричневый'],
    'Водолей': ['Электрик', 'Серебряный'],
    'Рыбы': ['Морская волна', 'Лавандовый']
  };

  return colors[zodiacSign] || ['Фиолетовый'];
}

/**
 * Get compatible signs for today
 */
function getCompatibilityToday(zodiacSign, date) {
  const compatibility = {
    'Овен': ['Лев', 'Стрелец', 'Близнецы'],
    'Телец': ['Дева', 'Козерог', 'Рак'],
    'Близнецы': ['Весы', 'Водолей', 'Овен'],
    'Рак': ['Скорпион', 'Рыбы', 'Телец'],
    'Лев': ['Овен', 'Стрелец', 'Близнецы'],
    'Дева': ['Телец', 'Козерог', 'Скорпион'],
    'Весы': ['Близнецы', 'Водолей', 'Лев'],
    'Скорпион': ['Рак', 'Рыбы', 'Дева'],
    'Стрелец': ['Овен', 'Лев', 'Водолей'],
    'Козерог': ['Телец', 'Дева', 'Скорпион'],
    'Водолей': ['Близнецы', 'Весы', 'Стрелец'],
    'Рыбы': ['Рак', 'Скорпион', 'Телец']
  };

  const compatible = compatibility[zodiacSign] || [];
  const dayIndex = new Date(date).getDate() % compatible.length;

  return compatible[dayIndex];
}

/**
 * Combine Tarot card with astrological context
 */
function combineTarotWithAstrology(card, userProfile, horoscope) {
  const sunSignValue = typeof userProfile.sunSign === 'object' ? userProfile.sunSign?.sign : userProfile.sunSign;
  const _moonSignValue = typeof userProfile.moonSign === 'object' ? userProfile.moonSign?.sign : userProfile.moonSign;
  const element = userProfile.element || userProfile.sunSign?.element;

  let combinedInterpretation = card.interpretation || '';

  // Add astrological context
  combinedInterpretation += `\n\n🌟 Астрологический контекст:\n`;

  // Element influence
  const elementAdvice = {
    fire: 'Ваш огненный знак усиливает действие - не бойтесь рисковать!',
    earth: 'Ваш земной знак советует практичный подход - что конкретно делать?',
    air: 'Ваш воздушный знак подсказывает общаться и анализировать.',
    water: 'Ваш водный знак усиливает интуицию - доверяйте чувствам.'
  };

  combinedInterpretation += elementAdvice[element] || '';

  // Moon phase influence
  if (horoscope.moonPhase) {
    combinedInterpretation += `\n${horoscope.moonPhase.icon} ${horoscope.moonPhase.name}: ${horoscope.moonPhase.advice}`;
  }

  // Day energy
  if (horoscope.dayEnergy) {
    combinedInterpretation += `\n⚡ ${horoscope.dayEnergy.advice}`;
  }

  // Today's horoscope
  if (sunSignValue && horoscope.advice) {
    combinedInterpretation += `\n\n📅 Сегодня для ${sunSignValue}:\n${horoscope.advice}`;
  }

  return combinedInterpretation;
}

/**
 * Personalized card selection
 * Weights cards based on user's astrology
 */
function getPersonalizedCardWeights(userProfile) {
  const weights = {};

  if (!userProfile || !userProfile.sunSign) {
    return null; // No personalization without astrology
  }

  const { moonSign, element } = userProfile;

  // User's personal Tarot cards get higher weight
  const personalCards = userProfile.sunSign.tarotCards || [];
  personalCards.forEach(cardName => {
    weights[cardName] = 2.0; // 2x more likely
  });

  // Element-based preferences
  const elementCards = {
    fire: ['Жезлы'], // Wands suit
    earth: ['Пентакли'], // Pentacles
    air: ['Мечи'], // Swords
    water: ['Кубки'] // Cups
  };

  const favoredSuit = elementCards[element];
  if (favoredSuit) {
    // Slightly favor cards of matching element
    // This is subtle - 1.3x weight
    weights[`suit_${favoredSuit[0]}`] = 1.3;
  }

  // Moon sign influence (emotional cards)
  if (moonSign && moonSign.element === 'water') {
    weights['suit_Кубки'] = 1.5; // Favor cups for water moons
  }

  return weights;
}

/**
 * Select card with astrological weighting
 */
function selectPersonalizedCard(availableCards, userProfile) {
  const weights = getPersonalizedCardWeights(userProfile);

  if (!weights) {
    // No personalization - random selection
    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }

  // Create weighted array
  const weightedCards = [];

  availableCards.forEach(card => {
    const cardName = card.name || card.cardName;
    const cardSuit = card.suit;

    // Check if this card has custom weight
    let weight = 1.0;

    // Check by card name
    if (weights[cardName]) {
      weight = weights[cardName];
    }

    // Check by suit
    if (cardSuit && weights[`suit_${cardSuit}`]) {
      weight *= weights[`suit_${cardSuit}`];
    }

    // Add card multiple times based on weight
    const count = Math.round(weight * 10);
    for (let i = 0; i < count; i++) {
      weightedCards.push(card);
    }
  });

  // Random selection from weighted array
  return weightedCards[Math.floor(Math.random() * weightedCards.length)];
}

module.exports = {
  generateDailyHoroscope,
  getMoonPhase,
  getDayEnergy,
  combineTarotWithAstrology,
  getPersonalizedCardWeights,
  selectPersonalizedCard
};
