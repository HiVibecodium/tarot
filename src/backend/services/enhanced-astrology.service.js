/**
 * Enhanced Astrology Service
 * Complete natal chart calculation with planets, houses, and aspects
 */

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

// Planetary data and interpretations
const PLANETS = {
  Sun: {
    symbol: '☉',
    name: 'Солнце',
    represents: 'Личность, эго, жизненная сила',
    tarotCorrespondence: 'Солнце, Сила'
  },
  Moon: {
    symbol: '☽',
    name: 'Луна',
    represents: 'Эмоции, подсознание, инстинкты',
    tarotCorrespondence: 'Луна, Верховная Жрица'
  },
  Mercury: {
    symbol: '☿',
    name: 'Меркурий',
    represents: 'Коммуникация, мышление, обучение',
    tarotCorrespondence: 'Маг'
  },
  Venus: {
    symbol: '♀',
    name: 'Венера',
    represents: 'Любовь, красота, ценности',
    tarotCorrespondence: 'Императрица, Влюблённые'
  },
  Mars: {
    symbol: '♂',
    name: 'Марс',
    represents: 'Действие, энергия, страсть',
    tarotCorrespondence: 'Башня, Император'
  },
  Jupiter: {
    symbol: '♃',
    name: 'Юпитер',
    represents: 'Расширение, удача, мудрость',
    tarotCorrespondence: 'Колесо Фортуны'
  },
  Saturn: {
    symbol: '♄',
    name: 'Сатурн',
    represents: 'Структура, ограничения, карма',
    tarotCorrespondence: 'Мир, Дьявол'
  },
  Uranus: {
    symbol: '♅',
    name: 'Уран',
    represents: 'Революция, инновации, свобода',
    tarotCorrespondence: 'Шут'
  },
  Neptune: {
    symbol: '♆',
    name: 'Нептун',
    represents: 'Иллюзии, духовность, интуиция',
    tarotCorrespondence: 'Повешенный'
  },
  Pluto: {
    symbol: '♇',
    name: 'Плутон',
    represents: 'Трансформация, власть, возрождение',
    tarotCorrespondence: 'Смерть, Суд'
  }
};

// Houses system (12 домов)
const HOUSES = [
  {
    number: 1,
    name: 'Дом Личности',
    represents: 'Внешность, первое впечатление, начинания',
    keywords: ['Я', 'Внешность', 'Начало']
  },
  {
    number: 2,
    name: 'Дом Ресурсов',
    represents: 'Деньги, ценности, имущество',
    keywords: ['Деньги', 'Ценности', 'Таланты']
  },
  {
    number: 3,
    name: 'Дом Коммуникации',
    represents: 'Общение, братья/сёстры, короткие поездки',
    keywords: ['Общение', 'Обучение', 'Соседи']
  },
  {
    number: 4,
    name: 'Дом Корней',
    represents: 'Дом, семья, родители, основа',
    keywords: ['Дом', 'Семья', 'Корни']
  },
  {
    number: 5,
    name: 'Дом Творчества',
    represents: 'Творчество, дети, романтика, хобби',
    keywords: ['Творчество', 'Дети', 'Радость']
  },
  {
    number: 6,
    name: 'Дом Здоровья',
    represents: 'Здоровье, работа, служение, рутина',
    keywords: ['Здоровье', 'Работа', 'Служение']
  },
  {
    number: 7,
    name: 'Дом Партнёрства',
    represents: 'Отношения, брак, партнёры',
    keywords: ['Брак', 'Партнёры', 'Договоры']
  },
  {
    number: 8,
    name: 'Дом Трансформации',
    represents: 'Смерть, возрождение, наследство, секс',
    keywords: ['Трансформация', 'Тайны', 'Наследство']
  },
  {
    number: 9,
    name: 'Дом Философии',
    represents: 'Высшее образование, путешествия, вера',
    keywords: ['Философия', 'Путешествия', 'Вера']
  },
  {
    number: 10,
    name: 'Дом Карьеры',
    represents: 'Карьера, статус, признание, цель',
    keywords: ['Карьера', 'Статус', 'Цель']
  },
  {
    number: 11,
    name: 'Дом Дружбы',
    represents: 'Друзья, группы, мечты, идеалы',
    keywords: ['Друзья', 'Сообщество', 'Надежды']
  },
  {
    number: 12,
    name: 'Дом Подсознания',
    represents: 'Подсознание, тайны, изоляция, карма',
    keywords: ['Подсознание', 'Тайны', 'Карма']
  }
];

// Aspects (аспекты между планетами)
const ASPECTS = {
  conjunction: { name: 'Соединение', angle: 0, orb: 8, nature: 'neutral', symbol: '☌' },
  sextile: { name: 'Секстиль', angle: 60, orb: 6, nature: 'harmonious', symbol: '⚹' },
  square: { name: 'Квадрат', angle: 90, orb: 8, nature: 'challenging', symbol: '□' },
  trine: { name: 'Трин', angle: 120, orb: 8, nature: 'harmonious', symbol: '△' },
  opposition: { name: 'Оппозиция', angle: 180, orb: 8, nature: 'challenging', symbol: '☍' }
};

/**
 * Calculate complete natal chart
 */
