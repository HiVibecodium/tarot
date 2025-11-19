import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoveSpreadPage.css'

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

const SAMPLE_CARDS = [
  { name: 'Влюблённые', description: 'Гармония и выбор сердца' },
  { name: 'Двойка Кубков', description: 'Партнёрство и взаимность' },
  { name: 'Туз Кубков', description: 'Новая любовь и эмоции' },
  { name: 'Императрица', description: 'Забота и плодородие' },
  { name: 'Десятка Кубков', description: 'Счастье в отношениях' },
  { name: 'Солнце', description: 'Радость и искренность' },
  { name: 'Звезда', description: 'Надежда и исцеление' },
  { name: 'Четвёрка Жезлов', description: 'Празднование союза' },
  { name: 'Рыцарь Кубков', description: 'Романтика и ухаживание' },
  { name: 'Королева Кубков', description: 'Эмоциональная зрелость' }
]

const POSITIONS = [
  { id: 1, title: 'Вы', subtitle: 'Ваши чувства и состояние', icon: '💫' },
  { id: 2, title: 'Партнёр', subtitle: 'Их чувства и состояние', icon: '💖' },
  { id: 3, title: 'Между вами', subtitle: 'Энергия отношений', icon: '💞' },
  { id: 4, title: 'Препятствия', subtitle: 'Что мешает', icon: '⚠️' },
  { id: 5, title: 'Сильные стороны', subtitle: 'Что помогает', icon: '✨' },
  { id: 6, title: 'Совет', subtitle: 'Что делать', icon: '🎯' },
  { id: 7, title: 'Будущее', subtitle: 'Куда ведут отношения', icon: '🔮' }
]

function LoveSpreadPage() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [partnerName, setPartnerName] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)

  const generateSpread = () => {
    if (!partnerName.trim()) {
      alert('Пожалуйста, укажите имя партнёра или "Без партнёра" для общего расклада')
      return
    }

    const shuffled = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5)
    const drawnCards = shuffled.slice(0, 7).map((card, index) => ({
      ...card,
      position: POSITIONS[index]
    }))
    setCards(drawnCards)
    setIsRevealed(true)
  }

  const reset = () => {
    setCards([])
    setPartnerName('')
    setIsRevealed(false)
  }

  return (
    <div className="love-spread-page">
      <div className="love-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>💕 Расклад на Отношения</h1>
        <p className="subtitle">Глубокий анализ ваших отношений и чувств</p>
      </div>

      {!isRevealed ? (
        <div className="love-intro">
          <div className="intro-card">
            <div className="intro-icon">💝</div>
            <h2>Расклад на Любовь и Отношения</h2>
            <p>
              Этот расклад поможет понять динамику ваших отношений,
              увидеть чувства обеих сторон и получить совет от карт.
            </p>

            <div className="partner-input-section">
              <label htmlFor="partner-name">Имя партнёра (или "Без партнёра"):</label>
              <input
                id="partner-name"
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Например: Александр"
                className="partner-input"
              />
            </div>

            <div className="spread-preview">
              <h4>🎴 Что вы узнаете:</h4>
              <div className="preview-grid">
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
              Вытянуть Карты
            </button>
          </div>
        </div>
      ) : (
        <div className="love-content">
          <div className="spread-title">
            <h3>💕 Расклад для: {partnerName}</h3>
            <p>7 карт раскрывают динамику ваших отношений</p>
          </div>

          <div className="cards-grid-love">
            {cards.map((card, index) => (
              <div key={index} className="love-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="position-badge" style={{ background: `hsl(${index * 50}, 70%, 60%)` }}>
                  <span className="position-icon">{card.position.icon}</span>
                  <span className="position-number">{index + 1}</span>
                </div>
                <div className="position-title">
                  <h4>{card.position.title}</h4>
                  <p>{card.position.subtitle}</p>
                </div>
                <div className="card-display-love">
                  <div className="card-icon-large">🎴</div>
                  <h5>{card.name}</h5>
                  <p className="card-desc">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="love-summary">
            <h3>💫 Общий Анализ Отношений</h3>
            <div className="summary-sections">
              <div className="summary-card positive">
                <h4>✨ Сильные Стороны</h4>
                <p>
                  Ваши отношения обладают глубокой эмоциональной связью.
                  Есть взаимное понимание и готовность работать над союзом.
                </p>
              </div>
              <div className="summary-card challenges">
                <h4>⚡ Области Роста</h4>
                <p>
                  Обратите внимание на коммуникацию и честность.
                  Важно открыто обсуждать чувства и ожидания.
                </p>
              </div>
              <div className="summary-card advice">
                <h4>🎯 Совет от Карт</h4>
                <p>
                  Доверяйте процессу. Любовь требует терпения и понимания.
                  Будьте искренни с собой и партнёром.
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

export default LoveSpreadPage
