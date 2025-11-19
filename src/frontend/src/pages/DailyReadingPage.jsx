import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import TarotCard from '../components/TarotCard'
import ShareButtons from '../components/ShareButtons'
import MoodSelector from '../components/MoodSelector'
import VoiceReader from '../components/VoiceReader'
import { DailyReadingSEO } from '../components/SEO'
import { CardSkeleton } from '../components/skeletons/LoadingSkeletons'
import ErrorDisplay from '../components/ErrorDisplay'
import './DailyReadingPage.css'

const getMoodLabel = (mood) => {
  const labels = {
    happy: '😊 Счастлив',
    calm: '😌 Спокоен',
    anxious: '😰 Тревожен',
    sad: '😢 Грустен',
    excited: '🤩 Взволнован',
    confused: '😕 Растерян',
    angry: '😠 Зол',
    hopeful: '🙏 Надеюсь'
  };
  return labels[mood] || mood;
}

function DailyReadingPage() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [reading, setReading] = useState(null)
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [currentMood, setCurrentMood] = useState('')
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [showDrawAnimation, setShowDrawAnimation] = useState(false)
  const [readyToDraw, setReadyToDraw] = useState(false)

  const generateDailyReading = async (mood) => {
    // Show card draw animation first
    setShowDrawAnimation(true)

    // Wait for animation (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        '/readings/daily',
        { mood: mood || currentMood }
      )

      setReading(response.data.data.reading)
      setIsNew(response.data.data.isNew)

      // Set horoscope if available
      if (response.data.data.horoscope) {
        setHoroscope(response.data.data.horoscope)
      }

      // Check if reading already existed
      if (!response.data.data.isNew) {
        setShowMoodSelector(false)
        setReadyToDraw(false)
      }

    } catch (err) {
      console.error('Error generating reading:', err)
      setError(err.response?.data?.error?.message || 'Failed to generate reading')
    } finally {
      setLoading(false)
      setShowDrawAnimation(false)
    }
  }

  // Check if user already has today's reading on page load
  useEffect(() => {
    const checkExistingReading = async () => {
      try {
        const response = await axios.post('/readings/daily', {})

        // If reading already exists, show it
        if (!response.data.data.isNew) {
          setReading(response.data.data.reading)
          setIsNew(false)
        }
      } catch (error) {
        // Ignore error - user will generate new reading
      }
    }

    checkExistingReading()
  }, [])

  return (
    <div className="daily-reading-page">
      <DailyReadingSEO />

      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🔮 Расклад Дня</h1>
      </header>

      <main className="reading-content">
        {/* Убрали навязчивый баннер - пользователь и так видит свою карту */}

        {/* Initial State - Show Mood Selector First */}
        {!reading && !loading && !showDrawAnimation && !error && (
          <div className="draw-card-prompt">
            <div className="prompt-content">
              <div className="tarot-deck-visual">
                <div className="card-back">🔮</div>
                <div className="card-back">🔮</div>
                <div className="card-back">🔮</div>
              </div>
              <h2>Расклад Дня</h2>
              <p>Сначала расскажите о своём настроении - это важно для точного прогноза</p>

              {/* Mood Selector */}
              {!currentMood && (
                <MoodSelector
                  value={currentMood}
                  onChange={(mood) => {
                    setCurrentMood(mood)
                  }}
                  label="Как вы себя чувствуете сегодня?"
                />
              )}

              {currentMood && (
                <div className="mood-feedback">
                  <p>✨ Ваше настроение: {getMoodLabel(currentMood)}</p>
                  <p>Это повлияет на интерпретацию карты!</p>
                  <div className="draw-options">
                    <button onClick={() => generateDailyReading(currentMood)} className="btn-draw-card">
                      🔮 Вытянуть Карту Дня
                    </button>
                    <button
                      onClick={() => navigate('/reading/past-present-future')}
                      className="btn-draw-card btn-secondary-draw"
                      title="Прошлое-Настоящее-Будущее"
                    >
                      🎴 3 Карты (Расширенный)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Drawing Animation */}
        {showDrawAnimation && (
          <div className="card-drawing-animation">
            <div className="drawing-cards">
              <div className="card-stack">
                <div className="card-back animate-draw">🔮</div>
                <div className="card-back">🔮</div>
                <div className="card-back">🔮</div>
              </div>
              <p className="drawing-text">Вытягиваем вашу карту...</p>
              <div className="magic-particles">✨✨✨</div>
            </div>
          </div>
        )}

        {loading && <CardSkeleton />}

        {error && (
          <ErrorDisplay
            error={{ response: { status: 500, data: { error: { message: error }}}}}
            onRetry={() => generateDailyReading()}
            context={{ page: 'daily-reading' }}
          />
        )}

        {reading && !loading && (
          <div className="reading-result">
            <div className="card-display">
              <TarotCard
                card={{
                  ...reading.cards[0],
                  name: reading.cards[0].cardName,
                  keywords: reading.interpretation.keywords,
                  imageUrl: reading.interpretation.cardImageUrl
                }}
                reversed={reading.cards[0].reversed}
                showInterpretation={false}
              />
            </div>

            <div className="reading-details">
              <h2>{reading.interpretation.summary}</h2>

              {/* Voice Reader */}
              <VoiceReader text={reading.interpretation.text} />

              {/* Full interpretation (horoscope-style) */}
              <div className="interpretation-text">
                <p style={{ whiteSpace: 'pre-line' }}>{reading.interpretation.text}</p>
              </div>

              {reading.interpretation.keywords && (
                <div className="keywords-section">
                  <h3>Ключевые Темы:</h3>
                  <div className="keywords-list">
                    {reading.interpretation.keywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-badge">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="reading-meta">
                <span className="meta-item">
                  📅 {new Date(reading.createdAt).toLocaleDateString('ru-RU')}
                </span>
                <span className="meta-item">
                  🕐 {new Date(reading.createdAt).toLocaleTimeString('ru-RU')}
                </span>
              </div>

              {/* Astrology Context (if horoscope available) */}
              {horoscope && horoscope.moonPhase && horoscope.dayEnergy && (
                <div className="horoscope-section">
                  <h3>🌟 Астрологический Контекст Сегодня</h3>

                  <div className="horoscope-grid">
                    <div className="horoscope-card moon-phase">
                      <div className="horoscope-icon">{horoscope.moonPhase.icon || '🌙'}</div>
                      <h4>{horoscope.moonPhase.name || 'Фаза Луны'}</h4>
                      {horoscope.moonPhase.energy && (
                        <p className="horoscope-energy">Энергия: {horoscope.moonPhase.energy}</p>
                      )}
                      {horoscope.moonPhase.advice && (
                        <p className="horoscope-advice">{horoscope.moonPhase.advice}</p>
                      )}
                    </div>

                    <div className="horoscope-card day-energy">
                      <div className="horoscope-icon">⚡</div>
                      <h4>{horoscope.dayEnergy.day || 'День'}</h4>
                      {horoscope.dayEnergy.planet && (
                        <p className="horoscope-planet">Планета: {horoscope.dayEnergy.planet}</p>
                      )}
                      {horoscope.dayEnergy.advice && (
                        <p className="horoscope-advice">{horoscope.dayEnergy.advice}</p>
                      )}
                    </div>
                  </div>

                  {(horoscope.luckyNumbers || horoscope.luckyColors || horoscope.compatibilityToday) && (
                    <div className="lucky-info">
                      {horoscope.luckyNumbers && Array.isArray(horoscope.luckyNumbers) && (
                        <div className="lucky-item">
                          <span className="lucky-label">🍀 Счастливые числа:</span>
                          <span className="lucky-values">{horoscope.luckyNumbers.join(', ')}</span>
                        </div>
                      )}
                      {horoscope.luckyColors && Array.isArray(horoscope.luckyColors) && (
                        <div className="lucky-item">
                          <span className="lucky-label">🎨 Счастливые цвета:</span>
                          <span className="lucky-values">{horoscope.luckyColors.join(', ')}</span>
                        </div>
                      )}
                      {horoscope.compatibilityToday && (
                        <div className="lucky-item">
                          <span className="lucky-label">💕 Гармония с:</span>
                          <span className="lucky-values">{horoscope.compatibilityToday}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {reading.context?.horoscope?.personalizedCard && (
                    <div className="personalized-badge">
                      ✨ Эта карта персонализирована под ваш знак зодиака
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons-row">
                <button
                  onClick={() => navigate(`/journal?reading=${reading._id}`)}
                  className="btn-action btn-journal"
                >
                  📔 Добавить в Дневник
                </button>

                <button
                  onClick={() => navigate('/history')}
                  className="btn-action btn-history"
                >
                  📖 Посмотреть Историю
                </button>
              </div>

              {/* Additional Spreads Suggestion */}
              <div className="more-spreads-section">
                <h4>Хотите углубиться?</h4>
                <p>Попробуйте расширенные расклады для детального анализа</p>
                <div className="spread-suggestions">
                  <button
                    onClick={() => navigate('/reading/past-present-future')}
                    className="btn-spread-suggest"
                  >
                    ⏳ 3 Карты: Прошлое-Настоящее-Будущее
                  </button>
                  <button
                    onClick={() => navigate('/decision')}
                    className="btn-spread-suggest"
                  >
                    💬 Расклад на Вопрос
                  </button>
                  <button
                    onClick={() => navigate('/reading/celtic-cross')}
                    className="btn-spread-suggest btn-premium"
                  >
                    🔮 Кельтский Крест (10 карт)
                  </button>
                </div>
              </div>

              {/* Social Sharing */}
              <ShareButtons reading={reading} type="daily" />

              {/* Daily Limit Notice */}
              <div className="daily-limit-notice">
                <div className="notice-icon-small">ℹ️</div>
                <div className="notice-text">
                  <strong>Один расклад в день</strong>
                  <p>Карта Дня - это священная традиция Таро. Один расклад в день позволяет картам говорить с максимальной точностью. Возвращайтесь завтра за новым посланием!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DailyReadingPage

