import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import TarotCard from '../components/TarotCard'
import { ThreeCardsSkeleton } from '../components/skeletons/LoadingSkeletons'
import ErrorDisplay from '../components/ErrorDisplay'
import { DecisionSEO } from '../components/SEO'
import './DecisionPage.css'

function DecisionPage() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // Check authentication on mount
  useEffect(() => {
    if (!token) {
      navigate('/login', {
        state: {
          from: '/decision',
          message: 'Пожалуйста, войдите, чтобы задать вопрос'
        }
      })
    }
  }, [token, navigate])

  const [step, setStep] = useState('input') // 'input' | 'drawing' | 'result' | 'outcome'
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [reading, setReading] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [outcome, setOutcome] = useState({
    chosenOption: '',
    wasHelpful: null,
    notes: ''
  })
  const [cardsDrawn, setCardsDrawn] = useState(0)

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 3) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Show drawing animation
    setStep('drawing')
    setCardsDrawn(0)

    // Animate 3 cards being drawn
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setCardsDrawn(i)
    }

    // Now fetch the reading
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        '/readings/decision',
        {
          question,
          options: options.filter(opt => opt.trim() !== '')
        }
      )

      setReading(response.data.data.reading)
      setStep('result')

    } catch (err) {
      console.error('Error generating decision:', err)
      setError(err.response?.data?.error?.message || 'Failed to generate decision analysis')
      setStep('input')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('input')
    setQuestion('')
    setOptions(['', ''])
    setReading(null)
    setError(null)
  }

  // Show loading while checking auth
  if (!token) {
    return null
  }

  return (
    <div className="decision-page">
      <DecisionSEO />

      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🎯 Анализ Решения</h1>
      </header>

      <main className="decision-content">
        {error && <ErrorDisplay error={error} onRetry={() => setError(null)} />}

        {step === 'drawing' && loading && <ThreeCardsSkeleton />}

        {step === 'drawing' && !loading && (
          <div className="three-card-drawing">
            <div className="drawing-title">
              <h2>Вытягиваем карты для вашего решения...</h2>
              <p className="decision-question-small">"{question}"</p>
            </div>

            <div className="three-cards-animation">
              <div className={`card-position ${cardsDrawn >= 1 ? 'drawn' : ''}`}>
                <div className="card-back-draw">🔮</div>
                <span className="position-label">Прошлое</span>
              </div>
              <div className={`card-position ${cardsDrawn >= 2 ? 'drawn' : ''}`}>
                <div className="card-back-draw">🔮</div>
                <span className="position-label">Настоящее</span>
              </div>
              <div className={`card-position ${cardsDrawn >= 3 ? 'drawn' : ''}`}>
                <div className="card-back-draw">🔮</div>
                <span className="position-label">Будущее</span>
              </div>
            </div>

            {loading && (
              <div className="loading-text">
                <div className="spinner-small"></div>
                <p>Формируем интерпретацию...</p>
              </div>
            )}
          </div>
        )}

        {step === 'input' && (
          <div className="decision-input">
            <div className="input-card">
              <h2>Какое решение вы принимаете?</h2>
              <p className="subtitle">Получите совет через расклад на 3 карты</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="question">Ваш Вопрос или Решение:</label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Например: Стоит ли принимать новое предложение о работе?"
                    rows={3}
                    required
                    maxLength={200}
                  />
                  <span className="char-count">{question.length}/200</span>
                </div>

                <div className="form-group">
                  <label>Варианты (Опционально):</label>
                  {options.map((option, index) => (
                    <div key={index} className="option-input">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Вариант ${index + 1}`}
                        maxLength={100}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="btn-remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {options.length < 3 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="btn-add-option"
                    >
                      + Добавить Вариант
                    </button>
                  )}
                </div>

                {error && (
                  <div className="error-message">{error}</div>
                )}

                <button
                  type="submit"
                  className="btn-primary btn-submit"
                  disabled={loading || !question.trim()}
                >
                  {loading ? 'Вытягиваем карты...' : '🔮 Получить Совет'}
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 'result' && reading && (
          <div className="decision-result">
            <div className="result-header">
              <h2>Анализ Вашего Решения</h2>
              <p className="decision-question">"{reading.context.question}"</p>
            </div>

            <div className="cards-spread">
              {reading.cards.map((cardData, index) => (
                <div key={index} className="spread-card">
                  <div className="position-label">{cardData.positionName}</div>
                  <TarotCard
                    card={{
                      ...cardData,
                      name: cardData.cardName,
                      keywords: cardData.keywords,
                      interpretation: cardData.interpretation
                    }}
                    reversed={cardData.reversed}
                    showInterpretation={false}
                  />
                  <div className="card-meaning">
                    <p>{cardData.interpretation}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="combined-analysis">
              <h3>Общий Анализ</h3>
              <div className="analysis-text">
                <p style={{ whiteSpace: 'pre-line' }}>{reading.interpretation.text}</p>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => setStep('outcome')} className="btn-secondary">
                📝 Записать Результат
              </button>
              <button onClick={resetForm} className="btn-primary">
                Новый Анализ
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                Назад
              </button>
            </div>
          </div>
        )}

        {step === 'outcome' && reading && (
          <div className="outcome-tracking">
            <h2>📝 Запишите Результат</h2>
            <p>Что вы решили после расклада?</p>

            <div className="outcome-form">
              <div className="form-group">
                <label>Какой вариант выбрали?</label>
                <select
                  value={outcome.chosenOption}
                  onChange={(e) => setOutcome({ ...outcome, chosenOption: e.target.value })}
                >
                  <option value="">Выберите вариант</option>
                  {reading.context?.options?.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                  <option value="other">Другое решение</option>
                </select>
              </div>

              <div className="form-group">
                <label>Был ли расклад полезен?</label>
                <div className="rating-buttons">
                  <button
                    className={`rating-btn ${outcome.wasHelpful === true ? 'active' : ''}`}
                    onClick={() => setOutcome({ ...outcome, wasHelpful: true })}
                  >
                    👍 Да
                  </button>
                  <button
                    className={`rating-btn ${outcome.wasHelpful === false ? 'active' : ''}`}
                    onClick={() => setOutcome({ ...outcome, wasHelpful: false })}
                  >
                    👎 Нет
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Заметки (опционально)</label>
                <textarea
                  value={outcome.notes}
                  onChange={(e) => setOutcome({ ...outcome, notes: e.target.value })}
                  placeholder="Как всё прошло? Что помогло?"
                  rows={4}
                  maxLength={500}
                />
              </div>

              <div className="outcome-actions">
                <button
                  onClick={async () => {
                    try {
                      await axios.put(
                        `/readings/${reading._id}/feedback`,
                        { userFeedback: outcome }
                      )
                      alert('✅ Результат сохранён!')
                      setStep('result')
                    } catch (err) {
                      alert('Ошибка сохранения')
                    }
                  }}
                  className="btn-primary"
                >
                  Сохранить
                </button>
                <button onClick={() => setStep('result')} className="btn-secondary">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DecisionPage
