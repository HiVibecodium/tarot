/**
 * Horoscope Service
 * Daily and weekly horoscope based on zodiac + tarot
 */

const { ZODIAC_SIGNS: _ZODIAC_SIGNS } = require('./astrology.service');

// Horoscope advice templates by element
const ELEMENT_ADVICE = {
  fire: {
    daily: {
      do: ['Проявите инициативу', 'Будьте активны', 'Действуйте смело', 'Начните новое'],
      dont: ['Не спешите с выводами', 'Избегайте конфликтов', 'Не будьте импульсивны', 'Не игнорируйте детали']
    },
    weekly: {
      focus: ['Карьера и амбиции', 'Творческие проекты', 'Физическая активность'],
      avoid: ['Переутомление', 'Конфликты с близкими', 'Импульсивные траты']
    }
  },
  earth: {
    daily: {
      do: ['Планируйте заранее', 'Будьте практичны', 'Фокус на финансах', 'Укрепляйте стабильность'],
      dont: ['Не будьте упрямы', 'Не зацикливайтесь на деталях', 'Избегайте рутины', 'Не отказывайтесь от нового']
    },
    weekly: {
      focus: ['Финансовое планирование', 'Здоровье и режим', 'Долгосрочные цели'],
      avoid: ['Застой и рутина', 'Излишняя жёсткость', 'Материализм']
    }
  },
  air: {
    daily: {
      do: ['Общайтесь активно', 'Учитесь новому', 'Делитесь идеями', 'Будьте открыты'],
      dont: ['Не распыляйтесь', 'Избегайте сплетен', 'Не витайте в облаках', 'Не игнорируйте чувства']
    },
    weekly: {
      focus: ['Обучение и развитие', 'Социальные связи', 'Интеллектуальные проекты'],
      avoid: ['Поверхностность', 'Излишняя болтливость', 'Непоследовательность']
    }
  },
  water: {
    daily: {
      do: ['Слушайте интуицию', 'Заботьтесь о близких', 'Выражайте чувства', 'Медитируйте'],
      dont: ['Не погружайтесь в эмоции', 'Избегайте драм', 'Не манипулируйте', 'Не изолируйтесь']
    },
    weekly: {
      focus: ['Эмоциональное здоровье', 'Отношения', 'Творчество'],
      avoid: ['Эмоциональные качели', 'Созависимость', 'Излишняя чувствительность']
    }
  }
};

/**
 * Generate daily horoscope based on zodiac sign
 */
function generateDailyHoroscope(zodiacSign, element, tarotCard) {
  const elementAdvice = ELEMENT_ADVICE[element] || ELEMENT_ADVICE.fire;

  const doAdvice = elementAdvice.daily.do[Math.floor(Math.random() * elementAdvice.daily.do.length)];
  const dontAdvice = elementAdvice.daily.dont[Math.floor(Math.random() * elementAdvice.daily.dont.length)];

  let horoscope = `📅 Гороскоп на сегодня для ${zodiacSign}:\n\n`;

  // General prediction
  horoscope += `Сегодня энергия ${getElementName(element)} особенно сильна. `;

  // Tarot influence
  if (tarotCard) {
    horoscope += `Карта дня "${tarotCard}" усиливает вашу природную силу. `;
  }

  horoscope += `\n\n✅ СТОИТ:\n• ${doAdvice}\n• Доверяйте интуиции\n• Будьте внимательны к знакам`;
  horoscope += `\n\n❌ НЕ СТОИТ:\n• ${dontAdvice}\n• Игнорировать предчувствия\n• Действовать против природы`;

  return horoscope;
}

/**
 * Generate weekly horoscope
 */
function generateWeeklyHoroscope(zodiacSign, element) {
  const elementAdvice = ELEMENT_ADVICE[element] || ELEMENT_ADVICE.fire;

  const focusArea = elementAdvice.weekly.focus[Math.floor(Math.random() * elementAdvice.weekly.focus.length)];
  const avoidArea = elementAdvice.weekly.avoid[Math.floor(Math.random() * elementAdvice.weekly.avoid.length)];

  let horoscope = `📅 Прогноз на неделю для ${zodiacSign}:\n\n`;

  horoscope += `Эта неделя благоприятна для знаков ${getElementName(element)}. `;
  horoscope += `Фокусируйтесь на: ${focusArea.toLowerCase()}. `;

  horoscope += `\n\n✨ ОСНОВНЫЕ РЕКОМЕНДАЦИИ:\n`;
  horoscope += `• Понедельник-Среда: Активная фаза, начинайте новое\n`;
  horoscope += `• Четверг-Пятница: Время для планирования и анализа\n`;
  horoscope += `• Выходные: Отдых и восстановление сил\n`;

  horoscope += `\n\n⚠️ ИЗБЕГАЙТЕ: ${avoidArea.toLowerCase()}\n`;
  horoscope += `💡 СОВЕТ НЕДЕЛИ: Слушайте своё сердце, но проверяйте разумом`;

  return horoscope;
}

/**
 * Get combined Tarot + Astrology reading
 */
function getCombinedReading(tarotInterpretation, zodiacSign, element, period = 'daily') {
  let combined = tarotInterpretation;

  combined += '\n\n' + '─'.repeat(40) + '\n\n';

  if (period === 'daily') {
    combined += generateDailyHoroscope(zodiacSign, element, null);
  } else if (period === 'weekly') {
    combined += generateWeeklyHoroscope(zodiacSign, element);
  }

  return combined;
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

module.exports = {
  generateDailyHoroscope,
  generateWeeklyHoroscope,
  getCombinedReading,
  ELEMENT_ADVICE
};
