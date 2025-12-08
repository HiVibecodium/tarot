/**
 * Astrology Service
 * Calculate zodiac signs and natal chart basics
 */

// Zodiac sign dates with enriched data
const ZODIAC_SIGNS = [
  {
    sign: 'Овен',
    start: [3, 21],
    end: [4, 19],
    element: 'Огонь',
    planet: 'Марс',
    emoji: '♈',
    symbol: 'Баран',
    quality: 'Кардинальный',
    description: 'Первопроходец зодиака. Энергичный, смелый и решительный лидер.',
    traits: ['Смелость', 'Энергичность', 'Инициативность', 'Прямолинейность', 'Независимость'],
    weaknesses: ['Импульсивность', 'Нетерпеливость', 'Агрессивность', 'Эгоцентризм'],
    compatibility: { best: ['Лев', 'Стрелец', 'Водолей'], good: ['Близнецы', 'Весы'], challenging: ['Рак', 'Козерог'] },
    stones: ['Рубин', 'Красный яшма', 'Гранат', 'Карнелиан'],
    colors: ['Красный', 'Оранжевый', 'Алый'],
    luckyNumbers: [1, 9, 17, 19],
    bodyPart: 'Голова',
    famousPeople: ['Леонардо да Винчи', 'Леди Гага', 'Роберт Дауни мл.', 'Мэрайя Кэри']
  },
  {
    sign: 'Телец',
    start: [4, 20],
    end: [5, 20],
    element: 'Земля',
    planet: 'Венера',
    emoji: '♉',
    symbol: 'Бык',
    quality: 'Фиксированный',
    description: 'Стабильный и надёжный знак. Ценит комфорт, красоту и безопасность.',
    traits: ['Надёжность', 'Терпение', 'Практичность', 'Верность', 'Чувственность'],
    weaknesses: ['Упрямство', 'Собственничество', 'Лень', 'Материализм'],
    compatibility: { best: ['Дева', 'Козерог', 'Рак'], good: ['Рыбы', 'Скорпион'], challenging: ['Лев', 'Водолей'] },
    stones: ['Изумруд', 'Розовый кварц', 'Малахит', 'Сапфир'],
    colors: ['Зелёный', 'Розовый', 'Пастельные тона'],
    luckyNumbers: [2, 6, 15, 24],
    bodyPart: 'Шея и горло',
    famousPeople: ['Одри Хепбёрн', 'Дэвид Бекхэм', 'Адель', 'Марк Цукерберг']
  },
  {
    sign: 'Близнецы',
    start: [5, 21],
    end: [6, 20],
    element: 'Воздух',
    planet: 'Меркурий',
    emoji: '♊',
    symbol: 'Близнецы',
    quality: 'Мутабельный',
    description: 'Интеллектуал и коммуникатор. Любознательный, адаптивный и разносторонний.',
    traits: ['Общительность', 'Остроумие', 'Адаптивность', 'Любознательность', 'Универсальность'],
    weaknesses: ['Непостоянство', 'Поверхностность', 'Нервозность', 'Двуличность'],
    compatibility: { best: ['Весы', 'Водолей', 'Овен'], good: ['Лев', 'Стрелец'], challenging: ['Дева', 'Рыбы'] },
    stones: ['Агат', 'Цитрин', 'Тигровый глаз', 'Аквамарин'],
    colors: ['Жёлтый', 'Оранжевый', 'Серебряный'],
    luckyNumbers: [3, 5, 12, 23],
    bodyPart: 'Руки и лёгкие',
    famousPeople: ['Мэрилин Монро', 'Джонни Депп', 'Анджелина Джоли', 'Канье Уэст']
  },
  {
    sign: 'Рак',
    start: [6, 21],
    end: [7, 22],
    element: 'Вода',
    planet: 'Луна',
    emoji: '♋',
    symbol: 'Краб',
    quality: 'Кардинальный',
    description: 'Заботливый и интуитивный защитник. Глубоко эмоциональный и преданный.',
    traits: ['Заботливость', 'Интуиция', 'Преданность', 'Эмпатия', 'Защита близких'],
    weaknesses: ['Обидчивость', 'Замкнутость', 'Манипулятивность', 'Пессимизм'],
    compatibility: { best: ['Скорпион', 'Рыбы', 'Телец'], good: ['Дева', 'Козерог'], challenging: ['Овен', 'Весы'] },
    stones: ['Жемчуг', 'Лунный камень', 'Белый опал', 'Селенит'],
    colors: ['Белый', 'Серебряный', 'Бледно-голубой'],
    luckyNumbers: [2, 7, 11, 16],
    bodyPart: 'Грудь и желудок',
    famousPeople: ['Принцесса Диана', 'Том Хэнкс', 'Мерил Стрип', 'Илон Маск']
  },
  {
    sign: 'Лев',
    start: [7, 23],
    end: [8, 22],
    element: 'Огонь',
    planet: 'Солнце',
    emoji: '♌',
    symbol: 'Лев',
    quality: 'Фиксированный',
    description: 'Царственный и харизматичный. Щедрый, творческий и прирождённый лидер.',
    traits: ['Харизма', 'Щедрость', 'Творчество', 'Уверенность', 'Лидерство'],
    weaknesses: ['Гордыня', 'Высокомерие', 'Требовательность', 'Драматизм'],
    compatibility: { best: ['Овен', 'Стрелец', 'Близнецы'], good: ['Весы', 'Водолей'], challenging: ['Телец', 'Скорпион'] },
    stones: ['Янтарь', 'Рубин', 'Цитрин', 'Пирит'],
    colors: ['Золотой', 'Оранжевый', 'Пурпурный'],
    luckyNumbers: [1, 4, 10, 19],
    bodyPart: 'Сердце и спина',
    famousPeople: ['Барак Обама', 'Дженнифер Лопес', 'Мадонна', 'Арнольд Шварценеггер']
  },
  {
    sign: 'Дева',
    start: [8, 23],
    end: [9, 22],
    element: 'Земля',
    planet: 'Меркурий',
    emoji: '♍',
    symbol: 'Дева',
    quality: 'Мутабельный',
    description: 'Аналитик и перфекционист. Практичный, внимательный к деталям и преданный.',
    traits: ['Аналитичность', 'Практичность', 'Трудолюбие', 'Скромность', 'Внимание к деталям'],
    weaknesses: ['Критичность', 'Перфекционизм', 'Тревожность', 'Зацикленность'],
    compatibility: { best: ['Телец', 'Козерог', 'Рак'], good: ['Скорпион', 'Рыбы'], challenging: ['Близнецы', 'Стрелец'] },
    stones: ['Сапфир', 'Агат', 'Яшма', 'Нефрит'],
    colors: ['Зелёный', 'Коричневый', 'Бежевый'],
    luckyNumbers: [5, 14, 23, 32],
    bodyPart: 'Кишечник и пищеварение',
    famousPeople: ['Бейонсе', 'Майкл Джексон', 'Киану Ривз', 'Камерон Диаз']
  },
  {
    sign: 'Весы',
    start: [9, 23],
    end: [10, 22],
    element: 'Воздух',
    planet: 'Венера',
    emoji: '♎',
    symbol: 'Весы',
    quality: 'Кардинальный',
    description: 'Дипломат и эстет. Гармоничный, справедливый и ценитель красоты.',
    traits: ['Дипломатичность', 'Чувство красоты', 'Справедливость', 'Обаяние', 'Партнёрство'],
    weaknesses: ['Нерешительность', 'Угодливость', 'Поверхностность', 'Зависимость от мнения других'],
    compatibility: { best: ['Близнецы', 'Водолей', 'Лев'], good: ['Стрелец', 'Овен'], challenging: ['Рак', 'Козерог'] },
    stones: ['Опал', 'Розовый кварц', 'Лазурит', 'Аквамарин'],
    colors: ['Розовый', 'Голубой', 'Лавандовый'],
    luckyNumbers: [6, 15, 24, 33],
    bodyPart: 'Почки и поясница',
    famousPeople: ['Махатма Ганди', 'Ким Кардашьян', 'Уилл Смит', 'Кейт Уинслет']
  },
  {
    sign: 'Скорпион',
    start: [10, 23],
    end: [11, 21],
    element: 'Вода',
    planet: 'Плутон',
    emoji: '♏',
    symbol: 'Скорпион',
    quality: 'Фиксированный',
    description: 'Интенсивный и трансформационный. Страстный, проницательный и магнетический.',
    traits: ['Страстность', 'Проницательность', 'Решительность', 'Глубина', 'Магнетизм'],
    weaknesses: ['Ревность', 'Скрытность', 'Мстительность', 'Одержимость'],
    compatibility: { best: ['Рак', 'Рыбы', 'Дева'], good: ['Телец', 'Козерог'], challenging: ['Лев', 'Водолей'] },
    stones: ['Чёрный оникс', 'Гранат', 'Обсидиан', 'Топаз'],
    colors: ['Чёрный', 'Бордовый', 'Тёмно-красный'],
    luckyNumbers: [8, 11, 18, 22],
    bodyPart: 'Репродуктивные органы',
    famousPeople: ['Леонардо Ди Каприо', 'Скарлетт Йоханссон', 'Райан Гослинг', 'Джулия Робертс']
  },
  {
    sign: 'Стрелец',
    start: [11, 22],
    end: [12, 21],
    element: 'Огонь',
    planet: 'Юпитер',
    emoji: '♐',
    symbol: 'Кентавр',
    quality: 'Мутабельный',
    description: 'Философ и путешественник. Оптимистичный, свободолюбивый и мудрый.',
    traits: ['Оптимизм', 'Философичность', 'Свободолюбие', 'Честность', 'Авантюризм'],
    weaknesses: ['Бестактность', 'Безответственность', 'Высокомерие', 'Непоследовательность'],
    compatibility: { best: ['Овен', 'Лев', 'Весы'], good: ['Водолей', 'Близнецы'], challenging: ['Дева', 'Рыбы'] },
    stones: ['Бирюза', 'Топаз', 'Лазурит', 'Аметист'],
    colors: ['Синий', 'Фиолетовый', 'Пурпурный'],
    luckyNumbers: [3, 7, 12, 21],
    bodyPart: 'Бёдра и печень',
    famousPeople: ['Тейлор Свифт', 'Брэд Питт', 'Уинстон Черчилль', 'Бритни Спирс']
  },
  {
    sign: 'Козерог',
    start: [12, 22],
    end: [1, 19],
    element: 'Земля',
    planet: 'Сатурн',
    emoji: '♑',
    symbol: 'Козёл',
    quality: 'Кардинальный',
    description: 'Амбициозный и дисциплинированный. Ответственный, практичный и целеустремлённый.',
    traits: ['Амбициозность', 'Дисциплина', 'Ответственность', 'Терпение', 'Практичность'],
    weaknesses: ['Пессимизм', 'Холодность', 'Трудоголизм', 'Консерватизм'],
    compatibility: { best: ['Телец', 'Дева', 'Скорпион'], good: ['Рыбы', 'Рак'], challenging: ['Овен', 'Весы'] },
    stones: ['Гранат', 'Оникс', 'Чёрный турмалин', 'Гематит'],
    colors: ['Чёрный', 'Тёмно-коричневый', 'Серый'],
    luckyNumbers: [4, 8, 13, 22],
    bodyPart: 'Колени и кости',
    famousPeople: ['Мишель Обама', 'Мухаммед Али', 'Джим Керри', 'Кейт Миддлтон']
  },
  {
    sign: 'Водолей',
    start: [1, 20],
    end: [2, 18],
    element: 'Воздух',
    planet: 'Уран',
    emoji: '♒',
    symbol: 'Водонос',
    quality: 'Фиксированный',
    description: 'Визионер и гуманист. Независимый, оригинальный и прогрессивный мыслитель.',
    traits: ['Оригинальность', 'Независимость', 'Гуманизм', 'Интеллект', 'Прогрессивность'],
    weaknesses: ['Отстранённость', 'Упрямство', 'Эксцентричность', 'Эмоциональная холодность'],
    compatibility: { best: ['Близнецы', 'Весы', 'Овен'], good: ['Стрелец', 'Лев'], challenging: ['Телец', 'Скорпион'] },
    stones: ['Аметист', 'Аквамарин', 'Лабрадорит', 'Флюорит'],
    colors: ['Электрик синий', 'Бирюзовый', 'Серебряный'],
    luckyNumbers: [4, 7, 11, 22],
    bodyPart: 'Лодыжки и кровообращение',
    famousPeople: ['Опра Уинфри', 'Эд Ширан', 'Дженнифер Энистон', 'Криштиану Роналду']
  },
  {
    sign: 'Рыбы',
    start: [2, 19],
    end: [3, 20],
    element: 'Вода',
    planet: 'Нептун',
    emoji: '♓',
    symbol: 'Две рыбы',
    quality: 'Мутабельный',
    description: 'Мистик и художник. Интуитивный, сострадательный и творческий мечтатель.',
    traits: ['Интуиция', 'Сострадание', 'Творчество', 'Духовность', 'Эмпатия'],
    weaknesses: ['Эскапизм', 'Наивность', 'Жертвенность', 'Неопределённость'],
    compatibility: { best: ['Рак', 'Скорпион', 'Телец'], good: ['Козерог', 'Дева'], challenging: ['Близнецы', 'Стрелец'] },
    stones: ['Аметист', 'Аквамарин', 'Лунный камень', 'Флюорит'],
    colors: ['Морской волны', 'Фиолетовый', 'Лавандовый'],
    luckyNumbers: [3, 9, 12, 15],
    bodyPart: 'Ступни и лимфа',
    famousPeople: ['Альберт Эйнштейн', 'Рианна', 'Джастин Бибер', 'Стив Джобс']
  }
];

