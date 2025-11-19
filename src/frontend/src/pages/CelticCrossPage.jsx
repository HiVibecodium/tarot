import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import SpreadEngine from '../components/SpreadEngine'
import './CelticCrossPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function CelticCrossPage() {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [spread, setSpread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationLoading, setInterpretationLoading] = useState(false)

  useEffect(() => {
    loadSpread()
  }, [])

  const loadSpread = async () => {
    try {
      const response = await axios.get(`${API_URL}/spreads/celtic-cross`)
      setSpread(response.data.data)
    } catch (error) {
      console.error('Failed to load spread:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSpreadComplete = async (cards) => {
    setInterpretationLoading(true)

    try {
      // Call backend API for interpretation
      const response = await axios.post(
        `${API_URL}/spreads/celtic-cross/interpret`,
        {
          cards: cards.map(c => ({
            name: c.name,
            cardId: c.cardId,
            reversed: c.reversed,
            suit: c.suit,
            number: c.number
          })),
          question,
          context: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Transform backend response to component format
      const backendData = response.data.data
      const interpretation = {
        summary: backendData.summary,
        advice: backendData.advice?.join(' ') || '',
        positions: backendData.positions.map((pos, idx) => ({
          positionName: pos.positionName,
          card: pos.card.name,
          reversed: pos.card.reversed,
          keywords: cards[idx]?.keywords || [],
          arcana: cards[idx]?.arcana,
          meaning: pos.interpretation
        }))
      }

      setInterpretation(interpretation)

      // Save to history
      try {
        await axios.post(
          `${API_URL}/spreads/celtic-cross/save`,
          {
            cards,
            interpretation,
            question,
            context: {}
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log('Расклад сохранён в историю')
      } catch (saveError) {
        console.error('Failed to save reading:', saveError)
      }
    } catch (error) {
      console.error('Failed to get interpretation:', error)

      // Fallback to simple interpretation
      const interpretation = {
        summary: `Ваш расклад из ${cards.length} карт раскрывает глубокую картину ситуации. ${
          question ? `Вопрос: "${question}"` : ''
        }`,
        positions: cards.map((card, idx) => ({
          positionName: spread.positions[idx]?.name || `Позиция ${idx + 1}`,
          card: card.name,
          reversed: card.reversed,
          keywords: card.keywords,
          arcana: card.arcana,
          meaning: card.reversed
            ? `Перевёрнутая карта указывает на: ${card.keywords?.slice(0, 2).join(', ')}`
            : `Прямая карта означает: ${card.keywords?.slice(0, 2).join(', ')}`
        }))
      }

      setInterpretation(interpretation)
    } finally {
      setInterpretationLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="celtic-cross-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🔮 Кельтский Крест</h1>
      </header>

      <main className="celtic-content">
        {!interpretation && (
          <div className="question-section">
            <h3>Ваш Вопрос</h3>
            <p className="question-hint">
              Сформулируйте вопрос чётко и конкретно. Кельтский Крест даёт глубокий анализ ситуации.
            </p>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Например: Как мне улучшить отношения с партнёром?"
              className="question-input"
              rows={3}
            />
          </div>
        )}

        {spread && !interpretation && !interpretationLoading && (
          <SpreadEngine
            spread={spread}
            onComplete={handleSpreadComplete}
          />
        )}

        {interpretationLoading && (
          <div className="interpretation-loading">
            <div className="loading-spinner">🔮</div>
            <p>Создаём интерпретацию расклада...</p>
            <p className="loading-hint">Карты раскрывают свои тайны...</p>
          </div>
        )}

        {interpretation && !interpretationLoading && (
          <div className="interpretation-results">
            <h2>🌟 Интерпретация Расклада</h2>
            <div className="interpretation-summary">
              <h3>Общее Значение:</h3>
              <p>{interpretation.summary}</p>
            </div>

            <div className="position-interpretations">
              {interpretation.positions.map((pos, idx) => (
                <div key={idx} className="position-interpretation">
                  <div className="position-header">
                    <span className="position-badge">{pos.positionName}</span>
                    {pos.arcana === 'major' && <span className="arcana-badge">Старший Аркан</span>}
                  </div>
                  <h4>
                    {pos.card}
                    {pos.reversed && <span className="reversed-indicator"> ⚡ Перевёрнута</span>}
                  </h4>
                  <div className="card-keywords-display">
                    {pos.keywords?.map((kw, i) => (
                      <span key={i} className="keyword-tag">{kw}</span>
                    ))}
                  </div>
                  <p>{pos.meaning}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setInterpretation(null)
                setQuestion('')
              }}
              className="btn-primary"
            >
              🔄 Новый Расклад
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default CelticCrossPage
