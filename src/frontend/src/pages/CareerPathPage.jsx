import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import SpreadEngine from '../components/SpreadEngine'
import './CareerPathPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function CareerPathPage() {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [spread, setSpread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [careerGoal, setCareerGoal] = useState('')
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationLoading, setInterpretationLoading] = useState(false)

  useEffect(() => {
    loadSpread()
  }, [])

  const loadSpread = async () => {
    try {
      const response = await axios.get(`${API_URL}/spreads/career-path`)
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
        `${API_URL}/spreads/career-path/interpret`,
        { cards: cards.map(c => ({ name: c.name, cardId: c.cardId, reversed: c.reversed })), question, context: { careerGoal } },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const backendData = response.data.data
      const interpretation = {
        summary: backendData.summary,
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
          `${API_URL}/spreads/career-path/save`,
          { cards, interpretation, question, context: { careerGoal } },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (saveError) {
        console.error('Failed to save:', saveError)
      }
    } catch (error) {
      console.error('Failed to get interpretation:', error)

      const interpretation = {
        summary: `Ваш карьерный путь раскрывается через ${cards.length} карт. ${
          careerGoal ? `Цель: "${careerGoal}". ` : ''
        }${
          question ? `Вопрос: "${question}". ` : ''
        }Карты показывают текущее состояние, ваши сильные стороны и направление развития.`,
        positions: cards.map((card, idx) => ({
          positionName: spread.positions[idx]?.name || `Позиция ${idx + 1}`,
          card: card.name,
          reversed: card.reversed,
          keywords: card.keywords,
          arcana: card.arcana,
          meaning: card.reversed
            ? `Перевёрнутая карта в карьере: ${card.keywords?.slice(0, 2).join(', ')}. Обратите внимание на эти аспекты.`
            : `Прямая карта означает: ${card.keywords?.slice(0, 2).join(', ')}. Используйте эти качества для развития.`
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
    <div className="career-path-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>💼 Карьерный Путь</h1>
      </header>

      <main className="career-content">
        {!interpretation && (
          <div className="question-section">
            <h3>О Вашей Карьере</h3>
            <p className="question-hint">
              Этот расклад помогает понять текущее положение в карьере, ваши таланты,
              препятствия и возможности для роста.
            </p>

            <div className="form-group">
              <label>Ваша карьерная цель (опционально):</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="Например: Стать руководителем отдела"
                className="career-input"
              />
            </div>

            <div className="form-group">
              <label>Ваш вопрос о карьере:</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Например: Как мне продвинуться по карьерной лестнице?"
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
            <div className="loading-spinner">💼</div>
            <p>Создаём анализ карьерного пути...</p>
            <p className="loading-hint">Карты анализируют ваш профессиональный путь...</p>
          </div>
        )}

        {interpretation && !interpretationLoading && (
          <div className="interpretation-results">
            <h2>🌟 Интерпретация Карьерного Пути</h2>

            <div className="interpretation-summary">
              <h3>Общая Картина:</h3>
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

            <div className="career-advice">
              <h3>💡 Рекомендации:</h3>
              <p>
                Карьера - это путешествие, а не пункт назначения. Используйте свои таланты,
                работайте над препятствиями и будьте открыты возможностям. Каждый шаг важен.
              </p>
            </div>

            <button
              onClick={() => {
                setInterpretation(null)
                setQuestion('')
                setCareerGoal('')
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

export default CareerPathPage
