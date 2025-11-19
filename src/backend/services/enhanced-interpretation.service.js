/**
 * Enhanced Interpretation Service
 * Generates detailed horoscope-style predictions from tarot cards
 */

/**
 * Generate card description
 */
function generateCardDescription(card, isReversed) {
  const arcanaType = card.arcana === 'major' ? 'Старший Аркан' : 'Младший Аркан';
  const suitNames = {
    wands: 'Жезлов',
    cups: 'Кубков',
    swords: 'Мечей',
    pentacles: 'Пентаклей'
  };

  let description = `${card.name} `;

  if (card.arcana === 'major') {
    description += `(${arcanaType}, номер ${card.number})`;
  } else {
    description += `(${arcanaType}, ${suitNames[card.suit]})`;
  }

  if (isReversed) {
    description += ` - Перевёрнутая позиция`;
  }

  // Add keywords
  const keywords = isReversed ? card.keywords.reversed : card.keywords.upright;
  if (keywords && keywords.length > 0) {
    description += `\nКлючевые слова: ${keywords.slice(0, 4).join(', ')}`;
  }

  return description;
}

/**
 * Generate detailed daily horoscope from tarot card
 */
function generateDailyPrediction(card, isReversed, userAstrology = null, mood = null) {
  const orientation = isReversed ? 'reversed' : 'upright';
  const baseInterpretation = card.interpretations.daily[orientation];
  const selectedBase = baseInterpretation[Math.floor(Math.random() * baseInterpretation.length)];

  // Generate structured prediction
  const prediction = {
    // Описание самой карты
    cardDescription: generateCardDescription(card, isReversed),

    // Краткое описание карты
    cardMeaning: selectedBase,

    // Общий прогноз на день
    generalForecast: generateGeneralForecast(card, isReversed),

    // Что ожидать сегодня
    expectations: generateExpectations(card, isReversed),

    // Советы и рекомендации
    advice: {
      doToday: generateDoAdvice(card, isReversed),
      avoidToday: generateAvoidAdvice(card, isReversed)
    },

    // Сферы жизни
    lifeAreas: {
      love: generateLoveAdvice(card, isReversed),
      career: generateCareerAdvice(card, isReversed),
      health: generateHealthAdvice(card, isReversed),
      finances: generateFinanceAdvice(card, isReversed)
    },

    // Удачное время
    luckyTime: generateLuckyTime(),

    // Цвет дня
    luckyColor: getLuckyColor(card),

    // Число дня
    luckyNumber: getLuckyNumber(card)
  };

  // Add astrology enhancement if available
  if (userAstrology?.sunSign) {
    prediction.astrologyBonus = generateAstrologyBonus(card, userAstrology);
  }

  // Add mood-based personalization
  if (mood) {
    prediction.moodInfluence = generateMoodInfluence(mood, card, isReversed, userAstrology);
  }

  return prediction;
}

/**
 * Generate mood-based influence on interpretation
 */
