/**
 * Horoscope Service
 * Daily and weekly horoscope based on zodiac + tarot
 */

// Note: astrology.service exports are available if needed for extended functionality
// const { ZODIAC_SIGNS, getZodiacDetails, TAROT_ZODIAC_MAP } = require('./astrology.service');

// Horoscope advice templates by element (enriched)
const ELEMENT_ADVICE = {
  fire: {
    emoji: '🔥',
    name: 'Огонь',
    signs: ['Овен', 'Лев', 'Стрелец'],
    daily: {
      do: ['Проявите инициативу', 'Будьте активны', 'Действуйте смело', 'Начните новое', 'Вдохновляйте других', 'Ведите за собой'],
      dont: ['Не спешите с выводами', 'Избегайте конфликтов', 'Не будьте импульсивны', 'Не игнорируйте детали', 'Не выгорайте'],
      energy: ['Сегодня ваша огненная энергия на пике', 'Используйте энтузиазм с умом', 'Ваша харизма притягивает возможности']
    },
    weekly: {
      focus: ['Карьера и амбиции', 'Творческие проекты', 'Физическая активность', 'Лидерство'],
      avoid: ['Переутомление', 'Конфликты с близкими', 'Импульсивные траты', 'Авторитарность'],
      opportunities: ['Новые начинания особенно успешны', 'Спортивные достижения', 'Продвижение по службе']
    },
    love: {
      single: ['Ваша энергия привлекает поклонников', 'Активные знакомства благоприятны', 'Проявите инициативу'],
      relationship: ['Добавьте страсти в отношения', 'Организуйте сюрприз для партнёра', 'Избегайте конфликтов на пустом месте']
    },
    health: ['Физическая активность обязательна', 'Следите за давлением', 'Избегайте переутомления'],
    finance: ['Рискованные инвестиции могут окупиться', 'Не делайте импульсивных покупок', 'Хорошее время для переговоров о зарплате']
  },
  earth: {
    emoji: '🌍',
    name: 'Земля',
    signs: ['Телец', 'Дева', 'Козерог'],
    daily: {
      do: ['Планируйте заранее', 'Будьте практичны', 'Фокус на финансах', 'Укрепляйте стабильность', 'Работайте методично', 'Заботьтесь о теле'],
      dont: ['Не будьте упрямы', 'Не зацикливайтесь на деталях', 'Избегайте рутины', 'Не отказывайтесь от нового', 'Не критикуйте других'],
      energy: ['Земная энергия даёт стабильность', 'Ваша практичность - ваша сила', 'Материальный мир благоволит вам']
    },
    weekly: {
      focus: ['Финансовое планирование', 'Здоровье и режим', 'Долгосрочные цели', 'Карьерный рост'],
      avoid: ['Застой и рутина', 'Излишняя жёсткость', 'Материализм', 'Перфекционизм'],
      opportunities: ['Выгодные сделки', 'Повышение на работе', 'Инвестиции в недвижимость']
    },
    love: {
      single: ['Ищите стабильного партнёра', 'Не торопитесь с выводами', 'Практичные знакомства'],
      relationship: ['Укрепляйте фундамент отношений', 'Совместные финансы', 'Планирование будущего']
    },
    health: ['Правильное питание', 'Регулярный режим', 'Массаж и spa-процедуры'],
    finance: ['Консервативные инвестиции', 'Накопления и сбережения', 'Выгодные покупки недвижимости']
  },
  air: {
    emoji: '💨',
    name: 'Воздух',
    signs: ['Близнецы', 'Весы', 'Водолей'],
    daily: {
      do: ['Общайтесь активно', 'Учитесь новому', 'Делитесь идеями', 'Будьте открыты', 'Исследуйте возможности', 'Заводите знакомства'],
      dont: ['Не распыляйтесь', 'Избегайте сплетен', 'Не витайте в облаках', 'Не игнорируйте чувства', 'Не откладывайте важное'],
      energy: ['Воздушная лёгкость открывает двери', 'Интеллект - ваше оружие', 'Коммуникация на высоте']
    },
    weekly: {
      focus: ['Обучение и развитие', 'Социальные связи', 'Интеллектуальные проекты', 'Путешествия'],
      avoid: ['Поверхностность', 'Излишняя болтливость', 'Непоследовательность', 'Сплетни'],
      opportunities: ['Выгодные контакты', 'Новые идеи', 'Публичные выступления']
    },
    love: {
      single: ['Знакомства через интернет', 'Интеллектуальная совместимость важна', 'Общие интересы'],
      relationship: ['Больше общения с партнёром', 'Совместные путешествия', 'Новые хобби вдвоём']
    },
    health: ['Дыхательные практики', 'Медитация', 'Прогулки на свежем воздухе'],
    finance: ['Инновационные проекты', 'IT-сфера благоприятна', 'Сетевой бизнес']
  },
  water: {
    emoji: '🌊',
    name: 'Вода',
    signs: ['Рак', 'Скорпион', 'Рыбы'],
    daily: {
      do: ['Слушайте интуицию', 'Заботьтесь о близких', 'Выражайте чувства', 'Медитируйте', 'Творите', 'Исцеляйте'],
      dont: ['Не погружайтесь в эмоции', 'Избегайте драм', 'Не манипулируйте', 'Не изолируйтесь', 'Не жертвуйте собой'],
      energy: ['Интуиция особенно сильна', 'Эмоциональная глубина даёт мудрость', 'Творческий поток открыт']
    },
    weekly: {
      focus: ['Эмоциональное здоровье', 'Отношения', 'Творчество', 'Духовные практики'],
      avoid: ['Эмоциональные качели', 'Созависимость', 'Излишняя чувствительность', 'Жалость к себе'],
      opportunities: ['Творческие проекты', 'Глубокие отношения', 'Духовный рост']
    },
    love: {
      single: ['Ищите глубокую связь', 'Доверяйте интуиции', 'Эмоциональная совместимость'],
      relationship: ['Глубокие разговоры', 'Эмоциональная близость', 'Романтика и нежность']
    },
    health: ['Водные процедуры', 'Работа с эмоциями', 'Творческая терапия'],
    finance: ['Интуитивные инвестиции', 'Творческий заработок', 'Помогающие профессии']
  }
};