function calculateNatalChart(birthData) {
  const { birthDate, birthTime, birthCity, latitude, longitude, timezone } = birthData;

  // Calculate Sun Sign
  const sunSign = calculateSunSign(birthDate);

  // Calculate Moon Sign (if time provided)
  const moonSign = birthTime ? calculateMoonSign(birthDate, birthTime) : null;

  // Calculate Rising Sign / Ascendant (if time + location)
  const risingSign = (birthTime && latitude) ? calculateRisingSign(birthDate, birthTime, latitude) : null;

  // Calculate all planetary positions (simplified for MVP)
  const planetaryPositions = calculatePlanetaryPositions(birthDate);

  // Calculate houses (if rising sign available)
  const houses = risingSign ? calculateHouses(risingSign) : null;

  // Calculate major aspects
  const aspects = calculateAspects(planetaryPositions);

  // Generate personalized context for Tarot
  const tarotContext = generateTarotContext(sunSign, moonSign, risingSign);

  // Calculate element balance
  const elementBalance = calculateElementBalance(sunSign, moonSign, risingSign, planetaryPositions);

  // Get chart summary
  const chartSummary = generateChartSummary(sunSign, moonSign, risingSign, elementBalance);

  return {
    calculated: true,
    sunSign: {
      sign: sunSign.sign,
      element: sunSign.element,
      planet: sunSign.planet,
      tarotCards: TAROT_ZODIAC_MAP[sunSign.sign] || []
    },
    moonSign: moonSign ? {
      sign: moonSign.sign,
      element: moonSign.element,
      meaning: 'Эмоциональная природа'
    } : null,
    risingSign: risingSign ? {
      sign: risingSign.sign,
      element: risingSign.element,
      meaning: 'Внешний образ и маска'
    } : null,
    planets: planetaryPositions,
    houses: houses,
    aspects: aspects,
    personalizedContext: tarotContext,
    strengths: calculateStrengths(sunSign, moonSign, risingSign),
    challenges: calculateChallenges(sunSign, moonSign, risingSign),
    lifeLesson: getLifeLesson(sunSign),
    soulPurpose: getSoulPurpose(planetaryPositions),
    elementBalance: elementBalance,
    chartSummary: chartSummary
  };
}

/**
 * Calculate simplified planetary positions
 */
function calculatePlanetaryPositions(birthDate) {
  const date = new Date(birthDate);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  // Simplified positions (real calculation would use ephemeris)
  const positions = {};

  // Sun moves ~1 degree/day
  const sunPosition = dayOfYear % 360;
  positions.Sun = {
    ...PLANETS.Sun,
    degree: sunPosition,
    sign: getSignFromDegree(sunPosition),
    house: null // Calculated later with houses
  };

  // Moon moves ~13 degrees/day
  const moonPosition = (dayOfYear * 13) % 360;
  positions.Moon = {
    ...PLANETS.Moon,
    degree: moonPosition,
    sign: getSignFromDegree(moonPosition)
  };

  // Mercury stays close to Sun (simplified: ±28 degrees)
  const mercuryOffset = (dayOfYear % 56) - 28;
  positions.Mercury = {
    ...PLANETS.Mercury,
    degree: (sunPosition + mercuryOffset + 360) % 360,
    sign: getSignFromDegree((sunPosition + mercuryOffset + 360) % 360)
  };

  // Venus (simplified: ±47 degrees from Sun)
  const venusOffset = (dayOfYear % 94) - 47;
  positions.Venus = {
    ...PLANETS.Venus,
    degree: (sunPosition + venusOffset + 360) % 360,
    sign: getSignFromDegree((sunPosition + venusOffset + 360) % 360)
  };

  // Mars (simplified cycle)
  const marsPosition = (dayOfYear * 0.5) % 360;
  positions.Mars = {
    ...PLANETS.Mars,
    degree: marsPosition,
    sign: getSignFromDegree(marsPosition)
  };

  // Outer planets (slower moving - simplified)
  positions.Jupiter = {
    ...PLANETS.Jupiter,
    degree: (dayOfYear * 0.08) % 360,
    sign: getSignFromDegree((dayOfYear * 0.08) % 360)
  };

  positions.Saturn = {
    ...PLANETS.Saturn,
    degree: (dayOfYear * 0.03) % 360,
    sign: getSignFromDegree((dayOfYear * 0.03) % 360)
  };

  // Generational planets (very slow moving - simplified)
  positions.Uranus = {
    ...PLANETS.Uranus,
    degree: (dayOfYear * 0.012) % 360,
    sign: getSignFromDegree((dayOfYear * 0.012) % 360)
  };

  positions.Neptune = {
    ...PLANETS.Neptune,
    degree: (dayOfYear * 0.006) % 360,
    sign: getSignFromDegree((dayOfYear * 0.006) % 360)
  };

  positions.Pluto = {
    ...PLANETS.Pluto,
    degree: (dayOfYear * 0.004) % 360,
    sign: getSignFromDegree((dayOfYear * 0.004) % 360)
  };

  return positions;
}

/**
 * Get zodiac sign from degree (0-360)
 */
function getSignFromDegree(degree) {
  const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
                 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
  const signIndex = Math.floor(degree / 30);
  return signs[signIndex % 12];
}

/**
 * Calculate houses based on rising sign
 */
function calculateHouses(risingSign) {
  const houses = [];
  const risingIndex = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
                       'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
                      .indexOf(risingSign.sign);

  for (let i = 0; i < 12; i++) {
    const signIndex = (risingIndex + i) % 12;
    houses.push({
      number: i + 1,
      sign: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
             'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'][signIndex],
      ...HOUSES[i]
    });
  }

  return houses;
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(planetaryPositions) {
  const aspects = [];
  const planetKeys = Object.keys(planetaryPositions);

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const planet1 = planetKeys[i];
      const planet2 = planetKeys[j];

      const deg1 = planetaryPositions[planet1].degree;
      const deg2 = planetaryPositions[planet2].degree;

      let angleDiff = Math.abs(deg1 - deg2);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;

      // Check each aspect type
      Object.entries(ASPECTS).forEach(([key, aspect]) => {
        if (Math.abs(angleDiff - aspect.angle) <= aspect.orb) {
          aspects.push({
            planet1: planet1,
            planet2: planet2,
            type: aspect.name,
            symbol: aspect.symbol,
            nature: aspect.nature,
            angle: angleDiff,
            interpretation: getAspectInterpretation(planet1, planet2, aspect.name)
          });
        }
      });
    }
  }

  return aspects;
}