function generateMoodInfluence(mood, card, isReversed, astrology) {
  const moodMessages = {
    happy: {
      positive: 'Ваше радостное настроение усиливает позитивную энергию этой карты! Сегодня ваш оптимизм откроет новые двери.',
      negative: 'Несмотря на ваше хорошее настроение, карта предупреждает о возможных препятствиях. Сохраняйте позитив, но будьте внимательны.'
    },
    calm: {
      positive: 'Ваше спокойствие - идеальное состояние для принятия решений сегодня. Карта подтверждает правильность вашего пути.',
      negative: 'Ваше спокойствие поможет пережить вызовы, которые показывает карта. Сохраняйте баланс.'
    },
    anxious: {
      positive: 'Ваша тревога напрасна! Карта показывает благоприятное развитие событий. Доверьтесь процессу.',
      negative: 'Ваша тревога имеет основания. Карта советует быть осторожным, но не позволяйте страху парализовать вас.'
    },
    sad: {
      positive: 'Эта карта приносит луч света в ваше грустное настроение. Перемены к лучшему близко!',
      negative: 'Карта отражает ваше текущее состояние, но помните - это временно. Позаботьтесь о себе сегодня.'
    },
    excited: {
      positive: 'Ваша взволнованность оправдана! Карта обещает интересные события. Направьте энергию конструктивно.',
      negative: 'Умерьте свой энтузиазм. Карта советует действовать осмотрительно, несмотря на волнение.'
    },
    confused: {
      positive: 'Ваша растерянность скоро пройдёт. Карта показывает путь к ясности. Прислушайтесь к совету.',
      negative: 'Ваша растерянность понятна - ситуация сложная. Карта советует взять паузу перед решениями.'
    },
    angry: {
      positive: 'Ваш гнев может стать силой для позитивных изменений. Карта показывает как направить энергию правильно.',
      negative: 'Ваш гнев может помешать увидеть решение. Карта советует остыть и переосмыслить ситуацию.'
    },
    hopeful: {
      positive: 'Ваша надежда оправдана! Карта подтверждает благоприятные перспективы. Продолжайте верить.',
      negative: 'Не теряйте надежду, несмотря на предупреждение карты. Сложности временны.'
    }
  };

  const moodMsg = moodMessages[mood] || moodMessages.calm;
  const message = isReversed ? moodMsg.negative : moodMsg.positive;

  let influence = `\n🎭 ВЛИЯНИЕ ВАШЕГО НАСТРОЕНИЯ:\n${message}`;

  // Add astrology connection to mood if available
  if (astrology?.sunSign) {
    const element = astrology.sunSign.element;
    const elementMoodConnection = {
      fire: 'Ваш огненный знак усиливает эмоциональную реакцию.',
      earth: 'Ваш земной знак помогает сохранять стабильность.',
      air: 'Ваш воздушный знак помогает рационально оценить ситуацию.',
      water: 'Ваш водный знак делает эмоции особенно глубокими.'
    };
    influence += ` ${elementMoodConnection[element] || ''}`;
  }

  return influence;
}

function generateGeneralForecast(card, isReversed) {
  const arcana = card.arcana;
  const suit = card.suit;

  let forecast = '';

  if (arcana === 'major') {
    forecast = isReversed
      ? 'День может принести неожиданные повороты. Будьте готовы к переменам и сохраняйте гибкость.'
      : 'Сегодня день значимых событий. Обратите внимание на знаки судьбы и доверьтесь процессу.';
  } else {
    const suitForecasts = {
      wands: 'Энергия и действие - ваши союзники сегодня. День благоприятен для активности.',
      cups: 'Эмоции и отношения выходят на первый план. Слушайте своё сердце.',
      swords: 'Ясность ума и логика помогут принять верные решения. День для анализа.',
      pentacles: 'Материальные вопросы и практичность важны сегодня. Фокус на конкретных делах.'
    };
    forecast = suitForecasts[suit] || 'День несёт свои уроки и возможности.';
  }

  return forecast;
}

function generateExpectations(card, isReversed) {
  const expectations = [];

  expectations.push(isReversed
    ? '⚠️ Возможны небольшие препятствия или задержки'
    : '✨ Появятся новые возможности');

  expectations.push(isReversed
    ? '💭 Важно переосмыслить подход к ситуациям'
    : '🎯 Ваши действия приведут к результатам');

  expectations.push('🌟 Знаки и подсказки будут вокруг вас');

  return expectations;
}

function generateDoAdvice(card, isReversed) {
  const advice = [];

  if (!isReversed) {
    advice.push('✅ Действуйте уверенно в соответствии со своими целями');
    advice.push('✅ Доверяйте интуиции и первым впечатлениям');
    advice.push('✅ Будьте открыты новому опыту');
  } else {
    advice.push('✅ Проявите осторожность и внимательность');
    advice.push('✅ Переоцените текущие планы');
    advice.push('✅ Сосредоточьтесь на внутренней работе');
  }

  return advice;
}

function generateAvoidAdvice(card, isReversed) {
  const advice = [];

  if (!isReversed) {
    advice.push('❌ Не игнорируйте детали');
    advice.push('❌ Избегайте поспешных решений без размышления');
    advice.push('❌ Не отвергайте помощь других');
  } else {
    advice.push('❌ Не застревайте в негативе');
    advice.push('❌ Избегайте импульсивных действий');
    advice.push('❌ Не изолируйтесь от окружающих');
  }

  return advice;
}

function generateLoveAdvice(card, isReversed) {
  return isReversed
    ? 'Возможны недопонимания. Время для честного диалога.'
    : 'Благоприятный день для отношений. Выражайте чувства открыто.';
}