// Zodiac-specific advice (detailed)
const ZODIAC_ADVICE = {
  'Овен': {
    dailyMood: ['Энергия бьёт ключом', 'День для побед', 'Лидерство на высоте'],
    challenges: ['Контролируйте импульсивность', 'Не давите на других'],
    opportunities: ['Новые проекты', 'Спортивные достижения']
  },
  'Телец': {
    dailyMood: ['Стабильность и комфорт', 'День для наслаждения', 'Практичные решения'],
    challenges: ['Будьте гибче', 'Не упрямьтесь'],
    opportunities: ['Финансовые сделки', 'Творческие проекты']
  },
  'Близнецы': {
    dailyMood: ['Общительность на пике', 'Новые идеи', 'Интеллектуальная активность'],
    challenges: ['Сконцентрируйтесь на одном', 'Доводите до конца'],
    opportunities: ['Полезные контакты', 'Обучение']
  },
  'Рак': {
    dailyMood: ['Эмоциональная глубина', 'Забота о близких', 'Домашний уют'],
    challenges: ['Не замыкайтесь', 'Контролируйте настроение'],
    opportunities: ['Семейные дела', 'Недвижимость']
  },
  'Лев': {
    dailyMood: ['Харизма сияет', 'Творческий подъём', 'Признание заслуг'],
    challenges: ['Не будьте эгоцентричны', 'Слушайте других'],
    opportunities: ['Публичность', 'Творчество', 'Романтика']
  },
  'Дева': {
    dailyMood: ['Внимание к деталям', 'Продуктивность высока', 'Порядок во всём'],
    challenges: ['Не критикуйте чрезмерно', 'Отдыхайте'],
    opportunities: ['Карьерный рост', 'Здоровье']
  },
  'Весы': {
    dailyMood: ['Гармония и баланс', 'Дипломатия', 'Красота вокруг'],
    challenges: ['Примите решение', 'Не угождайте всем'],
    opportunities: ['Партнёрства', 'Искусство']
  },
  'Скорпион': {
    dailyMood: ['Интенсивность чувств', 'Глубокое понимание', 'Магнетизм'],
    challenges: ['Контролируйте ревность', 'Отпускайте обиды'],
    opportunities: ['Трансформация', 'Интимность', 'Финансы']
  },
  'Стрелец': {
    dailyMood: ['Оптимизм и свобода', 'Жажда приключений', 'Философский настрой'],
    challenges: ['Будьте тактичны', 'Не разбрасывайтесь'],
    opportunities: ['Путешествия', 'Обучение', 'Новые горизонты']
  },
  'Козерог': {
    dailyMood: ['Амбициозность', 'Дисциплина', 'Стремление к вершине'],
    challenges: ['Расслабьтесь иногда', 'Не будьте слишком серьёзны'],
    opportunities: ['Карьера', 'Статус', 'Долгосрочные планы']
  },
  'Водолей': {
    dailyMood: ['Оригинальность', 'Независимость', 'Прогрессивные идеи'],
    challenges: ['Оставайтесь на связи с эмоциями', 'Не отчуждайтесь'],
    opportunities: ['Инновации', 'Сообщество', 'Технологии']
  },
  'Рыбы': {
    dailyMood: ['Интуиция и мечты', 'Творческое вдохновение', 'Сострадание'],
    challenges: ['Оставайтесь в реальности', 'Границы важны'],
    opportunities: ['Искусство', 'Духовность', 'Исцеление']
  }
};