// Planet name translations
const PLANET_NAMES_RU = {
  'Sun': 'Солнце',
  'Moon': 'Луна',
  'Mercury': 'Меркурий',
  'Venus': 'Венера',
  'Mars': 'Марс',
  'Jupiter': 'Юпитер',
  'Saturn': 'Сатурн',
  'Uranus': 'Уран',
  'Neptune': 'Нептун',
  'Pluto': 'Плутон'
};

/**
 * Get aspect interpretation
 */
function getAspectInterpretation(planet1, planet2, aspectType) {
  // Translate planet names to Russian
  const p1 = PLANET_NAMES_RU[planet1] || planet1;
  const p2 = PLANET_NAMES_RU[planet2] || planet2;

  const interpretations = {
    'Sun-Moon': {
      'Соединение': `${p1} и ${p2} вместе: Ваше эго и эмоции работают как единое целое. То что вы хотите (Солнце) совпадает с тем что вам нужно (Луна). Это даёт внутреннюю целостность, ясность, аутентичность. Вы знаете кто вы и чего хотите. Но может быть сложно быть объективным к себе - сознательное и подсознательное слиты. Вы естественны, но иногда эмоционально предвзяты.`,
      'Оппозиция': `${p1} противостоит ${p2}: Внутренний конфликт между тем кем хотите быть и тем что чувствуете. Ваша воля тянет в одну сторону, эмоции - в другую. Это создаёт напряжение, но учит балансу. Вы видите обе стороны себя - рациональную и эмоциональную. Отношения - ваше зеркало для понимания себя. Учитесь интегрировать голову и сердце.`,
      'Трин': `${p1} гармонирует с ${p2}: Ваша воля и эмоции поддерживают друг друга естественно. То что хотите достичь гармонирует с тем что вам нужно. Это даёт эмоциональную стабильность, уверенность в себе, лёгкость в жизни. Вам легко быть собой, люди чувствуют вашу целостность. Однако следите чтобы лёгкость не превратилась в лень - развивайте свои таланты!`,
      'Квадрат': `${p1} и ${p2} в напряжении: Ваше эго и эмоции создают внутренний конфликт. То чего хотите достичь (Солнце) требует преодоления эмоциональных паттернов (Луна). Это создаёт стресс, но огромный потенциал роста. Вы вынуждены работать над собой, разрешать внутренние противоречия. Каждый кризис - возможность стать целостнее. Динамичная, насыщенная внутренняя жизнь.`
    },
    'Sun-Venus': {
      'Соединение': `${p1} усиливает ${p2}: Природная харизма и обаяние. Вы привлекательны и любите красоту.`,
      'Трин': `${p1} поддерживает ${p2}: Лёгкость в отношениях, художественный талант, гармоничное самовыражение.`,
      'Квадрат': `${p1} конфликтует с ${p2}: Сложности в самооценке, учитесь ценить себя.`
    },
    'Moon-Venus': {
      'Соединение': `${p1} объединяется с ${p2}: Эмоциональная чувствительность к красоте. Нуждаетесь в гармонии.`,
      'Трин': `${p1} гармонирует с ${p2}: Мягкость, нежность, умение создавать уют.`
    },
    'Sun-Mars': {
      'Соединение': `${p1} и ${p2} вместе: Огромная энергия и инициативность. Вы деятель и лидер.`,
      'Квадрат': `${p1} и ${p2} в конфликте: Импульсивность, учитесь терпению и контролю энергии.`,
      'Трин': `${p1} поддерживает ${p2}: Уверенное действие, смелость, здоровая агрессия.`
    },
    'Moon-Mars': {
      'Соединение': `${p1} с ${p2}: Эмоциональная импульсивность. Чувства быстро переходят в действия.`,
      'Квадрат': `${p1} и ${p2} в напряжении: Эмоциональная реактивность. Работайте над спокойствием.`
    },
    'Sun-Jupiter': {
      'Соединение': `${p1} усиливается ${p2}: Оптимизм, щедрость, удача. Вы видите возможности.`,
      'Оппозиция': `${p1} против ${p2}: Избыток оптимизма, риск переоценить силы.`,
      'Трин': `${p1} в гармонии с ${p2}: Естественная удача, рост, мудрость.`
    },
    'Sun-Saturn': {
      'Соединение': `${p1} и ${p2}: Дисциплина, ответственность, серьёзность. Вы строите прочное.`,
      'Квадрат': `${p1} ограничен ${p2}: Неуверенность, преодолевайте самоограничения.`,
      'Трин': `${p1} поддержан ${p2}: Структурированность, мастерство, терпение.`
    },
    'Mars-Jupiter': {
      'Соединение': `${p1} и ${p2} объединены: Огромная энергия действия с верой в успех! Вы смелы, оптимистичны, берётесь за большие проекты. Риск - переоценить силы и действовать импульсивно. Но когда фокусируетесь, способны на великие свершения. Естественный предприниматель и лидер.`,
      'Квадрат': `${p1} конфликтует с ${p2}: Ваши действия опережают возможности. Хотите слишком много слишком быстро. Импульсивность + избыточный оптимизм = рискованные решения. Урок - баланс между смелостью и мудростью. Действуйте, но планируйте. Сдерживайте импульсы, но не убивайте энтузиазм.`,
      'Оппозиция': `${p1} против ${p2}: Борьба между действием и экспансией. То хотите действовать осторожно, то бросаетесь в авантюры. Учитесь балансу - смелость с умом, действие с планированием.`,
      'Трин': `${p1} в гармонии с ${p2}: Удача любит смелых! Ваши действия естественно приводят к успеху и росту. Энергия направлена на расширение, вера поддерживает смелость. Отличный аспект для спорта, бизнеса, приключений.`
    },
    'Mars-Saturn': {
      'Соединение': `${p1} соединён с ${p2}: Дисциплинированная энергия. Вы умеете контролировать импульсы и действовать методично. Терпеливость в достижении целей. Может быть подавление гнева - важно находить здоровые выходы для энергии. Строитель-воин.`,
      'Квадрат': `${p1} ограничен ${p2}: Ваша энергия сталкивается с внутренними тормозами. Хотите действовать, но страх или обстоятельства останавливают. Фрустрация и гнев от невозможности двигаться. Урок - преодолеть страх действия. Тренируйте дисциплину, но не подавляйте энергию. Терпеливое, целенаправленное усилие - ваш путь к мастерству.`,
      'Оппозиция': `${p1} противостоит ${p2}: Конфликт между импульсом и контролем. То слишком агрессивны, то парализованы страхом. Учитесь балансу - действовать ответственно, контролировать без подавления.`,
      'Трин': `${p1} поддержан ${p2}: Контролируемая сила! Вы умеете действовать дисциплинированно и терпеливо. Энергия направлена на долгосрочные цели. Выносливость, мастерство, достижение через упорство.`
    },
    'Mars-Mercury': {
      'Соединение': `${p1} с ${p2}: Быстрый ум и резкие слова! Вы думаете и действуете одновременно. Острый язык, ментальная энергия. Отлично для дебатов, но следите чтобы не ранить словами.`,
      'Квадрат': `${p1} конфликтует с ${p2}: Слова опережают мысли, действия опережают планы. Импульсивность в речи, спорность. Учитесь думать перед тем как говорить и действовать.`
    },
    'Jupiter-Saturn': {
      'Соединение': `${p1} и ${p2}: Мудрая экспансия. Вы умеете расти ответственно. Баланс между оптимизмом и реализмом. Строите большое, но прочное.`,
      'Квадрат': `${p1} ограничен ${p2}: Конфликт между ростом и ограничениями. Хотите больше, но обстоятельства тормозят. Учитесь терпению - медленный рост прочнее.`,
      'Оппозиция': `${p1} против ${p2}: Борьба между верой и страхом, расширением и сжатием. Учитесь балансу оптимизма и реализма.`
    },
    'Saturn-Uranus': {
      'Соединение': `${p1} и ${p2} объединены: Революция через структуру! Вы соединяете традицию и инновацию, дисциплину и свободу. Способны создавать новое, но прочное. Реформатор с планом.`
    },
    'Saturn-Neptune': {
      'Соединение': `${p1} и ${p2} объединены: Структура мечты. Вы умеете воплощать идеалы в реальность. Дисциплина служит духовности. Практическая мистика - строите мечты терпеливо.`
    },
    'Saturn-Pluto': {
      'Соединение': `${p1} и ${p2} объединены: Несгибаемая сила воли. Дисциплина + трансформация = мастерство через кризисы. Вы выдерживаете невероятное давление и выходите сильнее. Феникс с планом.`
    },
    'Uranus-Neptune': {
      'Соединение': `${p1} и ${p2} объединены: Визионер эпохи. Свобода сливается с мечтой - вы видите будущее и революционизируете духовность. Новый мир начинается с воображения.`
    },
    'Uranus-Pluto': {
      'Соединение': `${p1} и ${p2} объединены: Радикальная трансформация! Революция + власть = полный слом старого и создание нового. Вы агент глобальных изменений. Разрушитель-созидатель.`
    },
    'Neptune-Pluto': {
      'Соединение': `${p1} и ${p2} объединены: Духовная трансформация поколения. Мечты сливаются с силой возрождения. Вы часть глобального духовного сдвига человечества. Мистическая сила.`
    },
    'Moon-Uranus': {
      'Соединение': `${p1} и ${p2}: Эмоциональная независимость! Ваши чувства непредсказуемы и свободны. Нуждаетесь в пространстве, не выносите рутины в эмоциях. Интуитивные прозрения, внезапные эмоциональные сдвиги. Уникальная эмоциональная природа.`,
      'Трин': `${p1} и ${p2}: Свободные эмоции в гармонии. Вы легко адаптируетесь к переменам, интуиция острая, чувства свежи. Оригинальный эмоциональный стиль. Комфортно с необычным.`
    },
    'Moon-Neptune': {
      'Соединение': `${p1} и ${p2}: Мистические эмоции. Ваши чувства сливаются с коллективным - вы губка для настроений других. Невероятная эмпатия, интуиция, воображение. Но границы размыты - важно защищать свою энергию.`,
      'Трин': `${p1} и ${p2}: Интуитивное сердце. Чувства текут как вода, эмпатия естественна, воображение богато. Отличный аспект для искусства, целительства, духовности. Вы чувствуете незримое.`
    },
    'Moon-Pluto': {
      'Соединение': `${p1} и ${p2}: Интенсивные эмоции! Вы чувствуете на глубине океана - всё или ничего. Эмоциональная сила невероятна, но может подавлять. Нужда контролировать + страх потери = эмоциональные кризисы. Но через них вы трансформируетесь. Феникс эмоций.`,
      'Трин': `${p1} и ${p2}: Эмоциональная глубина и сила. Вы легко проникаете в суть чувств - своих и чужих. Целительская сила, способность трансформировать эмоции. Психолог по натуре.`
    }
  };

  const key = `${planet1}-${planet2}`;
  const interpretation = interpretations[key]?.[aspectType];

  if (interpretation) {
    return interpretation;
  }

  // Default interpretation with planet meanings
  const planetMeanings = {
    'Солнце': 'эго и жизненная сила',
    'Луна': 'эмоции и потребности',
    'Меркурий': 'ум и коммуникация',
    'Венера': 'любовь и ценности',
    'Марс': 'действия и энергия',
    'Юпитер': 'рост и возможности',
    'Сатурн': 'дисциплина и уроки',
    'Уран': 'свобода и инновации',
    'Нептун': 'мечты и интуиция',
    'Плутон': 'трансформация и власть'
  };

  const m1 = planetMeanings[p1] || p1;
  const m2 = planetMeanings[p2] || p2;

  if (aspectType === 'Квадрат') {
    return `${p1} и ${p2} создают динамическое напряжение. Ваши ${m1} конфликтуют с ${m2}. Это вызов для роста - через работу над интеграцией этих энергий вы развиваете силу характера и мудрость. Напряжение мотивирует действовать.`;
  } else if (aspectType === 'Оппозиция') {
    return `${p1} и ${p2} находятся в оппозиции. Ваши ${m1} противостоят ${m2}. Это создаёт внутренний конфликт, но учит балансу и объективности. Вы видите обе стороны и можете стать мастером интеграции противоположностей.`;
  } else if (aspectType === 'Трин' || aspectType === 'Секстиль') {
    return `${p1} и ${p2} работают гармонично. Ваши ${m1} поддерживают ${m2} естественно. Это ваш врождённый талант - энергии текут легко. Используйте этот дар сознательно, развивайте его.`;
  } else if (aspectType === 'Соединение') {
    return `${p1} и ${p2} объединены. Ваши ${m1} и ${m2} слиты воедино, усиливая друг друга. Эта концентрированная энергия мощна - направляйте её осознанно, используя лучшее от обеих планет.`;
  }

  return `${p1} ${aspectType} ${p2} - аспект влияет на взаимодействие этих планет в вашей карте.`;
}

