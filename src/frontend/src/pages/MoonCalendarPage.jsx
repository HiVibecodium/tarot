import { useState, useEffect } from 'react';
import axios from 'axios';
import MoonPhase from '../components/MoonPhase';
import { MoonCalendarSEO } from '../components/SEO'
import './MoonCalendarPage.css';

const MoonCalendarPage = () => {
  const [calendar, setCalendar] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [nextFullMoon, setNextFullMoon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
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
    </div>
  );
};

function getDaysWord(days) {
  if (days === 1) return 'день';
  if (days >= 2 && days <= 4) return 'дня';
  return 'дней';
}

export default MoonCalendarPage;