/**
 * Generate daily horoscope based on zodiac sign (enriched version)
 */
function generateDailyHoroscope(zodiacSign, element, tarotCard) {
  const elementKey = element?.toLowerCase() || 'fire';
  const elementAdvice = ELEMENT_ADVICE[elementKey] || ELEMENT_ADVICE.fire;
  const zodiacAdvice = ZODIAC_ADVICE[zodiacSign] || ZODIAC_ADVICE['Овен'];

  const doAdvice1 = elementAdvice.daily.do[Math.floor(Math.random() * elementAdvice.daily.do.length)];
  const doAdvice2 = elementAdvice.daily.do[Math.floor(Math.random() * elementAdvice.daily.do.length)];
  const dontAdvice = elementAdvice.daily.dont[Math.floor(Math.random() * elementAdvice.daily.dont.length)];
  const energyMessage = elementAdvice.daily.energy[Math.floor(Math.random() * elementAdvice.daily.energy.length)];
  const mood = zodiacAdvice.dailyMood[Math.floor(Math.random() * zodiacAdvice.dailyMood.length)];

  const horoscope = {
    sign: zodiacSign,
    element: elementAdvice.name,
    elementEmoji: elementAdvice.emoji,
    date: new Date().toLocaleDateString('ru-RU'),
    mood: mood,
    energy: energyMessage,
    do: [doAdvice1, doAdvice2, 'Доверяйте интуиции'],
    dont: [dontAdvice, 'Игнорировать предчувствия'],
    tarotCard: tarotCard || null,
    love: elementAdvice.love,
    health: elementAdvice.health[Math.floor(Math.random() * elementAdvice.health.length)],
    finance: elementAdvice.finance[Math.floor(Math.random() * elementAdvice.finance.length)],
    challenges: zodiacAdvice.challenges,
    opportunities: zodiacAdvice.opportunities,
    luckyNumber: Math.floor(Math.random() * 100) + 1,
    luckyColor: elementAdvice.name === 'Огонь' ? 'Красный' :
                elementAdvice.name === 'Земля' ? 'Зелёный' :
                elementAdvice.name === 'Воздух' ? 'Жёлтый' : 'Синий'
  };

  return horoscope;
}

/**
 * Generate text version of daily horoscope
 */