/**
 * Generate Tarot context based on natal chart
 */
function generateTarotContext(sunSign, moonSign, risingSign) {
  let context = `Ваше Солнце в ${sunSign.sign} `;

  // Add element influence (Russian keys)
  const elements = {
    'Огонь': 'придаёт энергию и импульсивность вашим решениям',
    'Земля': 'делает вас практичным и основательным',
    'Воздух': 'даёт аналитический подход к ситуациям',
    'Вода': 'усиливает интуицию и эмоциональность'
  };

  context += (elements[sunSign.element] || '') + '. ';

  if (moonSign) {
    context += `Луна в ${moonSign.sign} показывает вашу эмоциональную реакцию на события. `;
  }

  if (risingSign) {
    context += `Восходящий ${risingSign.sign} влияет на то, как другие видят ваши решения.`;
  }

  return context;
}

/**
 * Calculate strengths based on chart
 */
function calculateStrengths(sunSign, moonSign, risingSign) {
  const strengths = [];

  // Element strengths
  const elementStrengths = {
    fire: ['Лидерство', 'Энтузиазм', 'Храбрость', 'Инициатива'],
    earth: ['Практичность', 'Надёжность', 'Терпение', 'Стабильность'],
    air: ['Коммуникация', 'Интеллект', 'Гибкость', 'Социальность'],
    water: ['Интуиция', 'Эмпатия', 'Творчество', 'Чувствительность']
  };

  strengths.push(...(elementStrengths[sunSign.element] || []).slice(0, 2));

  if (moonSign) {
    strengths.push(...(elementStrengths[moonSign.element] || []).slice(0, 1));
  }

  return [...new Set(strengths)]; // Remove duplicates
}

