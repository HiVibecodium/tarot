import { useState, useEffect } from 'react';
import axios from 'axios';
import MoonPhase from '../components/MoonPhase';
import { MoonCalendarSEO } from '../components/SEO'
import './MoonCalendarPage.css';

const MoonCalendarPage = () => {
  const [calendar, setCalendar] = useState(null);
  const [_currentPhase, setCurrentPhase] = useState(null);
  const [nextFullMoon, setNextFullMoon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [calendarRes, phaseRes, fullMoonRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/moon/calendar?year=${selectedYear}&month=${selectedMonth}`),
        axios.get(`${import.meta.env.VITE_API_URL}/moon/current`),
        axios.get(`${import.meta.env.VITE_API_URL}/moon/next-full-moon`)
      ]);

      if (calendarRes.data.success) setCalendar(calendarRes.data.data);
      if (phaseRes.data.success) setCurrentPhase(phaseRes.data.data);
      if (fullMoonRes.data.success) setNextFullMoon(fullMoonRes.data.data);
    } catch (error) {
      console.error('Error fetching moon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  return (
    <div className="moon-calendar-page">
      <MoonCalendarSEO />
      <div className="moon-header">
        <h1>🌙 Лунный Календарь</h1>
        <p>Узнайте благоприятные дни для раскладов и ритуалов</p>
      </div>

      {/* Current Phase Widget */}
      <div className="current-phase-section">
        <h2>Текущая Фаза Луны</h2>
        <MoonPhase showDetails={true} size="large" />
      </div>

      {/* Next Full Moon */}
      {nextFullMoon && (
        <div className="next-event-section">
          <div className="next-event-card">
            <span className="next-event-emoji">🌕</span>
            <div className="next-event-info">
              <h3>Следующее Полнолуние</h3>
              <p className="next-event-date">{nextFullMoon.dateFormatted}</p>
              <p className="next-event-days">
                {nextFullMoon.daysUntil === 0
                  ? 'Сегодня!'
                  : `Через ${nextFullMoon.daysUntil} ${getDaysWord(nextFullMoon.daysUntil)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="calendar-section">
        <div className="calendar-controls">
          <button onClick={() => changeMonth(-1)} className="month-nav-btn">
            ← Пред. месяц
          </button>
          <h2>{calendar?.monthName} {selectedYear}</h2>
          <button onClick={() => changeMonth(1)} className="month-nav-btn">
            След. месяц →
          </button>
        </div>

        {loading ? (
          <div className="calendar-loading">Загрузка календаря...</div>
        ) : calendar ? (
          <div className="calendar-grid">
            {calendar.days.map((day) => (
              <div
                key={day.date}
                className={`calendar-day ${day.isSpecial ? 'special' : ''}`}
              >
                <div className="day-number">{day.date}</div>
                <div className="day-weekday">{day.dayOfWeek}</div>
                <div className="day-moon">{day.emoji}</div>
                <div className="day-phase">{day.phase}</div>
                <div className="day-illumination">{day.illumination}%</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-error">Не удалось загрузить календарь</div>
        )}
      </div>

      {/* Moon Phases Legend */}
      <div className="legend-section">
        <h2>Значение Фаз Луны</h2>
        <div className="legend-grid">
          <div className="legend-item">
            <span className="legend-emoji">🌑</span>
            <div className="legend-info">
              <h4>Новолуние</h4>
              <p>Новые начинания, постановка намерений</p>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-emoji">🌓</span>
            <div className="legend-info">
              <h4>Первая четверть</h4>
              <p>Преодоление препятствий, действия</p>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-emoji">🌕</span>
            <div className="legend-info">
              <h4>Полнолуние</h4>
              <p>Пик энергии, лучшее время для раскладов!</p>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-emoji">🌗</span>
            <div className="legend-info">
              <h4>Последняя четверть</h4>
              <p>Рефлексия, завершение, подведение итогов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Recommendations */}
      <div className="recommendations-section">
        <h2>🌙 Детальные Рекомендации по Фазам Луны</h2>

        <div className="recommendation-card">
          <div className="recommendation-header">
            <span className="rec-emoji">🌑</span>
            <h3>Новолуние (0-3 дня)</h3>
          </div>
          <div className="recommendation-content">
            <div className="rec-column">
              <h4>✅ Благоприятно:</h4>
              <ul>
                <li>Начинать новые проекты и начинания</li>
                <li>Ставить цели и намерения на месяц</li>
                <li>Планировать будущее</li>
                <li>Медитация и работа с подсознанием</li>
                <li>Расклады на новые начинания</li>
                <li>Очищающие ритуалы</li>
              </ul>
            </div>
            <div className="rec-column">
              <h4>⚠️ Избегать:</h4>
              <ul>
                <li>Принимать важные решения в спешке</li>
                <li>Начинать конфликты</li>
                <li>Интенсивные энергетические практики</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="recommendation-card">
          <div className="recommendation-header">
            <span className="rec-emoji">🌒</span>
            <h3>Растущая Луна (4-10 дней)</h3>
          </div>
          <div className="recommendation-content">
            <div className="rec-column">
              <h4>✅ Благоприятно:</h4>
              <ul>
                <li>Активные действия для достижения целей</li>
                <li>Привлечение чего-то нового в жизнь</li>
                <li>Начало отношений и партнерств</li>
                <li>Расклады на привлечение и рост</li>
                <li>Финансовые вложения</li>
                <li>Укрепление здоровья</li>
              </ul>
            </div>
            <div className="rec-column">
              <h4>⚠️ Избегать:</h4>
              <ul>
                <li>Ритуалы на избавление</li>
                <li>Завершение проектов</li>
                <li>Пассивность и бездействие</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="recommendation-card">
          <div className="recommendation-header">
            <span className="rec-emoji">🌓</span>
            <h3>Первая Четверть (11-14 дней)</h3>
          </div>
          <div className="recommendation-content">
            <div className="rec-column">
              <h4>✅ Благоприятно:</h4>
              <ul>
                <li>Преодоление препятствий</li>
                <li>Решение сложных задач</li>
                <li>Важные переговоры</li>
                <li>Расклады на преодоление трудностей</li>
                <li>Проявление настойчивости</li>
                <li>Корректировка планов</li>
              </ul>
            </div>
            <div className="rec-column">
              <h4>⚠️ Избегать:</h4>
              <ul>
                <li>Сдаваться при первых трудностях</li>
                <li>Откладывать важные дела</li>
                <li>Игнорировать возникшие проблемы</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="recommendation-card highlight">
          <div className="recommendation-header">
            <span className="rec-emoji">🌕</span>
            <h3>Полнолуние (15-17 дней) ⭐</h3>
          </div>
          <div className="recommendation-content">
            <div className="rec-column">
              <h4>✅ Благоприятно:</h4>
              <ul>
                <li><strong>Лучшее время для раскладов Таро!</strong></li>
                <li>Важные ритуалы и церемонии</li>
                <li>Работа с интуицией</li>
                <li>Проявление благодарности</li>
                <li>Завершение начатого</li>
                <li>Энергетические практики</li>
                <li>Медитации на изобилие</li>
              </ul>
            </div>
            <div className="rec-column">
              <h4>⚠️ Избегать:</h4>
              <ul>
                <li>Начинать что-то новое</li>
                <li>Перегружать себя</li>
                <li>Импульсивные решения</li>
                <li>Конфликты (эмоции на пике)</li>
              </ul>
            </div>
          </div>
          <div className="rec-note">
            💡 <strong>Совет:</strong> Полнолуние - самое мощное время для работы с картами Таро.
            Расклады в этот период дают наиболее точные и глубокие ответы.
          </div>
        </div>

        <div className="recommendation-card">
          <div className="recommendation-header">
            <span className="rec-emoji">🌖</span>
            <h3>Убывающая Луна (18-24 дня)</h3>
          </div>
          <div className="recommendation-content">
            <div className="rec-column">
              <h4>✅ Благоприятно:</h4>
              <ul>
                <li>Избавление от ненужного</li>
                <li>Расставание с прошлым</li>
                <li>Очищение пространства</li>
                <li>Расклады на освобождение</li>
                <li>Банишинг-ритуалы</li>
                <li>Работа с тенью</li>
              </ul>
            </div>
            <div className="rec-column">
              <h4>⚠️ Избегать:</h4>
              <ul>
                <li>Начинать новые проекты</li>
                <li>Привлекающие практики</li>
                <li>Активные действия</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="recommendation-card">
          <div className="recommendation-header">
            <span className="rec-emoji">🌗</span>
            <h3>Последняя Четверть (25-28 дней)</h3>
          </div>
          <div className="recommendation-content">
            <div className="rec-column">
              <h4>✅ Благоприятно:</h4>
              <ul>
                <li>Рефлексия и самоанализ</li>
                <li>Подведение итогов</li>
                <li>Завершение проектов</li>
                <li>Расклады на анализ ситуации</li>
                <li>Прощение и отпускание</li>
                <li>Отдых и восстановление</li>
              </ul>
            </div>
            <div className="rec-column">
              <h4>⚠️ Избегать:</h4>
              <ul>
                <li>Торопиться с решениями</li>
                <li>Начинать что-то новое</li>
                <li>Перегружать себя делами</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Days for Tarot */}
      <div className="best-days-section">
        <h2>🎴 Лучшие Дни для Работы с Таро</h2>
        <div className="best-days-grid">
          <div className="best-day-card excellent">
            <div className="best-day-rating">⭐⭐⭐</div>
            <h3>Отличные Дни</h3>
            <ul>
              <li><strong>Полнолуние</strong> - максимальная точность раскладов</li>
              <li><strong>Понедельник</strong> - день Луны, усиливает интуицию</li>
              <li><strong>Среда</strong> - день Меркурия, помогает коммуникации с картами</li>
            </ul>
          </div>

          <div className="best-day-card good">
            <div className="best-day-rating">⭐⭐</div>
            <h3>Хорошие Дни</h3>
            <ul>
              <li><strong>Новолуние</strong> - расклады на новые начинания</li>
              <li><strong>Растущая Луна</strong> - вопросы о росте и развитии</li>
              <li><strong>Пятница</strong> - день Венеры, расклады на любовь</li>
            </ul>
          </div>

          <div className="best-day-card moderate">
            <div className="best-day-rating">⭐</div>
            <h3>Нейтральные Дни</h3>
            <ul>
              <li><strong>Убывающая Луна</strong> - вопросы об избавлении</li>
              <li><strong>Вторник</strong> - день Марса, расклады на действия</li>
              <li><strong>Четверг</strong> - день Юпитера, финансовые вопросы</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Practical Tips */}
      <div className="tips-section">
        <h2>💫 Практические Советы</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-emoji">🕯️</span>
            <h4>Подготовка к раскладу</h4>
            <p>В дни полнолуния зажгите белую свечу и проведите очищение колоды дымом благовоний.</p>
          </div>

          <div className="tip-card">
            <span className="tip-emoji">🌙</span>
            <h4>Зарядка карт</h4>
            <p>Оставьте колоду под светом полной луны на ночь для зарядки энергией.</p>
          </div>

          <div className="tip-card">
            <span className="tip-emoji">📖</span>
            <h4>Ведение дневника</h4>
            <p>Записывайте расклады в полнолуние - они будут самыми точными для отслеживания.</p>
          </div>

          <div className="tip-card">
            <span className="tip-emoji">🧘</span>
            <h4>Медитация</h4>
            <p>Перед раскладом в полнолуние медитируйте 5-10 минут для усиления интуиции.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDaysWord(days) {
  if (days === 1) return 'день';
  if (days >= 2 && days <= 4) return 'дня';
  return 'дней';
}

export default MoonCalendarPage;