function generateDailyHoroscopeText(zodiacSign, element, tarotCard) {
  const data = generateDailyHoroscope(zodiacSign, element, tarotCard);

  let text = `${data.elementEmoji} Гороскоп на ${data.date} для ${data.sign}:\n\n`;
  text += `🌟 Настроение: ${data.mood}\n`;
  text += `⚡ Энергия: ${data.energy}\n\n`;

  if (data.tarotCard) {
    text += `🎴 Карта дня: "${data.tarotCard}" усиливает вашу природную силу.\n\n`;
  }

  text += `✅ СТОИТ:\n`;
  data.do.forEach(item => { text += `• ${item}\n`; });

  text += `\n❌ НЕ СТОИТ:\n`;
  data.dont.forEach(item => { text += `• ${item}\n`; });

  text += `\n💕 Любовь: ${data.love.single[0]}\n`;
  text += `💪 Здоровье: ${data.health}\n`;
  text += `💰 Финансы: ${data.finance}\n`;
  text += `\n🍀 Счастливое число: ${data.luckyNumber}\n`;
  text += `🎨 Счастливый цвет: ${data.luckyColor}`;

  return text;
}

// Weekly day energies
const WEEKLY_ENERGIES = {
  'Понедельник': {
    planet: 'Луна',
    emoji: '🌙',
    energy: 'эмоциональная',
    activities: ['Планирование', 'Семейные дела', 'Интуитивные решения'],
    avoid: ['Важные переговоры', 'Рискованные инвестиции']
  },
  'Вторник': {
    planet: 'Марс',
    emoji: '🔥',
    energy: 'активная',
    activities: ['Спорт', 'Конкуренция', 'Начало проектов'],
    avoid: ['Конфликты', 'Импульсивные решения']
  },
  'Среда': {
    planet: 'Меркурий',
    emoji: '💬',
    energy: 'коммуникативная',
    activities: ['Переговоры', 'Обучение', 'Короткие поездки'],
    avoid: ['Важные подписания', 'Крупные покупки']
  },
  'Четверг': {
    planet: 'Юпитер',
    emoji: '🍀',
    energy: 'благоприятная',
    activities: ['Финансы', 'Расширение', 'Путешествия'],
    avoid: ['Излишества', 'Самонадеянность']
  },
  'Пятница': {
    planet: 'Венера',
    emoji: '💕',
    energy: 'романтическая',
    activities: ['Любовь', 'Красота', 'Искусство', 'Покупки'],
    avoid: ['Излишние траты', 'Легкомыслие']
  },
  'Суббота': {
    planet: 'Сатурн',
    emoji: '🏔️',
    energy: 'серьёзная',
    activities: ['Планирование', 'Дисциплина', 'Порядок'],
    avoid: ['Пессимизм', 'Изоляция']
  },
  'Воскресенье': {
    planet: 'Солнце',
    emoji: '☀️',
    energy: 'творческая',
    activities: ['Отдых', 'Творчество', 'Самовыражение'],
    avoid: ['Работа', 'Стресс']
  }
};

/**
 * Generate weekly horoscope (enriched version)
 */
function generateWeeklyHoroscope(zodiacSign, element) {
  const elementKey = element?.toLowerCase() || 'fire';
  const elementAdvice = ELEMENT_ADVICE[elementKey] || ELEMENT_ADVICE.fire;
  const zodiacAdvice = ZODIAC_ADVICE[zodiacSign] || ZODIAC_ADVICE['Овен'];

  // Generate day-by-day forecast
  const days = Object.keys(WEEKLY_ENERGIES);
  const dailyForecasts = days.map(day => {
    const dayInfo = WEEKLY_ENERGIES[day];
    const activity = dayInfo.activities[Math.floor(Math.random() * dayInfo.activities.length)];
    const avoidItem = dayInfo.avoid[Math.floor(Math.random() * dayInfo.avoid.length)];

    // Rating based on element-planet harmony
    const rating = calculateDayRating(elementKey, dayInfo.planet);

    return {
      day,
      planet: dayInfo.planet,
      emoji: dayInfo.emoji,
      energy: dayInfo.energy,
      activity,
      avoid: avoidItem,
      rating
    };
  });

  // Find best and challenging days
  const bestDay = dailyForecasts.reduce((best, day) => day.rating > best.rating ? day : best);
  const challengingDay = dailyForecasts.reduce((worst, day) => day.rating < worst.rating ? day : worst);

  return {
    sign: zodiacSign,
    element: elementAdvice.name,
    elementEmoji: elementAdvice.emoji,
    weekStart: getWeekDates().start,
    weekEnd: getWeekDates().end,
    overview: `Неделя для знаков стихии ${elementAdvice.name} обещает ${getWeekOverview(elementKey)}`,
    focus: elementAdvice.weekly.focus,
    avoid: elementAdvice.weekly.avoid,
    opportunities: elementAdvice.weekly.opportunities,
    dailyForecasts,
    bestDay: bestDay.day,
    challengingDay: challengingDay.day,
    love: {
      single: elementAdvice.love.single,
      relationship: elementAdvice.love.relationship
    },
    health: elementAdvice.health,
    finance: elementAdvice.finance,
    challenges: zodiacAdvice.challenges,
    weeklyAffirmation: getWeeklyAffirmation(elementKey),
    luckyDays: dailyForecasts.filter(d => d.rating >= 4).map(d => d.day)
  };
}

