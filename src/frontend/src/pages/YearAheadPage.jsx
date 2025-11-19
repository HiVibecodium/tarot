import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import SpreadEngine from '../components/SpreadEngine'
import './YearAheadPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function YearAheadPage() {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [spread, setSpread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [yearGoal, setYearGoal] = useState('')
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationLoading, setInterpretationLoading] = useState(false)

  useEffect(() => {
    loadSpread()
  }, [])

  const loadSpread = async () => {
    try {
      const response = await axios.get(`${API_URL}/spreads/year-ahead`)
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
        `${API_URL}/spreads/year-ahead/interpret`,
        { cards: cards.map(c => ({ name: c.name, cardId: c.cardId, reversed: c.reversed })), question: '', context: { yearGoal } },
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
          `${API_URL}/spreads/year-ahead/save`,
          { cards, interpretation, question: '', context: { yearGoal } },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (saveError) {
        console.error('Failed to save:', saveError)
      }
    } catch (error) {
      console.error('Failed to get interpretation:', error)

      const interpretation = {
        summary: `Ваш год раскрывается через ${cards.length} карт - по одной на каждый месяц плюс итоговая карта. ${
          yearGoal ? `Цель на год: "${yearGoal}". ` : ''
        }Карты показывают энергию и темы каждого месяца, помогая вам планировать и готовиться.`,
        positions: cards.map((card, idx) => ({
          positionName: spread.positions[idx]?.name || `Месяц ${idx + 1}`,
          card: card.name,
          reversed: card.reversed,
          keywords: card.keywords,
          arcana: card.arcana,
          meaning: card.reversed
            ? `${spread.positions[idx]?.name}: Перевёрнутая карта указывает на ${card.keywords?.slice(0, 2).join(', ')}. Период для осторожности.`
            : `${spread.positions[idx]?.name}: ${card.keywords?.slice(0, 2).join(', ')}. Благоприятная энергия месяца.`
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
    <div className="year-ahead-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🎆 Путь Года</h1>
      </header>

      <main className="year-content">
        {!interpretation && (
          <div className="question-section">
            <h3>Ваш Год Вперёд</h3>
            <p className="question-hint">
              Этот расклад показывает энергию каждого месяца предстоящего года.
              13 карт: 12 месяцев + итоговая карта года.
            </p>

            <div className="form-group">
              <label>Ваша главная цель на год (опционально):</label>
              <input
                type="text"
                value={yearGoal}
                onChange={(e) => setYearGoal(e.target.value)}
                placeholder="Например: Достичь гармонии в жизни"
                className="year-input"
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
            <div className="loading-spinner">🎆</div>
            <p>Создаём прогноз на год...</p>
            <p className="loading-hint">Карты раскрывают энергию каждого месяца...</p>
          </div>
        )}

        {interpretation && !interpretationLoading && (
          <div className="interpretation-results">
            <h2>🌟 Прогноз на Год</h2>

            <div className="interpretation-summary">
              <h3>Общая Энергия Года:</h3>
              <p>{interpretation.summary}</p>
            </div>

            <div className="year-timeline">
              {interpretation.positions.map((pos, idx) => (
                <div key={idx} className={`month-interpretation ${idx === 12 ? 'year-summary' : ''}`}>
                  <div className="month-header">
                    <span className="month-badge">{pos.positionName}</span>
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

            <div className="year-advice">
              <h3>💡 Совет на Год:</h3>
              <p>
                Год - это цикл возможностей. Каждый месяц несёт свою энергию. Используйте
                благоприятные периоды для действий, а сложные - для обучения и роста.
                Помните: вы творец своей судьбы.
              </p>
            </div>

            <button
              onClick={() => {
                setInterpretation(null)
                setYearGoal('')
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

export default YearAheadPage