/**
 * Calculate challenges
 */
function calculateChallenges(sunSign, moonSign, risingSign) {
  const challenges = [];

  const elementChallenges = {
    fire: ['Импульсивность', 'Нетерпеливость'],
    earth: ['Упрямство', 'Материализм'],
    air: ['Поверхностность', 'Непостоянство'],
    water: ['Излишняя эмоциональность', 'Уязвимость']
  };

  challenges.push(...(elementChallenges[sunSign.element] || []).slice(0, 1));

  if (moonSign && moonSign.element !== sunSign.element) {
    challenges.push(...(elementChallenges[moonSign.element] || []).slice(0, 1));
  }

  return [...new Set(challenges)];
}

/**
 * Get life lesson for sun sign
 */
function getLifeLesson(sunSign) {
  const lessons = {
    'Овен': 'Научиться терпению и учитывать других',
    'Телец': 'Принимать перемены и быть гибким',
    'Близнецы': 'Фокусироваться и доводить до конца',
    'Рак': 'Выходить из зоны комфорта',
    'Лев': 'Слушать других и быть скромнее',
    'Дева': 'Принимать несовершенство',
    'Весы': 'Принимать решения и действовать',
    'Скорпион': 'Прощать и отпускать контроль',
    'Стрелец': 'Обращать внимание на детали',
    'Козерог': 'Расслабляться и наслаждаться',
    'Водолей': 'Эмоционально вовлекаться',
    'Рыбы': 'Устанавливать границы и быть практичным'
  };

  return lessons[sunSign.sign] || 'Познать себя и свой путь';
}