/**
 * Generate text version of weekly horoscope
 */
function generateWeeklyHoroscopeText(zodiacSign, element) {
  const data = generateWeeklyHoroscope(zodiacSign, element);

  let text = `${data.elementEmoji} Недельный прогноз для ${data.sign}\n`;
  text += `📅 ${data.weekStart} - ${data.weekEnd}\n\n`;
  text += `🌟 ${data.overview}\n\n`;

  text += `📋 ФОКУС НЕДЕЛИ:\n`;
  data.focus.forEach(item => { text += `• ${item}\n`; });

  text += `\n📆 ПРОГНОЗ ПО ДНЯМ:\n`;
  data.dailyForecasts.forEach(day => {
    const stars = '★'.repeat(day.rating) + '☆'.repeat(5 - day.rating);
    text += `${day.emoji} ${day.day} (${day.planet}): ${stars}\n`;
    text += `   ✅ ${day.activity} | ❌ ${day.avoid}\n`;
  });

  text += `\n🌟 ЛУЧШИЙ ДЕНЬ: ${data.bestDay}\n`;
  text += `⚠️ СЛОЖНЫЙ ДЕНЬ: ${data.challengingDay}\n`;

  text += `\n💕 ЛЮБОВЬ:\n`;
  text += `   Одиноким: ${data.love.single[0]}\n`;
  text += `   В паре: ${data.love.relationship[0]}\n`;

  text += `\n💰 ФИНАНСЫ: ${data.finance[0]}\n`;
  text += `💪 ЗДОРОВЬЕ: ${data.health[0]}\n`;

  text += `\n🔮 АФФИРМАЦИЯ: "${data.weeklyAffirmation}"`;

  return text;
}

/**
 * Generate monthly horoscope
 */
