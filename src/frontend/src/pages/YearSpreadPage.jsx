import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { YearAheadSEO } from '../components/SEO'
import './YearSpreadPage.css'

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const SAMPLE_CARDS = [
  { name: 'Шут', suit: 'Major Arcana', number: 0, description: 'Новые начинания, спонтанность' },
  { name: 'Маг', suit: 'Major Arcana', number: 1, description: 'Мастерство, проявление' },
  { name: 'Верховная Жрица', suit: 'Major Arcana', number: 2, description: 'Интуиция, тайны' },
  { name: 'Императрица', suit: 'Major Arcana', number: 3, description: 'Изобилие, творчество' },
  { name: 'Император', suit: 'Major Arcana', number: 4, description: 'Структура, авторитет' },
  { name: 'Иерофант', suit: 'Major Arcana', number: 5, description: 'Традиции, обучение' },
  { name: 'Влюблённые', suit: 'Major Arcana', number: 6, description: 'Выбор, гармония' },
  { name: 'Колесница', suit: 'Major Arcana', number: 7, description: 'Победа, движение' },
  { name: 'Сила', suit: 'Major Arcana', number: 8, description: 'Храбрость, внутренняя сила' },
  { name: 'Отшельник', suit: 'Major Arcana', number: 9, description: 'Мудрость, размышление' },
  { name: 'Колесо Фортуны', suit: 'Major Arcana', number: 10, description: 'Судьба, циклы' },
  { name: 'Справедливость', suit: 'Major Arcana', number: 11, description: 'Баланс, карма' }
]

function YearSpreadPage() {
  const navigate = useNavigate()
  const { user: _user } = useSelector((state) => state.auth)
  const [cards, setCards] = useState([])
  const [currentYear] = useState(new Date().getFullYear())
  const [isRevealed, setIsRevealed] = useState(false)

  const generateSpread = () => {
    // Генерируем случайный расклад из 12 карт
    const shuffled = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5)
    setCards(shuffled.slice(0, 12))
    setIsRevealed(true)
  }

  const resetSpread = () => {
    setCards([])
    setIsRevealed(false)
  }

  return (
    <div className="year-spread-page">
      <YearAheadSEO />
      <div className="year-spread-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🗓️ Расклад на Год {currentYear}</h1>
        <p className="year-spread-subtitle">
          12 карт - каждая раскрывает энергию одного месяца года
        </p>
      </div>

      {!isRevealed ? (
        <div className="year-spread-intro">
          <div className="intro-card">
            <div className="intro-icon">🔮</div>
            <h2>Прогноз на {currentYear} год</h2>
            <p>
              Этот расклад покажет вам энергии каждого месяца предстоящего года.
              Узнайте, что приготовила для вас судьба!
            </p>
            <ul className="intro-features">
              <li>✨ 12 карт Таро - по одной на каждый месяц</li>
              <li>🎯 Подробная интерпретация для каждого периода</li>
              <li>📊 Общий анализ года</li>
              <li>💫 Советы и рекомендации</li>
            </ul>
            <button onClick={generateSpread} className="btn-generate-year">
              Вытянуть Карты на {currentYear}
            </button>
          </div>
        </div>
      ) : (
        <div className="year-spread-content">
          <div className="year-summary">
            <h3>📅 Ваш Год {currentYear}</h3>
            <p>Карты вытянуты! Изучите прогноз для каждого месяца</p>
          </div>

          <div className="months-grid">
            {cards.map((card, index) => (
              <div key={index} className="month-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="month-header">
                  <span className="month-number">{index + 1}</span>
                  <h4>{MONTHS[index]}</h4>
                </div>
                <div className="card-display">
                  <div className="card-icon">🎴</div>
                  <h5>{card.name}</h5>
                  <p className="card-suit">{card.suit}</p>
                </div>
                <div className="card-interpretation">
                  <p><strong>Энергия месяца:</strong></p>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="year-insights">
            <h3>💡 Общий Прогноз на {currentYear}</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🌟 Ключевые Периоды</h4>
                <p>
                  Обратите особое внимание на {MONTHS[2]}, {MONTHS[5]} и {MONTHS[8]} -
                  это будут поворотные месяцы года.
                </p>
              </div>
              <div className="insight-card">
                <h4>⚡ Вызовы</h4>
                <p>
                  Будьте готовы к переменам в первой половине года.
                  Гибкость и адаптивность будут вашими союзниками.
                </p>
              </div>
              <div className="insight-card">
                <h4>✨ Возможности</h4>
                <p>
                  Вторая половина года принесёт новые возможности для роста
                  и самореализации. Не бойтесь действовать!
                </p>
              </div>
            </div>
          </div>

          <div className="year-actions">
            <button onClick={resetSpread} className="btn-reset">
              🔄 Новый Расклад
            </button>
            <button onClick={() => window.print()} className="btn-print">
              🖨️ Сохранить/Печать
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default YearSpreadPage
