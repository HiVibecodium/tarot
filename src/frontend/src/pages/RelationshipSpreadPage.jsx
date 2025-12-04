import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import SpreadEngine from '../components/SpreadEngine'
import { RelationshipSEO } from '../components/SEO'
import './RelationshipSpreadPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function RelationshipSpreadPage() {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [spread, setSpread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [partner, setPartner] = useState('')
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationLoading, setInterpretationLoading] = useState(false)

  useEffect(() => {
    loadSpread()
  }, [])

  const loadSpread = async () => {
    try {
      const response = await axios.get(`${API_URL}/spreads/relationship`)
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
      const response = await axios.post(
        `${API_URL}/spreads/relationship/interpret`,
        {
          cards: cards.map(c => ({
            name: c.name,
            cardId: c.cardId,
            reversed: c.reversed
          })),
          question,
          context: { partner }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const backendData = response.data.data
      const interpretation = {
        summary: backendData.summary,
        positions: backendData.positions.map((pos, idx) => ({
          position: pos.positionName,
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
          `${API_URL}/spreads/relationship/save`,
          { cards, interpretation, question, context: { partner } },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (saveError) {
        console.error('Failed to save:', saveError)
      }
    } catch (error) {
      console.error('Failed to get interpretation:', error)

      // Fallback
      const interpretation = {
        summary: `Ваши отношения ${partner ? `с ${partner}` : ''} раскрываются через ${cards.length} карт. ${
          question ? `Вопрос: "${question}"` : ''
        } Карты показывают динамику, сильные стороны и области роста.`,
        positions: cards.map((card, idx) => ({
          position: spread.positions[idx]?.name || `Позиция ${idx + 1}`,
          card: card.name,
          reversed: card.reversed,
          keywords: card.keywords,
          arcana: card.arcana,
          meaning: card.reversed
            ? `Перевёрнутая карта в отношениях: ${card.keywords?.slice(0, 2).join(', ')}. Требует внимания и работы.`
            : `Прямая карта означает: ${card.keywords?.slice(0, 2).join(', ')}. Позитивная энергия в этом аспекте.`
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
    <div className="relationship-spread-page">
      <RelationshipSEO />
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>💕 Расклад Отношений</h1>
      </header>

      <main className="relationship-content">
        {!interpretation && (
          <div className="question-section">
            <h3>О Ваших Отношениях</h3>
            <p className="question-hint">
              Этот расклад помогает понять динамику отношений, сильные и слабые стороны, и куда они движутся.
            </p>

            <div className="form-group">
              <label>Имя партнёра (опционально):</label>
              <input
                type="text"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                placeholder="Например: Александр"
                className="partner-input"
              />
            </div>

            <div className="form-group">
              <label>Ваш вопрос об отношениях:</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Например: Каково будущее наших отношений?"
                className="question-input"
                rows={3}
              />
            </div>
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
            <div className="loading-spinner">💕</div>
            <p>Создаём интерпретацию отношений...</p>
            <p className="loading-hint">Карты раскрывают динамику ваших отношений...</p>
          </div>
        )}

        {interpretation && !interpretationLoading && (
          <div className="interpretation-results">
            <h2>💖 Интерпретация Отношений</h2>

            <div className="interpretation-summary">
              <h3>Общая Картина:</h3>
              <p>{interpretation.summary}</p>
            </div>

            <div className="relationship-insights">
              {interpretation.positions.map((pos, idx) => (
                <div key={idx} className="position-interpretation">
                  <div className="position-header">
                    <div className="position-badge">{pos.position}</div>
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

            <div className="relationship-advice">
              <h3>💡 Совет:</h3>
              <p>
                Отношения - это танец двух душ. То что показывают карты - не приговор,
                а подсказки для роста. Работайте над указанными областями вместе.
              </p>
            </div>

            <button
              onClick={() => {
                setInterpretation(null)
                setQuestion('')
                setPartner('')
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

export default RelationshipSpreadPage