function generateMonthlyHoroscope(zodiacSign, element) {
  const elementKey = element?.toLowerCase() || 'fire';
  const elementAdvice = ELEMENT_ADVICE[elementKey] || ELEMENT_ADVICE.fire;
  const zodiacAdvice = ZODIAC_ADVICE[zodiacSign] || ZODIAC_ADVICE['Овен'];

  const month = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  // Generate week-by-week overview
  const weeks = [
    { week: 1, theme: 'Начало и планирование', energy: getRandomEnergy(elementKey) },
    { week: 2, theme: 'Действие и развитие', energy: getRandomEnergy(elementKey) },
    { week: 3, theme: 'Пересмотр и корректировка', energy: getRandomEnergy(elementKey) },
    { week: 4, theme: 'Завершение и подготовка', energy: getRandomEnergy(elementKey) }
  ];

  // Monthly themes based on element
  const monthlyThemes = {
    fire: ['Карьерный рывок', 'Творческое самовыражение', 'Лидерские проекты'],
    earth: ['Финансовая стабильность', 'Здоровье и режим', 'Материальные достижения'],
    air: ['Новые контакты', 'Обучение и развитие', 'Путешествия и идеи'],
    water: ['Эмоциональное исцеление', 'Отношения и интуиция', 'Творческие проекты']
  };

  const themes = monthlyThemes[elementKey] || monthlyThemes.fire;

  return {
    sign: zodiacSign,
    element: elementAdvice.name,
    elementEmoji: elementAdvice.emoji,
    month,
    overview: getMonthlyOverview(zodiacSign, elementKey),
    mainTheme: themes[Math.floor(Math.random() * themes.length)],
    weeks,
    career: {
      rating: Math.floor(Math.random() * 3) + 3,
      advice: elementAdvice.weekly.focus[0],
      bestPeriod: `${Math.floor(Math.random() * 14) + 1}-${Math.floor(Math.random() * 14) + 15} число`
    },
    love: {
      rating: Math.floor(Math.random() * 3) + 3,
      single: elementAdvice.love.single,
      relationship: elementAdvice.love.relationship,
      bestPeriod: getRandomPeriod()
    },
    health: {
      rating: Math.floor(Math.random() * 3) + 3,
      advice: elementAdvice.health,
      focus: elementKey === 'fire' ? 'Не перегорите' :
             elementKey === 'earth' ? 'Режим и питание' :
             elementKey === 'air' ? 'Нервная система' : 'Эмоциональное равновесие'
    },
    finance: {
      rating: Math.floor(Math.random() * 3) + 3,
      advice: elementAdvice.finance,
      bestPeriod: getRandomPeriod()
    },
    luckyNumbers: [
      Math.floor(Math.random() * 31) + 1,
      Math.floor(Math.random() * 31) + 1,
      Math.floor(Math.random() * 31) + 1
    ].sort((a, b) => a - b),
    luckyDates: [
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 28) + 1
    ].sort((a, b) => a - b),
    challenges: zodiacAdvice.challenges,
    opportunities: zodiacAdvice.opportunities,
    monthlyAffirmation: getMonthlyAffirmation(zodiacSign)
  };
}

/**
 * Generate text version of monthly horoscope
 */
function generateMonthlyHoroscopeText(zodiacSign, element) {
  const data = generateMonthlyHoroscope(zodiacSign, element);

  let text = `${data.elementEmoji} Месячный прогноз для ${data.sign}\n`;
  text += `📅 ${data.month}\n\n`;
  text += `🌟 ${data.overview}\n\n`;
  text += `🎯 ГЛАВНАЯ ТЕМА: ${data.mainTheme}\n\n`;

  text += `📆 ОБЗОР ПО НЕДЕЛЯМ:\n`;
  data.weeks.forEach(w => {
    text += `   Неделя ${w.week}: ${w.theme} (${w.energy})\n`;
  });

  const getStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  text += `\n💼 КАРЬЕРА: ${getStars(data.career.rating)}\n`;
  text += `   ${data.career.advice}\n`;
  text += `   Лучший период: ${data.career.bestPeriod}\n`;

  text += `\n💕 ЛЮБОВЬ: ${getStars(data.love.rating)}\n`;
  text += `   Одиноким: ${data.love.single[0]}\n`;
  text += `   В паре: ${data.love.relationship[0]}\n`;
  text += `   Лучший период: ${data.love.bestPeriod}\n`;

  text += `\n💪 ЗДОРОВЬЕ: ${getStars(data.health.rating)}\n`;
  text += `   Фокус: ${data.health.focus}\n`;
  text += `   ${data.health.advice[0]}\n`;

  text += `\n💰 ФИНАНСЫ: ${getStars(data.finance.rating)}\n`;
  text += `   ${data.finance.advice[0]}\n`;
  text += `   Лучший период: ${data.finance.bestPeriod}\n`;

  text += `\n🍀 СЧАСТЛИВЫЕ ЧИСЛА: ${data.luckyNumbers.join(', ')}\n`;
  text += `📅 БЛАГОПРИЯТНЫЕ ДАТЫ: ${data.luckyDates.join(', ')} число\n`;

  text += `\n🔮 АФФИРМАЦИЯ МЕСЯЦА:\n"${data.monthlyAffirmation}"`;

  return text;
}

