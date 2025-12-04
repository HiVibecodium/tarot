import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BirthdaySEO } from '../components/SEO'
import './BirthdaySpreadPage.css'

const SAMPLE_CARDS = [
  { name: 'Солнце', description: 'Радость и успех' },
  { name: 'Звезда', description: 'Надежда и вдохновение' },
  { name: 'Колесо Фортуны', description: 'Циклы и судьба' },
  { name: 'Сила', description: 'Внутренняя мощь' },
  { name: 'Маг', description: 'Проявление желаний' },
  { name: 'Императрица', description: 'Творчество и рост' },
  { name: 'Шут', description: 'Новые начинания' },
  { name: 'Мир', description: 'Завершение и достижение' },
  { name: 'Справедливость', description: 'Баланс и карма' },
  { name: 'Туз Жезлов', description: 'Новая энергия' }
]

const POSITIONS = [
  { id: 1, title: 'Главная Тема Года', subtitle: 'Ключевая энергия личного года', icon: '🎂' },
  { id: 2, title: 'Личный Рост', subtitle: 'Как вы вырастете', icon: '🌱' },
  { id: 3, title: 'Вызовы', subtitle: 'Что нужно преодолеть', icon: '⚡' },
  { id: 4, title: 'Дары', subtitle: 'Что получите в этом году', icon: '🎁' },
  { id: 5, title: 'Совет', subtitle: 'Как прожить год наилучшим образом', icon: '💫' }
]

function BirthdaySpreadPage() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const [personalYear, setPersonalYear] = useState(0)

  const calculatePersonalYear = () => {
    const currentYear = new Date().getFullYear()
    const month = parseInt(birthMonth) || 1
    const day = parseInt(birthDay) || 1

    // Простой расчёт персонального года (нумерология)
    const sum = day + month + currentYear
    const reduced = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0)
    return reduced > 9 ? reduced.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) : reduced
  }

  const generateSpread = () => {
    if (!birthMonth || !birthDay) {
      alert('Пожалуйста, укажите дату рождения')
      return
    }

    const year = calculatePersonalYear()
    setPersonalYear(year)

    const shuffled = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5)
    const drawnCards = shuffled.slice(0, 5).map((card, index) => ({
      ...card,
      position: POSITIONS[index]
    }))
    setCards(drawnCards)
    setIsRevealed(true)
  }

  const reset = () => {
    setCards([])
    setBirthMonth('')
    setBirthDay('')
    setIsRevealed(false)
    setPersonalYear(0)
  }

  return (
    <div className="birthday-spread-page">
      <BirthdaySEO />
      <div className="birthday-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🎂 Расклад на День Рождения</h1>
        <p className="subtitle">Прогноз на ваш личный год от ДР до ДР</p>
      </div>

      {!isRevealed ? (
        <div className="birthday-intro">
          <div className="intro-card">
            <div className="intro-icon">🎉</div>
            <h2>С Днём Рождения!</h2>
            <p>
              Узнайте, что приготовил для вас новый личный год.
              Этот расклад покажет главные темы, вызовы и дары вашего года.
            </p>

            <div className="birthday-input-section">
              <label>Ваша дата рождения:</label>
              <div className="date-inputs">
                <input
                  type="number"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  placeholder="День"
                  min="1"
                  max="31"
                  className="date-input"
                />
                <input
                  type="number"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  placeholder="Месяц"
                  min="1"
                  max="12"
                  className="date-input"
                />
              </div>
              <p className="date-help">Например: 15 марта = День: 15, Месяц: 3</p>
            </div>

            <div className="positions-preview">
              <h4>🎴 5 карт раскроют:</h4>
              <div className="preview-list">
                {POSITIONS.map(pos => (
                  <div key={pos.id} className="preview-item">
                    <span className="preview-icon">{pos.icon}</span>
                    <div>
                      <strong>{pos.title}</strong>
                      <p>{pos.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={generateSpread} className="btn-generate">
              Вытянуть Карты на Новый Год
            </button>
          </div>
        </div>
      ) : (
        <div className="birthday-content">
          <div className="personal-year-banner">
            <h3>🎂 Ваш Личный Год: {personalYear}</h3>
            <p>Нумерологический год определяет общую энергию периода</p>
          </div>

          <div className="cards-grid-birthday">
            {cards.map((card, index) => (
              <div key={index} className="birthday-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card-position-header">
                  <span className="position-icon-xl">{card.position.icon}</span>
                  <div className="position-details">
                    <div className="card-number">Карта {index + 1}</div>
                    <h4>{card.position.title}</h4>
                    <p>{card.position.subtitle}</p>
                  </div>
                </div>
                <div className="card-content-birthday">
                  <div className="card-icon-xl">🎴</div>
                  <h5>{card.name}</h5>
                  <p className="card-interpretation">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="year-wisdom">
            <h3>✨ Мудрость на Новый Год</h3>
            <div className="wisdom-grid">
              <div className="wisdom-card focus">
                <h4>🎯 Фокус Года</h4>
                <p>
                  Этот год призывает вас сосредоточиться на личном развитии
                  и реализации накопленного опыта.
                </p>
              </div>
              <div className="wisdom-card celebration">
                <h4>🎊 Что Праздновать</h4>
                <p>
                  Отмечайте каждую маленькую победу. Год принесёт много
                  причин для радости и благодарности.
                </p>
              </div>
              <div className="wisdom-card transformation">
                <h4>🦋 Трансформация</h4>
                <p>
                  Готовьтесь к позитивным переменам. Старое уходит,
                  освобождая место для нового и лучшего.
                </p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={reset} className="btn-reset">
              🔄 Новый Расклад
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-home">
              🏠 На Главную
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BirthdaySpreadPage
