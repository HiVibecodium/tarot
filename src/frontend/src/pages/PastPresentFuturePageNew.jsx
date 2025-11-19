import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import TarotCard from '../components/TarotCard'
import ShareButtons from '../components/ShareButtons'
import './PastPresentFuturePage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const POSITIONS = [
  { id: 'past', name: 'Прошлое', emoji: '⏮️', description: 'Что привело к текущей ситуации', color: '#ff9800' },
  { id: 'present', name: 'Настоящее', emoji: '⏸️', description: 'Что происходит сейчас', color: '#4caf50' },
  { id: 'future', name: 'Будущее', emoji: '⏭️', description: 'Куда всё движется', color: '#2196f3' }
]

function PastPresentFuturePage() {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [step, setStep] = useState('intro') // intro, drawing, result
  const [cards, setCards] = useState([])
  const [allCards, setAllCards] = useState([])
  const [currentPosition, setCurrentPosition] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Загружаем карты при старте
  const loadCards = async () => {
    try {
      const response = await axios.get(`${API_URL}/cards`)
      const shuffled = response.data.data.sort(() => Math.random() - 0.5)
      setAllCards(shuffled)
    } catch (error) {
      console.error('Failed to load cards:', error)
    }
  }

  const startReading = async () => {
    await loadCards()
    setStep('drawing')
    setCurrentPosition(0)
  }

  const drawCard = async () => {
    if (currentPosition >= 3) return

    setLoading(true)

    // Имитация вытягивания карты
    await new Promise(resolve => setTimeout(resolve, 800))

    const card = allCards[currentPosition]
    const newCards = [...cards, card]
    setCards(newCards)

    if (currentPosition === 2) {
      // Все 3 карты вытянуты - получаем интерпретацию
      await getInterpretation(newCards)
    } else {
      setCurrentPosition(currentPosition + 1)
    }

    setLoading(false)
  }

  const getInterpretation = async (drawnCards) => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/spreads/past-present-future/interpret`,
        {
          cards: drawnCards.map(c => ({ name: c.name, cardId: c._id, reversed: false })),
          question: '',
          context: {}
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setResult(response.data.data)
      setStep('result')

      // Сохраняем
      try {
        await axios.post(
          `${API_URL}/spreads/past-present-future/save`,
          { cards: drawnCards, interpretation: response.data.data },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.error('Save error:', err)
      }
    } catch (error) {
      console.error('Interpretation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetReading = () => {
    setStep('intro')
    setCards([])
    setCurrentPosition(0)
    setResult(null)
  }

  return (
    <div className="ppf-page-new">
      <header className="ppf-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад к Dashboard
        </button>
        <h1>⏳ Прошлое - Настоящее - Будущее</h1>
      </header>

      <main className="ppf-main">
        {/* Intro Screen */}
        {step === 'intro' && (
          <div className="ppf-intro">
            <div className="intro-card">
              <div className="intro-icon">⏳</div>
              <h2>Временная Линия Вашей Жизни</h2>
              <p className="intro-description">
                Три карты раскроют вашу историю: откуда вы пришли, где находитесь сейчас, и куда движетесь.
              </p>

              <div className="positions-preview">
                {POSITIONS.map(pos => (
                  <div key={pos.id} className="position-preview" style={{ borderColor: pos.color }}>
                    <div className="preview-emoji">{pos.emoji}</div>
                    <div className="preview-name">{pos.name}</div>
                    <div className="preview-desc">{pos.description}</div>
                  </div>
                ))}
              </div>

              <button onClick={startReading} className="btn-start-spread">
                🔮 Начать Расклад
              </button>
            </div>
          </div>
        )}

        {/* Drawing Screen */}
        {step === 'drawing' && (
          <div className="ppf-drawing">
            <div className="drawing-progress">
              <div className="progress-steps">
                {POSITIONS.map((pos, idx) => (
                  <div
                    key={pos.id}
                    className={`progress-step ${idx < currentPosition ? 'completed' : ''} ${idx === currentPosition ? 'active' : ''}`}
                  >
                    <div className="step-circle" style={{ background: idx <= currentPosition ? pos.color : '#ccc' }}>
                      {idx < currentPosition ? '✓' : pos.emoji}
                    </div>
                    <div className="step-name">{pos.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {currentPosition < 3 && (
              <div className="current-draw">
                <div className="draw-instruction">
                  <h3 style={{ color: POSITIONS[currentPosition].color }}>
                    {POSITIONS[currentPosition].emoji} {POSITIONS[currentPosition].name}
                  </h3>
                  <p>{POSITIONS[currentPosition].description}</p>
                </div>

                <div className="card-deck-visual">
                  <div className="deck-card">🎴</div>
                  <div className="deck-card">🎴</div>
                  <div className="deck-card">🎴</div>
                </div>

                <button
                  onClick={drawCard}
                  disabled={loading}
                  className="btn-draw"
                  style={{ background: POSITIONS[currentPosition].color }}
                >
                  {loading ? '⏳ Вытягиваем...' : '✨ Вытянуть Карту'}
                </button>
              </div>
            )}

            {cards.length > 0 && (
              <div className="drawn-cards-preview">
                <h4>Вытянутые Карты:</h4>
                <div className="cards-row">
                  {cards.map((card, idx) => (
                    <div key={idx} className="mini-card">
                      <div className="mini-card-name">{card.name}</div>
                      <div className="mini-card-position">{POSITIONS[idx].name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {step === 'result' && result && (
          <div className="ppf-results">
            <h2 className="results-title">🌟 Ваша Временная Линия</h2>

            <div className="summary-card">
              <h3>Общая Картина</h3>
              <p>{result.summary}</p>
            </div>

            <div className="timeline-grid">
              {result.positions.map((position, idx) => (
                <div key={idx} className="timeline-result-card" style={{ borderLeftColor: POSITIONS[idx].color }}>
                  <div className="timeline-header">
                    <span className="timeline-emoji">{POSITIONS[idx].emoji}</span>
                    <h4>{POSITIONS[idx].name}</h4>
                  </div>

                  <div className="timeline-card-info">
                    <div className="card-name-large">{position.card.name}</div>
                    {position.card.reversed && (
                      <span className="reversed-badge">⚡ Перевёрнута</span>
                    )}
                  </div>

                  <div className="card-keywords-section">
                    {cards[idx]?.keywords?.slice(0, 3).map((kw, i) => (
                      <span key={i} className="timeline-keyword" style={{ borderColor: POSITIONS[idx].color }}>
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="timeline-interpretation">
                    <p>{position.interpretation}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="results-actions">
              <button onClick={() => navigate('/journal')} className="btn-action-result btn-journal">
                📔 Добавить в Дневник
              </button>

              <button onClick={() => navigate('/history')} className="btn-action-result btn-history">
                📖 История Раскладов
              </button>

              <button onClick={resetReading} className="btn-action-result btn-reset">
                🔄 Новый Расклад
              </button>
            </div>

            <ShareButtons reading={{ cards, interpretation: result }} type="spread" />

            <div className="more-readings-cta">
              <h4>Хотите ещё глубже?</h4>
              <div className="cta-buttons">
                <button onClick={() => navigate('/reading/celtic-cross')} className="btn-cta-suggest">
                  🔮 Кельтский Крест (10 карт)
                </button>
                <button onClick={() => navigate('/reading/relationship')} className="btn-cta-suggest">
                  💕 Расклад Отношений (7 карт)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PastPresentFuturePage