function generateCareerAdvice(card, isReversed) {
  return isReversed
    ? 'Проявите терпение с рабочими задачами. Не торопите события.'
    : 'Хороший день для карьерных инициатив. Проявите себя.';
}

function generateHealthAdvice(card, isReversed) {
  return isReversed
    ? 'Прислушайтесь к сигналам тела. Возможна усталость - отдохните.'
    : 'Энергия на высоте. Хороший день для спорта или активности.';
}

function generateFinanceAdvice(card, isReversed) {
  return isReversed
    ? 'Будьте осторожны с тратами. Отложите крупные покупки.'
    : 'Благоприятно для финансовых решений. Но всё равно взвешивайте.';
}

function generateLuckyTime() {
  const hours = ['утро (6-12)', 'день (12-18)', 'вечер (18-22)', 'ночь (22-6)'];
  return hours[Math.floor(Math.random() * hours.length)];
}

function getLuckyColor(card) {
  const colors = {
    wands: 'Красный, Оранжевый',
    cups: 'Синий, Серебристый',
    swords: 'Жёлтый, Белый',
    pentacles: 'Зелёный, Коричневый',
    major: 'Фиолетовый, Золотой'
  };
  return colors[card.suit] || colors.major;
}

function getLuckyNumber(card) {
  if (card.number !== undefined && card.number !== null) {
    return card.number;
  }
  return Math.floor(Math.random() * 22) + 1;
}

function generateAstrologyBonus(card, astrology) {
  const sunSign = astrology.sunSign?.sign;
  const element = astrology.sunSign?.element;

  if (!sunSign) return '';

  const elementNames = {
    fire: 'Огня',
    earth: 'Земли',
    air: 'Воздуха',
    water: 'Воды'
  };

  const elementName = elementNames[element] || 'стихии';

  return `🌟 Для ${sunSign}: Ваша энергия ${elementName} усиливает значение этой карты. ${astrology.personalizedContext || ''}`;
}

/**
 * Format prediction as readable text
 */
function formatPredictionAsText(prediction) {
  let text = '';

  // Card description
  text += `🎴 ВАША КАРТА:\n${prediction.cardDescription}\n\n`;

  // Card meaning
  text += `🔮 ЗНАЧЕНИЕ КАРТЫ:\n${prediction.cardMeaning}\n\n`;

  // General forecast
  text += `📅 ПРОГНОЗ НА ДЕНЬ:\n${prediction.generalForecast}\n\n`;

  // Expectations
  text += `ЧТО ОЖИДАТЬ:\n`;
  prediction.expectations.forEach(exp => {
    text += `${exp}\n`;
  });
  text += '\n';

  // Advice
  text += `✅ РЕКОМЕНДУЕТСЯ:\n`;
  prediction.advice.doToday.forEach(adv => {
    text += `${adv}\n`;
  });
  text += '\n';

  text += `❌ НЕ РЕКОМЕНДУЕТСЯ:\n`;
  prediction.advice.avoidToday.forEach(adv => {
    text += `${adv}\n`;
  });
  text += '\n';

  // Life areas
  text += `💝 ЛЮБОВЬ: ${prediction.lifeAreas.love}\n`;
  text += `💼 КАРЬЕРА: ${prediction.lifeAreas.career}\n`;
  text += `💪 ЗДОРОВЬЕ: ${prediction.lifeAreas.health}\n`;
  text += `💰 ФИНАНСЫ: ${prediction.lifeAreas.finances}\n\n`;

  // Lucky elements
  text += `🍀 УДАЧНОЕ ВРЕМЯ: ${prediction.luckyTime}\n`;
  text += `🎨 ЦВЕТА ДНЯ: ${prediction.luckyColor}\n`;
  text += `🔢 ЧИСЛО ДНЯ: ${prediction.luckyNumber}\n`;

  // Astrology bonus
  if (prediction.astrologyBonus) {
    text += `\n${prediction.astrologyBonus}`;
  }

  // Mood influence
  if (prediction.moodInfluence) {
    text += `${prediction.moodInfluence}`;
  }

  return text;
}

module.exports = {
  generateDailyPrediction,
  formatPredictionAsText
};