// Tarot - Zodiac correspondences (enriched)
const TAROT_ZODIAC_MAP = {
  'Овен': {
    majorArcana: 'Император',
    minorCards: ['Двойка Жезлов', 'Тройка Жезлов', 'Четвёрка Жезлов'],
    courtCard: 'Королева Жезлов',
    theme: 'Лидерство и инициатива'
  },
  'Телец': {
    majorArcana: 'Иерофант',
    minorCards: ['Пятёрка Пентаклей', 'Шестёрка Пентаклей', 'Семёрка Пентаклей'],
    courtCard: 'Король Пентаклей',
    theme: 'Стабильность и традиции'
  },
  'Близнецы': {
    majorArcana: 'Влюблённые',
    minorCards: ['Восьмёрка Мечей', 'Девятка Мечей', 'Десятка Мечей'],
    courtCard: 'Рыцарь Мечей',
    theme: 'Выбор и коммуникация'
  },
  'Рак': {
    majorArcana: 'Колесница',
    minorCards: ['Двойка Кубков', 'Тройка Кубков', 'Четвёрка Кубков'],
    courtCard: 'Королева Кубков',
    theme: 'Эмоциональная сила'
  },
  'Лев': {
    majorArcana: 'Сила',
    minorCards: ['Пятёрка Жезлов', 'Шестёрка Жезлов', 'Семёрка Жезлов'],
    courtCard: 'Король Жезлов',
    theme: 'Внутренняя сила и смелость'
  },
  'Дева': {
    majorArcana: 'Отшельник',
    minorCards: ['Восьмёрка Пентаклей', 'Девятка Пентаклей', 'Десятка Пентаклей'],
    courtCard: 'Рыцарь Пентаклей',
    theme: 'Мудрость и мастерство'
  },
  'Весы': {
    majorArcana: 'Справедливость',
    minorCards: ['Двойка Мечей', 'Тройка Мечей', 'Четвёрка Мечей'],
    courtCard: 'Королева Мечей',
    theme: 'Баланс и справедливость'
  },
  'Скорпион': {
    majorArcana: 'Смерть',
    minorCards: ['Пятёрка Кубков', 'Шестёрка Кубков', 'Семёрка Кубков'],
    courtCard: 'Король Кубков',
    theme: 'Трансформация и возрождение'
  },
  'Стрелец': {
    majorArcana: 'Умеренность',
    minorCards: ['Восьмёрка Жезлов', 'Девятка Жезлов', 'Десятка Жезлов'],
    courtCard: 'Рыцарь Жезлов',
    theme: 'Расширение и баланс'
  },
  'Козерог': {
    majorArcana: 'Дьявол',
    minorCards: ['Двойка Пентаклей', 'Тройка Пентаклей', 'Четвёрка Пентаклей'],
    courtCard: 'Королева Пентаклей',
    theme: 'Амбиции и ограничения'
  },
  'Водолей': {
    majorArcana: 'Звезда',
    minorCards: ['Пятёрка Мечей', 'Шестёрка Мечей', 'Семёрка Мечей'],
    courtCard: 'Король Мечей',
    theme: 'Надежда и инновации'
  },
  'Рыбы': {
    majorArcana: 'Луна',
    minorCards: ['Восьмёрка Кубков', 'Девятка Кубков', 'Десятка Кубков'],
    courtCard: 'Рыцарь Кубков',
    theme: 'Интуиция и мечты'
  }
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
function calculateMoonSign(birthDate, _birthTime) {
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
function calculateRisingSign(birthDate, birthTime, _latitude) {
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
  const tarotData = TAROT_ZODIAC_MAP[sign.sign];
  if (!tarotData) return { majorArcana: null, minorCards: [], courtCard: null, theme: '' };
  return tarotData;
}

/**
 * Get detailed zodiac sign info
 */
function getZodiacDetails(signName) {
  return ZODIAC_SIGNS.find(z => z.sign === signName);
}

/**
 * Calculate compatibility between two signs
 */
function calculateZodiacCompatibility(sign1Name, sign2Name) {
  const sign1 = ZODIAC_SIGNS.find(z => z.sign === sign1Name);
  const sign2 = ZODIAC_SIGNS.find(z => z.sign === sign2Name);

  if (!sign1 || !sign2) return null;

  let score = 50; // base score
  let level = 'Средняя';
  let description = '';

  // Check best compatibility
  if (sign1.compatibility.best.includes(sign2Name)) {
    score = 90;
    level = 'Превосходная';
    description = `${sign1Name} и ${sign2Name} - идеальное сочетание! Ваши стихии гармонируют, создавая мощный союз.`;
  } else if (sign1.compatibility.good.includes(sign2Name)) {
    score = 75;
    level = 'Хорошая';
    description = `${sign1Name} и ${sign2Name} дополняют друг друга. При взаимном уважении это отличный союз.`;
  } else if (sign1.compatibility.challenging.includes(sign2Name)) {
    score = 40;
    level = 'Сложная';
    description = `${sign1Name} и ${sign2Name} - непростое сочетание. Требуется работа над отношениями.`;
  } else {
    score = 60;
    level = 'Нейтральная';
    description = `${sign1Name} и ${sign2Name} могут создать крепкий союз при желании обеих сторон.`;
  }

  // Element bonus
  if (sign1.element === sign2.element) {
    score = Math.min(100, score + 10);
    description += ' Одна стихия усиливает взаимопонимание.';
  }

  return {
    sign1: sign1Name,
    sign2: sign2Name,
    score,
    level,
    description,
    element1: sign1.element,
    element2: sign2.element,
    strengths: getCompatibilityStrengths(sign1, sign2),
    challenges: getCompatibilityChallenges(sign1, sign2),
    advice: getCompatibilityAdvice(sign1, sign2, level)
  };
}

function getCompatibilityStrengths(sign1, sign2) {
  const strengths = [];

  if (sign1.element === sign2.element) {
    strengths.push('Общая стихия - глубокое понимание');
  }
  if (sign1.quality === sign2.quality) {
    strengths.push('Схожий темп жизни и приоритеты');
  }

  // Element-based strengths
  const elements = [sign1.element, sign2.element].sort().join('-');
  const elementStrengths = {
    'Воздух-Огонь': 'Огонь разжигается воздухом - взаимное вдохновение',
    'Вода-Земля': 'Вода питает землю - стабильность и эмоциональная глубина',
    'Воздух-Вода': 'Интеллект и эмоции создают баланс',
    'Земля-Огонь': 'Стабильность и страсть - мощное сочетание'
  };

  if (elementStrengths[elements]) {
    strengths.push(elementStrengths[elements]);
  }

  return strengths.length > 0 ? strengths : ['Потенциал для роста через различия'];
}

function getCompatibilityChallenges(sign1, sign2) {
  const challenges = [];

  const elements = [sign1.element, sign2.element].sort().join('-');
  const elementChallenges = {
    'Воздух-Земля': 'Разные темпы - воздух быстр, земля основательна',
    'Вода-Огонь': 'Эмоции могут гасить энтузиазм или наоборот'
  };

  if (elementChallenges[elements]) {
    challenges.push(elementChallenges[elements]);
  }

  if (sign1.quality !== sign2.quality) {
    challenges.push('Разные подходы к решению проблем');
  }

  return challenges.length > 0 ? challenges : ['Минимальные вызовы при взаимном уважении'];
}

function getCompatibilityAdvice(sign1, sign2, level) {
  const advice = {
    'Превосходная': 'Наслаждайтесь гармонией, но не забывайте о личностном росте каждого.',
    'Хорошая': 'Укрепляйте связь через общие интересы и открытое общение.',
    'Нейтральная': 'Ищите точки соприкосновения и уважайте различия.',
    'Сложная': 'Работайте над коммуникацией и ищите компромиссы. Различия могут стать источником роста.',
    'Средняя': 'Баланс между близостью и личным пространством - ключ к успеху.'
  };

  return advice[level] || advice['Средняя'];
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
  const { birthDate, birthTime, latitude } = birthInfo;

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
  getZodiacDetails,
  calculateZodiacCompatibility,
  ZODIAC_SIGNS,
  TAROT_ZODIAC_MAP
};