/**
 * Get soul purpose (based on North Node position - simplified)
 */
function getSoulPurpose(planetaryPositions) {
  // Simplified: Based on Sun sign for MVP
  const sunSign = planetaryPositions.Sun?.sign;

  const purposes = {
    'Овен': 'Быть первопроходцем и вдохновлять других на действие',
    'Телец': 'Создавать красоту и стабильность в мире',
    'Близнецы': 'Соединять людей через общение и знания',
    'Рак': 'Заботиться и создавать эмоциональную безопасность',
    'Лев': 'Творить и вдохновлять через самовыражение',
    'Дева': 'Служить и улучшать мир через детали',
    'Весы': 'Создавать гармонию и справедливость',
    'Скорпион': 'Трансформировать себя и других',
    'Стрелец': 'Искать истину и делиться мудростью',
    'Козерог': 'Строить долговечные структуры и достигать',
    'Водолей': 'Революционизировать и освобождать',
    'Рыбы': 'Исцелять и соединять с духовным'
  };

  return purposes[sunSign] || 'Следовать своему уникальному пути';
}

/**
 * Get detailed sign interpretation
 */
function getSignInterpretation(sign) {
  const interpretations = {
    'Овен': {
      short: 'Энергичный первопроходец',
      full: 'Овен - первый знак зодиака, символ новых начинаний и первопроходства. Вы обладаете природной смелостью и энтузиазмом. Ваша энергия Огня делает вас лидером и инициатором. В раскладах Таро обращайте внимание на карты действия - они особенно важны для вас.',
      keywords: ['Действие', 'Лидерство', 'Энергия', 'Инициатива', 'Смелость'],
      positives: ['Смелый', 'Энергичный', 'Прямой', 'Оптимистичный'],
      negatives: ['Импульсивный', 'Нетерпеливый', 'Эгоистичный'],
      compatibility: ['Лев', 'Стрелец', 'Близнецы', 'Водолей']
    },
    'Телец': {
      short: 'Надёжный строитель',
      full: 'Телец - знак стабильности и материального мира. Вы ценитe красоту, комфорт и надёжность. Элемент Земли делает вас практичным и основательным. В Таро карты Пентаклей имеют для вас особое значение - они отражают вашу земную природу.',
      keywords: ['Стабильность', 'Терпение', 'Красота', 'Материальность', 'Надёжность'],
      positives: ['Надёжный', 'Терпеливый', 'Практичный', 'Чувственный'],
      negatives: ['Упрямый', 'Материалистичный', 'Консервативный'],
      compatibility: ['Дева', 'Козерог', 'Рак', 'Рыбы']
    },
    'Близнецы': {
      short: 'Любознательный коммуникатор',
      full: 'Близнецы - знак общения и любознательности. Вы обладаете острым умом и способностью видеть обе стороны любой ситуации. Элемент Воздуха дарит вам ментальную гибкость. В Таро Мечи резонируют с вашей интеллектуальной природой.',
      keywords: ['Общение', 'Гибкость', 'Любознательность', 'Интеллект', 'Адаптация'],
      positives: ['Умный', 'Общительный', 'Гибкий', 'Остроумный'],
      negatives: ['Поверхностный', 'Непостоянный', 'Нервный'],
      compatibility: ['Весы', 'Водолей', 'Овен', 'Лев']
    },
    'Рак': {
      short: 'Заботливый защитник',
      full: 'Рак - знак эмоций и заботы. Вы глубоко чувствуете и интуитивно понимаете других. Элемент Воды дарит вам эмоциональную глубину и психическую чувствительность. Кубки в Таро отражают вашу эмоциональную природу.',
      keywords: ['Забота', 'Интуиция', 'Защита', 'Дом', 'Эмоции'],
      positives: ['Заботливый', 'Интуитивный', 'Верный', 'Защищающий'],
      negatives: ['Обидчивый', 'Замкнутый', 'Излишне эмоциональный'],
      compatibility: ['Скорпион', 'Рыбы', 'Телец', 'Дева']
    },
    'Лев': {
      short: 'Харизматичный лидер',
      full: 'Лев - знак творчества и самовыражения. Вы излучаете уверенность и харизму. Управляемый Солнцем, вы созданы сиять и вдохновлять других. Жезлы в Таро отражают вашу огненную творческую энергию.',
      keywords: ['Творчество', 'Харизма', 'Щедрость', 'Драма', 'Лидерство'],
      positives: ['Щедрый', 'Творческий', 'Харизматичный', 'Верный'],
      negatives: ['Эгоистичный', 'Высокомерный', 'Властный'],
      compatibility: ['Овен', 'Стрелец', 'Близнецы', 'Весы']
    },
    'Дева': {
      short: 'Перфекционист-аналитик',
      full: 'Дева - знак служения и совершенства. Вы видите детали, которые другие упускают. Элемент Земли делает вас практичным помощником. В Таро Пентакли отражают вашу склонность к порядку и мастерству.',
      keywords: ['Анализ', 'Служение', 'Детали', 'Здоровье', 'Организация'],
      positives: ['Аналитичный', 'Надёжный', 'Практичный', 'Скромный'],
      negatives: ['Критичный', 'Перфекционист', 'Тревожный'],
      compatibility: ['Телец', 'Козерог', 'Рак', 'Скорпион']
    },
    'Весы': {
      short: 'Гармоничный дипломат',
      full: 'Весы - знак баланса и отношений. Вы стремитесь к гармонии и справедливости. Управляемые Венерой, вы цените красоту и партнёрство. Мечи в Таро помогают вам взвешивать варианты.',
      keywords: ['Баланс', 'Гармония', 'Партнёрство', 'Справедливость', 'Красота'],
      positives: ['Дипломатичный', 'Справедливый', 'Общительный', 'Эстетичный'],
      negatives: ['Нерешительный', 'Зависимый', 'Поверхностный'],
      compatibility: ['Близнецы', 'Водолей', 'Лев', 'Стрелец']
    },
    'Скорпион': {
      short: 'Глубокий трансформатор',
      full: 'Скорпион - знак трансформации и глубины. Вы видите под поверхность и не боитесь темноты. Элемент Воды с силой Плутона даёт вам способность возрождаться. Кубки и карта Смерти в Таро резонируют с вашей глубиной.',
      keywords: ['Трансформация', 'Глубина', 'Страсть', 'Тайна', 'Власть'],
      positives: ['Глубокий', 'Страстный', 'Верный', 'Проницательный'],
      negatives: ['Ревнивый', 'Мстительный', 'Скрытный'],
      compatibility: ['Рак', 'Рыбы', 'Дева', 'Козерог']
    },
    'Стрелец': {
      short: 'Философ-искатель',
      full: 'Стрелец - знак мудрости и приключений. Вы ищете истину и смысл во всём. Управляемый Юпитером, вы расширяете горизонты. Жезлы в Таро отражают ваш огненный поиск и стремление к росту.',
      keywords: ['Философия', 'Путешествия', 'Оптимизм', 'Свобода', 'Истина'],
      positives: ['Оптимистичный', 'Философский', 'Честный', 'Свободолюбивый'],
      negatives: ['Нетактичный', 'Безответственный', 'Слишком прямой'],
      compatibility: ['Овен', 'Лев', 'Весы', 'Водолей']
    },
    'Козерог': {
      short: 'Амбициозный строитель',
      full: 'Козерог - знак структуры и достижений. Вы строите прочный фундамент и достигаете вершин. Управляемый Сатурном, вы понимаете ценность дисциплины. Пентакли в Таро отражают ваше мастерство построения.',
      keywords: ['Амбиции', 'Дисциплина', 'Структура', 'Достижения', 'Ответственность'],
      positives: ['Дисциплинированный', 'Ответственный', 'Амбициозный', 'Практичный'],
      negatives: ['Пессимистичный', 'Холодный', 'Трудоголик'],
      compatibility: ['Телец', 'Дева', 'Скорпион', 'Рыбы']
    },
    'Водолей': {
      short: 'Визионер-инноватор',
      full: 'Водолей - знак инноваций и гуманизма. Вы видите будущее и несёте перемены. Управляемый Ураном, вы уникальны и оригинальны. Мечи и Звезда в Таро отражают вашу ясность видения.',
      keywords: ['Инновации', 'Свобода', 'Гуманизм', 'Оригинальность', 'Будущее'],
      positives: ['Оригинальный', 'Гуманный', 'Прогрессивный', 'Независимый'],
      negatives: ['Отстранённый', 'Упрямый', 'Непредсказуемый'],
      compatibility: ['Близнецы', 'Весы', 'Овен', 'Стрелец']
    },
    'Рыбы': {
      short: 'Мистик-целитель',
      full: 'Рыбы - знак духовности и сострадания. Вы чувствуете связь со всем сущим. Управляемые Нептуном, вы обладаете глубокой интуицией. Кубки и Луна в Таро резонируют с вашей мистической природой.',
      keywords: ['Интуиция', 'Сострадание', 'Мистика', 'Творчество', 'Чувствительность'],
      positives: ['Сострадательный', 'Интуитивный', 'Творческий', 'Духовный'],
      negatives: ['Убегающий от реальности', 'Излишне чувствительный', 'Жертва'],
      compatibility: ['Рак', 'Скорпион', 'Телец', 'Козерог']
    }
  };

  return interpretations[sign] || {
    short: sign,
    full: `Знак ${sign}`,
    keywords: [],
    positives: [],
    negatives: [],
    compatibility: []
  };
}