// Helper functions
function calculateDayRating(element, planet) {
  const harmony = {
    fire: { 'Марс': 5, 'Солнце': 5, 'Юпитер': 4, 'Луна': 2, 'Сатурн': 2, 'Меркурий': 3, 'Венера': 3 },
    earth: { 'Сатурн': 5, 'Венера': 4, 'Меркурий': 4, 'Луна': 3, 'Марс': 2, 'Юпитер': 4, 'Солнце': 3 },
    air: { 'Меркурий': 5, 'Венера': 4, 'Юпитер': 4, 'Солнце': 3, 'Сатурн': 2, 'Марс': 3, 'Луна': 3 },
    water: { 'Луна': 5, 'Венера': 4, 'Юпитер': 4, 'Марс': 2, 'Сатурн': 2, 'Меркурий': 3, 'Солнце': 3 }
  };
  return harmony[element]?.[planet] || 3;
}

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    end: sunday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  };
}

function getWeekOverview(element) {
  const overviews = {
    fire: 'активные перемены и новые возможности для проявления лидерских качеств',
    earth: 'стабильность и хорошие шансы для финансового роста',
    air: 'насыщенное общение и интересные идеи',
    water: 'глубокие эмоциональные переживания и творческое вдохновение'
  };
  return overviews[element] || overviews.fire;
}

function getWeeklyAffirmation(element) {
  const affirmations = {
    fire: 'Я уверенно иду к своим целям, моя энергия неиссякаема',
    earth: 'Я создаю прочный фундамент для своего успеха',
    air: 'Мои мысли ясны, а идеи находят воплощение',
    water: 'Я доверяю своей интуиции и открыт потоку жизни'
  };
  return affirmations[element] || affirmations.fire;
}

function getRandomEnergy(element) {
  const energies = {
    fire: ['высокая', 'пиковая', 'активная', 'мощная'],
    earth: ['стабильная', 'уверенная', 'продуктивная', 'надёжная'],
    air: ['лёгкая', 'подвижная', 'творческая', 'интеллектуальная'],
    water: ['глубокая', 'интуитивная', 'чувственная', 'текучая']
  };
  const list = energies[element] || energies.fire;
  return list[Math.floor(Math.random() * list.length)];
}

function getRandomPeriod() {
  const start = Math.floor(Math.random() * 14) + 1;
  const end = start + Math.floor(Math.random() * 10) + 5;
  return `${start}-${Math.min(end, 28)} число`;
}

function getMonthlyOverview(sign, element) {
  const base = {
    fire: `Этот месяц принесёт ${sign} множество возможностей для самовыражения и достижения целей`,
    earth: `Для ${sign} этот месяц станет временем укрепления позиций и материальных достижений`,
    air: `${sign} ожидает насыщенный месяц общения, новых идей и интересных знакомств`,
    water: `Этот месяц для ${sign} будет наполнен глубокими переживаниями и творческим вдохновением`
  };
  return base[element] || base.fire;
}

function getMonthlyAffirmation(sign) {
  const affirmations = {
    'Овен': 'Я лидер своей судьбы, и этот месяц принадлежит мне',
    'Телец': 'Изобилие приходит ко мне легко и естественно',
    'Близнецы': 'Мой разум открыт новым идеям и возможностям',
    'Рак': 'Я создаю гармонию в своём доме и сердце',
    'Лев': 'Моё внутреннее сияние привлекает успех и признание',
    'Дева': 'Я совершенствую свою жизнь с любовью и терпением',
    'Весы': 'Гармония и красота наполняют каждый мой день',
    'Скорпион': 'Я трансформирую вызовы в победы',
    'Стрелец': 'Вселенная открывает передо мной новые горизонты',
    'Козерог': 'Каждый мой шаг ведёт к вершине успеха',
    'Водолей': 'Моя уникальность — мой главный дар миру',
    'Рыбы': 'Я плыву в потоке вселенской мудрости и любви'
  };
  return affirmations[sign] || 'Этот месяц полон возможностей для моего роста';
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

// Helper function for element name translation (exported for external use)
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
  generateDailyHoroscopeText,
  generateWeeklyHoroscope,
  generateWeeklyHoroscopeText,
  generateMonthlyHoroscope,
  generateMonthlyHoroscopeText,
  getCombinedReading,
  getElementName,
  ELEMENT_ADVICE,
  ZODIAC_ADVICE,
  WEEKLY_ENERGIES
};
