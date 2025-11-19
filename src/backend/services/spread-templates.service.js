/**
 * Tarot Spread Templates
 * Universal system for all tarot spreads
 */

const SPREAD_TEMPLATES = {
  'daily-single': {
    id: 'daily-single',
    name: 'Карта Дня',
    nameEn: 'Daily Card',
    description: 'Одна карта показывает энергию и совет на сегодня',
    cardCount: 1,
    difficulty: 'beginner',
    category: 'daily',
    estimatedTime: '2 мин',
    positions: [
      {
        id: 1,
        name: 'Энергия Дня',
        description: 'Какая энергия доминирует сегодня и как её использовать',
        x: 50, y: 50 // center
      }
    ]
  },

  'past-present-future': {
    id: 'past-present-future',
    name: 'Прошлое-Настоящее-Будущее',
    nameEn: 'Past-Present-Future',
    description: 'Классический трёхкарточный расклад для понимания ситуации',
    cardCount: 3,
    difficulty: 'beginner',
    category: 'general',
    estimatedTime: '5 мин',
    positions: [
      {
        id: 1,
        name: 'Прошлое',
        description: 'Что привело к текущей ситуации, корни проблемы',
        x: 20, y: 50
      },
      {
        id: 2,
        name: 'Настоящее',
        description: 'Текущее состояние, что происходит сейчас',
        x: 50, y: 50
      },
      {
        id: 3,
        name: 'Будущее',
        description: 'Куда ведёт текущий путь, вероятный исход',
        x: 80, y: 50
      }
    ]
  },

  'celtic-cross': {
    id: 'celtic-cross',
    name: 'Кельтский Крест',
    nameEn: 'Celtic Cross',
    description: 'Самый популярный расклад - глубокий анализ ситуации со всех сторон',
    cardCount: 10,
    difficulty: 'advanced',
    category: 'comprehensive',
    estimatedTime: '20 мин',
    positions: [
      {
        id: 1,
        name: 'Вы / Ситуация',
        description: 'Текущее состояние, ваша позиция, суть вопроса',
        x: 40, y: 50
      },
      {
        id: 2,
        name: 'Препятствие / Пересечение',
        description: 'Что мешает или влияет, скрытые факторы',
        x: 40, y: 50, rotation: 90 // crosses card 1
      },
      {
        id: 3,
        name: 'Основа / Прошлое',
        description: 'Фундамент ситуации, что было раньше',
        x: 40, y: 70
      },
      {
        id: 4,
        name: 'Недавнее Прошлое',
        description: 'События которые уходят, влияние ослабевает',
        x: 20, y: 50
      },
      {
        id: 5,
        name: 'Возможное Будущее',
        description: 'Куда движетесь, цели и намерения',
        x: 40, y: 30
      },
      {
        id: 6,
        name: 'Ближайшее Будущее',
        description: 'Что произойдёт скоро, ближайшие события',
        x: 60, y: 50
      },
      {
        id: 7,
        name: 'Вы / Ваша Позиция',
        description: 'Как вы видите себя, ваше отношение',
        x: 75, y: 80
      },
      {
        id: 8,
        name: 'Окружение / Другие',
        description: 'Влияние окружения, что думают другие',
        x: 75, y: 65
      },
      {
        id: 9,
        name: 'Надежды и Страхи',
        description: 'Ваши ожидания и опасения',
        x: 75, y: 50
      },
      {
        id: 10,
        name: 'Итог / Результат',
        description: 'Вероятный исход, к чему всё идёт',
        x: 75, y: 35
      }
    ]
  },

  'relationship': {
    id: 'relationship',
    name: 'Расклад Отношений',
    nameEn: 'Relationship Spread',
    description: 'Глубокий анализ отношений между двумя людьми',
    cardCount: 7,
    difficulty: 'intermediate',
    category: 'relationships',
    estimatedTime: '15 мин',
    positions: [
      {
        id: 1,
        name: 'Вы',
        description: 'Ваше состояние, ваши чувства, ваша роль',
        x: 25, y: 30
      },
      {
        id: 2,
        name: 'Партнёр',
        description: 'Состояние партнёра, его чувства, его роль',
        x: 75, y: 30
      },
      {
        id: 3,
        name: 'Связь / Отношения',
        description: 'Энергия между вами, природа связи',
        x: 50, y: 30
      },
      {
        id: 4,
        name: 'Что Укрепляет',
        description: 'Сильные стороны отношений, на что опираться',
        x: 35, y: 55
      },
      {
        id: 5,
        name: 'Что Мешает',
        description: 'Вызовы, препятствия, над чем работать',
        x: 65, y: 55
      },
      {
        id: 6,
        name: 'Будущее',
        description: 'Куда идут отношения, потенциал развития',
        x: 50, y: 70
      },
      {
        id: 7,
        name: 'Совет',
        description: 'Что делать, как действовать',
        x: 50, y: 85
      }
    ]
  },

  'career-path': {
    id: 'career-path',
    name: 'Карьерный Путь',
    nameEn: 'Career Path',
    description: 'Расклад для карьеры, финансов и профессионального роста',
    cardCount: 6,
    difficulty: 'intermediate',
    category: 'career',
    estimatedTime: '12 мин',
    positions: [
      {
        id: 1,
        name: 'Текущая Ситуация',
        description: 'Где вы сейчас в карьере',
        x: 50, y: 20
      },
      {
        id: 2,
        name: 'Ваши Таланты',
        description: 'Сильные стороны, на что опираться',
        x: 30, y: 40
      },
      {
        id: 3,
        name: 'Препятствия',
        description: 'Что мешает росту, вызовы',
        x: 70, y: 40
      },
      {
        id: 4,
        name: 'Возможности',
        description: 'Потенциал роста, куда двигаться',
        x: 30, y: 65
      },
      {
        id: 5,
        name: 'Совет',
        description: 'Как действовать для успеха',
        x: 70, y: 65
      },
      {
        id: 6,
        name: 'Итог',
        description: 'Вероятный результат',
        x: 50, y: 85
      }
    ]
  },

  'year-ahead': {
    id: 'year-ahead',
    name: 'Путь Года',
    nameEn: 'Year Ahead',
    description: 'Расклад на год - карта на каждый месяц',
    cardCount: 13,
    difficulty: 'advanced',
    category: 'timing',
    estimatedTime: '30 мин',
    positions: [
      { id: 1, name: 'Январь', description: 'Энергия и события января', x: 10, y: 30 },
      { id: 2, name: 'Февраль', description: 'Энергия и события февраля', x: 18, y: 30 },
      { id: 3, name: 'Март', description: 'Энергия и события марта', x: 26, y: 30 },
      { id: 4, name: 'Апрель', description: 'Энергия и события апреля', x: 34, y: 30 },
      { id: 5, name: 'Май', description: 'Энергия и события мая', x: 42, y: 30 },
      { id: 6, name: 'Июнь', description: 'Энергия и события июня', x: 50, y: 30 },
      { id: 7, name: 'Июль', description: 'Энергия и события июля', x: 58, y: 30 },
      { id: 8, name: 'Август', description: 'Энергия и события августа', x: 66, y: 30 },
      { id: 9, name: 'Сентябрь', description: 'Энергия и события сентября', x: 74, y: 30 },
      { id: 10, name: 'Октябрь', description: 'Энергия и события октября', x: 82, y: 30 },
      { id: 11, name: 'Ноябрь', description: 'Энергия и события ноября', x: 90, y: 30 },
      { id: 12, name: 'Декабрь', description: 'Энергия и события декабря', x: 98, y: 30 },
      { id: 13, name: 'Год Целиком', description: 'Общая энергия и итог года', x: 50, y: 65 }
    ]
  },

  'simple-cross': {
    id: 'simple-cross',
    name: 'Простой Крест',
    nameEn: 'Simple Cross',
    description: 'Быстрый расклад на 5 карт для анализа ситуации',
    cardCount: 5,
    difficulty: 'beginner',
    category: 'general',
    estimatedTime: '8 мин',
    positions: [
      {
        id: 1,
        name: 'Центр / Суть',
        description: 'Суть вопроса, вы в ситуации',
        x: 50, y: 50
      },
      {
        id: 2,
        name: 'Верх / Прошлое',
        description: 'Что было, откуда пришли',
        x: 50, y: 25
      },
      {
        id: 3,
        name: 'Право / Будущее',
        description: 'Куда идёте, что будет',
        x: 75, y: 50
      },
      {
        id: 4,
        name: 'Низ / Основа',
        description: 'Фундамент, скрытые факторы',
        x: 50, y: 75
      },
      {
        id: 5,
        name: 'Лево / Совет',
        description: 'Что делать, как действовать',
        x: 25, y: 50
      }
    ]
  }
};

/**
 * Get spread template by ID
 */
function getSpreadTemplate(spreadId) {
  return SPREAD_TEMPLATES[spreadId] || null;
}

/**
 * Get all available spreads
 */
function getAllSpreads() {
  return Object.values(SPREAD_TEMPLATES);
}

/**
 * Get spreads by category
 */
function getSpreadsByCategory(category) {
  return Object.values(SPREAD_TEMPLATES).filter(s => s.category === category);
}

/**
 * Get spreads by difficulty
 */
function getSpreadsByDifficulty(difficulty) {
  return Object.values(SPREAD_TEMPLATES).filter(s => s.difficulty === difficulty);
}

module.exports = {
  SPREAD_TEMPLATES,
  getSpreadTemplate,
  getAllSpreads,
  getSpreadsByCategory,
  getSpreadsByDifficulty
};