// Helper functions for sun/moon/rising from original service
function calculateSunSign(birthDate) {
  // (Keep original implementation)
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

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

  for (const zodiac of ZODIAC_SIGNS) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;

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

  return ZODIAC_SIGNS[0];
}

function calculateMoonSign(birthDate, birthTime) {
  // Simplified moon calculation
  const date = new Date(birthDate);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const signIndex = Math.floor((dayOfYear % 336) / 28) % 12;

  const ZODIAC_SIGNS = [
    { sign: 'Овен', element: 'Огонь', planet: 'Марс' },
    { sign: 'Телец', element: 'Земля', planet: 'Венера' },
    { sign: 'Близнецы', element: 'Воздух', planet: 'Меркурий' },
    { sign: 'Рак', element: 'Вода', planet: 'Луна' },
    { sign: 'Лев', element: 'Огонь', planet: 'Солнце' },
    { sign: 'Дева', element: 'Земля', planet: 'Меркурий' },
    { sign: 'Весы', element: 'Воздух', planet: 'Венера' },
    { sign: 'Скорпион', element: 'Вода', planet: 'Плутон' },
    { sign: 'Стрелец', element: 'Огонь', planet: 'Юпитер' },
    { sign: 'Козерог', element: 'Земля', planet: 'Сатурн' },
    { sign: 'Водолей', element: 'Воздух', planet: 'Уран' },
    { sign: 'Рыбы', element: 'Вода', planet: 'Нептун' }
  ];

  return ZODIAC_SIGNS[signIndex];
}

