import './AchievementBadge.css'

const ACHIEVEMENTS = {
  first_reading: {
    id: 'first_reading',
    icon: '🎴',
    name: 'Первый Расклад',
    description: 'Вытянули первую карту',
    requirement: 1
  },
  week_streak: {
    id: 'week_streak',
    icon: '🔥',
    name: 'Неделя Подряд',
    description: '7 дней серии',
    requirement: 7
  },
  month_streak: {
    id: 'month_streak',
    icon: '🏆',
    name: 'Месяц Подряд',
    description: '30 дней серии',
    requirement: 30
  },
  ten_readings: {
    id: 'ten_readings',
    icon: '📖',
    name: 'Увлечённый',
    description: '10 раскладов',
    requirement: 10
  },
  fifty_readings: {
    id: 'fifty_readings',
    icon: '⭐',
    name: 'Эксперт',
    description: '50 раскладов',
    requirement: 50
  },
  hundred_readings: {
    id: 'hundred_readings',
    icon: '👑',
    name: 'Мастер Таро',
    description: '100 раскладов',
    requirement: 100
  },
  first_decision: {
    id: 'first_decision',
    icon: '🎯',
    name: 'Первое Решение',
    description: 'Первый анализ решения',
    requirement: 1
  },
  ten_decisions: {
    id: 'ten_decisions',
    icon: '🧠',
    name: 'Мудрые Выборы',
    description: '10 анализов решений',
    requirement: 10
  },
  all_major_arcana: {
    id: 'all_major_arcana',
    icon: '🌟',
    name: 'Старшие Арканы',
    description: 'Вытянули все 22 Major Arcana',
    requirement: 22
  },
  premium_user: {
    id: 'premium_user',
    icon: '💎',
    name: 'Премиум Пользователь',
    description: 'Оформили премиум подписку',
    requirement: 1
  },
  astrology_explorer: {
    id: 'astrology_explorer',
    icon: '⭐',
    name: 'Исследователь Звёзд',
    description: 'Рассчитали натальную карту',
    requirement: 1
  },
  numerology_student: {
    id: 'numerology_student',
    icon: '🔢',
    name: 'Ученик Чисел',
    description: 'Использовали нумерологию',
    requirement: 1
  },
  love_seeker: {
    id: 'love_seeker',
    icon: '💕',
    name: 'Искатель Любви',
    description: 'Сделали расклад на отношения',
    requirement: 1
  },
  wealth_builder: {
    id: 'wealth_builder',
    icon: '💰',
    name: 'Строитель Богатства',
    description: 'Использовали финансовый расклад',
    requirement: 1
  },
  year_planner: {
    id: 'year_planner',
    icon: '🗓️',
    name: 'Планировщик Года',
    description: 'Сделали годовой расклад',
    requirement: 1
  },
  birthday_celebrator: {
    id: 'birthday_celebrator',
    icon: '🎂',
    name: 'Именинник',
    description: 'Сделали расклад на ДР',
    requirement: 1
  },
  quick_thinker: {
    id: 'quick_thinker',
    icon: '❓',
    name: 'Быстрый Ум',
    description: 'Использовали Да/Нет расклад',
    requirement: 1
  },
  journal_keeper: {
    id: 'journal_keeper',
    icon: '📔',
    name: 'Хранитель Дневника',
    description: 'Создали 10 записей в дневнике',
    requirement: 10
  },
  moon_watcher: {
    id: 'moon_watcher',
    icon: '🌙',
    name: 'Наблюдатель Луны',
    description: 'Проверяли лунные фазы',
    requirement: 1
  },
  early_bird: {
    id: 'early_bird',
    icon: '🌅',
    name: 'Ранняя Птичка',
    description: 'Расклад до 9:00 утра',
    requirement: 1
  },
  night_owl: {
    id: 'night_owl',
    icon: '🦉',
    name: 'Сова',
    description: 'Расклад после 23:00',
    requirement: 1
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    icon: '🎊',
    name: 'Выходной Воин',
    description: '10 раскладов в выходные',
    requirement: 10
  },
  card_collector: {
    id: 'card_collector',
    icon: '🃏',
    name: 'Коллекционер Карт',
    description: 'Вытянули 50+ уникальных карт',
    requirement: 50
  },
  full_deck: {
    id: 'full_deck',
    icon: '🎴',
    name: 'Полная Колода',
    description: 'Вытянули все 78 карт',
    requirement: 78
  },
  spread_master: {
    id: 'spread_master',
    icon: '🔮',
    name: 'Мастер Раскладов',
    description: 'Попробовали все типы раскладов',
    requirement: 9
  },
  question_master: {
    id: 'question_master',
    icon: '💭',
    name: 'Мастер Вопросов',
    description: '100 вопросов задано',
    requirement: 100
  },
  reversed_expert: {
    id: 'reversed_expert',
    icon: '🔄',
    name: 'Эксперт Перевёрнутых',
    description: 'Вытянули 20 перевёрнутых карт',
    requirement: 20
  },
  major_arcana_fan: {
    id: 'major_arcana_fan',
    icon: '✨',
    name: 'Фанат Старших Арканов',
    description: 'Вытянули 100 Major Arcana',
    requirement: 100
  },
  cups_lover: {
    id: 'cups_lover',
    icon: '🏆',
    name: 'Любитель Кубков',
    description: 'Вытянули 30 карт масти Кубки',
    requirement: 30
  }
};

function AchievementBadge({ achievementId, unlocked = false, size = 'medium' }) {
  const achievement = ACHIEVEMENTS[achievementId];

  if (!achievement) return null;

  return (
    <div className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'} size-${size}`}>
      <div className="badge-icon">{achievement.icon}</div>
      <div className="badge-info">
        <div className="badge-name">{achievement.name}</div>
        {size !== 'small' && (
          <div className="badge-description">{achievement.description}</div>
        )}
      </div>
      {!unlocked && <div className="badge-lock">🔒</div>}
    </div>
  );
}

// Helper to check if achievement is unlocked
export function checkAchievements(user, readings = []) {
  const unlocked = [];

  // First reading
  if (user.stats?.totalReadings >= 1) unlocked.push('first_reading');

  // Streaks
  if (user.stats?.currentStreak >= 7) unlocked.push('week_streak');
  if (user.stats?.currentStreak >= 30) unlocked.push('month_streak');

  // Total readings
  if (user.stats?.totalReadings >= 10) unlocked.push('ten_readings');
  if (user.stats?.totalReadings >= 50) unlocked.push('fifty_readings');
  if (user.stats?.totalReadings >= 100) unlocked.push('hundred_readings');

  // Decisions
  const decisions = readings.filter(r => r.type === 'decision').length;
  if (decisions >= 1) unlocked.push('first_decision');
  if (decisions >= 10) unlocked.push('ten_decisions');

  // Premium
  if (user.subscriptionTier === 'premium') unlocked.push('premium_user');

  return unlocked;
}

export { ACHIEVEMENTS };
export default AchievementBadge;