function calculateRisingSign(birthDate, birthTime, latitude) {
  if (!birthTime) return null;

  const [hours] = birthTime.split(':').map(Number);
  const signIndex = Math.floor(hours / 2) % 12;

  const ZODIAC_SIGNS = [
    { sign: 'Овен', element: 'Огонь', planet: 'Марс' },
    { sign: 'Телец', element: 'Земля', planet: 'Венера' },
    { sign: 'Близнецы', element: 'Воздух', planet: 'Меркурий' },
    { sign: 'Рак', element: 'Вода', planet: 'Луна' },
    { sign: 'Лев', element: 'Огонь', planet: 'Солнце' },
    { sign: 'Дева', element: 'Земля', planet: 'Меркурий' },
    { sign: 'Весы', element: 'Воздух', planet: 'Венера' },
    { sign: 'Скорпион', element: 'Вода', planet: 'Плутон' },
    { sign: 'Стрелец', element: 'Огонь', planet: 'Юпитер' },
    { sign: 'Козерог', element: 'Земля', planet: 'Сатурн' },
    { sign: 'Водолей', element: 'Воздух', planet: 'Уран' },
    { sign: 'Рыбы', element: 'Вода', planet: 'Нептун' }
  ];

  return ZODIAC_SIGNS[signIndex];
}

/**
 * Calculate element balance in chart
 */
function calculateElementBalance(sunSign, moonSign, risingSign, planets) {
  const elementCount = {
    'Огонь': 0,
    'Земля': 0,
    'Воздух': 0,
    'Вода': 0
  };

  // Count sun (weight: 3)
  if (sunSign) elementCount[sunSign.element] += 3;

  // Count moon (weight: 2)
  if (moonSign) elementCount[moonSign.element] += 2;

  // Count rising (weight: 2)
  if (risingSign) elementCount[risingSign.element] += 2;

  // Count planets (weight: 1 each)
  if (planets) {
    Object.values(planets).forEach(planet => {
      const sign = planet.sign;
      const zodiacData = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
                          'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
      const elements = ['Огонь', 'Земля', 'Воздух', 'Вода', 'Огонь', 'Земля',
                        'Воздух', 'Вода', 'Огонь', 'Земля', 'Воздух', 'Вода'];
      const signIndex = zodiacData.indexOf(sign);
      if (signIndex >= 0) {
        elementCount[elements[signIndex]] += 1;
      }
    });
  }

  const total = Object.values(elementCount).reduce((a, b) => a + b, 0);

  // Element meanings in Russian
  const elementMeanings = {
    'Огонь': 'Энергия, действие, страсть, лидерство',
    'Земля': 'Практичность, стабильность, материальность',
    'Воздух': 'Интеллект, общение, идеи, свобода',
    'Вода': 'Эмоции, интуиция, чувствительность, глубина'
  };

  const result = {
    'Огонь': {
      count: elementCount['Огонь'],
      percentage: total > 0 ? Math.round((elementCount['Огонь'] / total) * 100) : 0,
      meaning: elementMeanings['Огонь']
    },
    'Земля': {
      count: elementCount['Земля'],
      percentage: total > 0 ? Math.round((elementCount['Земля'] / total) * 100) : 0,
      meaning: elementMeanings['Земля']
    },
    'Воздух': {
      count: elementCount['Воздух'],
      percentage: total > 0 ? Math.round((elementCount['Воздух'] / total) * 100) : 0,
      meaning: elementMeanings['Воздух']
    },
    'Вода': {
      count: elementCount['Вода'],
      percentage: total > 0 ? Math.round((elementCount['Вода'] / total) * 100) : 0,
      meaning: elementMeanings['Вода']
    },
    dominant: Object.keys(elementCount).reduce((a, b) => elementCount[a] > elementCount[b] ? a : b),
    lacking: Object.keys(elementCount).reduce((a, b) => elementCount[a] < elementCount[b] ? a : b)
  };

  return result;
}

/**
 * Generate chart summary
 */
function generateChartSummary(sunSign, moonSign, risingSign, elementBalance) {
  const elementDescriptions = {
    'Огонь': 'Огонь: Вы полны энергии и энтузиазма. Действуйте смело!',
    'Земля': 'Земля: Вы практичны и надёжны. Строите прочный фундамент.',
    'Воздух': 'Воздух: Вы интеллектуальны и общительны. Ваша сила - в словах.',
    'Вода': 'Вода: Вы чувствительны и интуитивны. Доверяйте эмоциям.'
  };

  const dominant = elementBalance.dominant;
  const lacking = elementBalance.lacking;

  const lackingAdvice = {
    'Огонь': 'Добавьте больше действий и спонтанности в жизнь. Занимайтесь спортом, будьте смелее, рискуйте иногда.',
    'Земля': 'Развивайте практичность и заземлённость. Создайте рутину, работайте с телом, управляйте финансами.',
    'Воздух': 'Больше общайтесь и анализируйте. Читайте, учитесь, развивайте логическое мышление.',
    'Вода': 'Развивайте интуицию и эмоциональный интеллект. Медитируйте, слушайте чувства, будьте у воды.'
  };

  const elementNames = {
    'Огонь': 'Огня',
    'Земля': 'Земли',
    'Воздух': 'Воздуха',
    'Вода': 'Воды'
  };

  return {
    dominantElement: dominant,
    dominantDescription: elementDescriptions[dominant],
    lackingElement: lacking,
    lackingAdvice: lackingAdvice[lacking],
    overview: `Ваша карта показывает сильный акцент на элементе ${elementNames[dominant] || dominant}. ${elementDescriptions[dominant] || ''}`
  };
}

module.exports = {
  calculateNatalChart,
  calculatePlanetaryPositions,
  calculateAspects,
  getSignInterpretation,
  PLANETS,
  HOUSES,
  ASPECTS
};
