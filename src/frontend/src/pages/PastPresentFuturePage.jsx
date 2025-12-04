import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import TarotCard from '../components/TarotCard'
import ShareButtons from '../components/ShareButtons'
import { DecisionSEO } from '../components/SEO'
import './PastPresentFuturePage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const POSITIONS = [
  { id: 'past', name: 'Прошлое', emoji: '⏮️', description: 'Что привело к текущей ситуации', color: '#ff9800' },
  { id: 'present', name: 'Настоящее', emoji: '⏸️', description: 'Что происходит сейчас', color: '#4caf50' },
  { id: 'future', name: 'Будущее', emoji: '⏭️', description: 'Куда всё движется', color: '#2196f3' }
]

// Функция для получения детальной информации о карте
const getCardDetails = (card, position) => {
  const contexts = {
    'past': {
      intro: `Карта ${card.name} в позиции Прошлого раскрывает корни и основы вашего текущего пути.`,
      meaning: `Это показывает события, энергии и уроки из прошлого, которые заложили фундамент для того, где вы находитесь сейчас. Прошлое не определяет будущее, но даёт важный контекст.`,
      whatToExpect: [
        'Понимание причин текущей ситуации',
        'Осознание паттернов и повторений',
        'Уроки, которые нужно было усвоить'
      ],
      recommendations: [
        'Примите прошлый опыт как ценный урок',
        'Отпустите то, что больше не служит вам',
        'Используйте накопленную мудрость'
      ],
      avoid: [
        'Не застревайте в прошлом',
        'Избегайте повторения старых ошибок',
        'Не позволяйте прошлому определять будущее'
      ]
    },
    'present': {
      intro: `${card.name} в позиции Настоящего отражает текущий момент вашей жизни.`,
      meaning: `Это карта показывает активные энергии, вызовы и возможности прямо сейчас. Настоящее - это точка силы, где ваши действия имеют наибольшее влияние на будущее.`,
      whatToExpect: [
        'Текущие вызовы и возможности',
        'Активные энергии в вашей жизни',
        'Центральная тема этого периода'
      ],
      recommendations: [
        'Действуйте осознанно в текущем моменте',
        'Используйте доступные возможности',
        'Будьте полностью присутствующими'
      ],
      avoid: [
        'Не откладывайте важные решения',
        'Избегайте отрицания текущей реальности',
        'Не упускайте момент для действий'
      ]
    },
    'future': {
      intro: `Карта ${card.name} в позиции Будущего указывает потенциальное направление вашего пути.`,
      meaning: `Это не жёсткое предсказание, а показ вероятного развития при сохранении текущего курса. Будущее гибко и формируется вашими текущими выборами и действиями.`,
      whatToExpect: [
        'Вероятное развитие событий',
        'Потенциальные возможности',
        'Энергии, которые будут проявляться'
      ],
      recommendations: [
        'Стремитесь к позитивным аспектам карты',
        'Готовьтесь к указанным изменениям',
        'Оставайтесь гибкими и открытыми'
      ],
      avoid: [
        'Не воспринимайте как абсолютное',
        'Избегайте пассивного ожидания',
        'Не игнорируйте предупреждения карты'
      ]
    }
  }

  return contexts[position]
}

function PastPresentFuturePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)

  const [step, setStep] = useState('checking') // checking, intro, drawing, result, already-done
  const [cards, setCards] = useState([])
  const [allCards, setAllCards] = useState([])
  const [currentPosition, setCurrentPosition] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [todayReading, setTodayReading] = useState(null)

  // При загрузке И при каждом переходе на эту страницу
  useEffect(() => {
    console.log('Page loaded/navigated - checking today reading')
    // Сбрасываем состояние
    setStep('checking')
    setCards([])
    setResult(null)
    setCurrentPosition(0)
    setTodayReading(null)

    // Проверяем сегодняшний расклад
    checkTodayReading()
  }, [location.pathname]) // Срабатывает при изменении URL

  const checkTodayReading = async () => {
    try {
      const today = new Date().toDateString()

      // Сначала проверяем localStorage
      const localReading = localStorage.getItem(`ppf-reading-${today}`)
      if (localReading) {
        console.log('Found today reading in localStorage')
        const savedReading = JSON.parse(localReading)

        // Проверяем формат - если старый, обогащаем данными
        let enrichedResult = savedReading.interpretation
        if (enrichedResult && enrichedResult.positions) {
          enrichedResult.positions = enrichedResult.positions.map((pos, idx) => {
            // Если нет детальных полей - добавляем их
            if (!pos.intro || !pos.meaning) {
              const card = savedReading.cards[idx]
              const details = getCardDetails({name: card.name || card.cardName}, ['past', 'present', 'future'][idx])
              return {
                ...pos,
                ...details
              }
            }
            return pos
          })
        }

        setTodayReading(savedReading)
        setCards(savedReading.cards || [])
        setResult(enrichedResult)
        setStep('result')
        return
      }

      // Функция для обогащения данных
      const getCardDetails = (card, position) => {
        const contexts = {
          'past': {
            intro: `Карта ${card.name} в позиции Прошлого раскрывает корни и основы вашего текущего пути.`,
            meaning: `Это показывает события, энергии и уроки из прошлого, которые заложили фундамент для того, где вы находитесь сейчас.`,
            whatToExpect: ['Понимание причин', 'Осознание паттернов', 'Уроки прошлого'],
            recommendations: ['Примите опыт', 'Отпустите старое', 'Используйте мудрость'],
            avoid: ['Не застревайте', 'Избегайте ошибок', 'Не живите прошлым']
          },
          'present': {
            intro: `${card.name} в позиции Настоящего отражает текущий момент.`,
            meaning: `Активные энергии, вызовы и возможности прямо сейчас.`,
            whatToExpect: ['Текущие вызовы', 'Активные энергии', 'Центральная тема'],
            recommendations: ['Действуйте осознанно', 'Используйте возможности', 'Будьте присутствующими'],
            avoid: ['Не откладывайте', 'Избегайте отрицания', 'Не упускайте момент']
          },
          'future': {
            intro: `Карта ${card.name} в позиции Будущего указывает потенциал.`,
            meaning: `Вероятное развитие при текущем курсе. Будущее гибко.`,
            whatToExpect: ['Вероятное развитие', 'Потенциал', 'Будущие энергии'],
            recommendations: ['Стремитесь к позитиву', 'Готовьтесь', 'Будьте гибкими'],
            avoid: ['Не воспринимайте абсолютно', 'Избегайте пассивности', 'Не игнорируйте знаки']
          }
        }
        return contexts[position]
      }

      // Если нет в localStorage - проверяем сервер
      const response = await axios.get(
        `${API_URL}/readings/history?limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const readings = response.data.data.readings || []

      // Ищем расклад Past-Present-Future за сегодня
      const todayPPF = readings.find(r => {
        const readingDate = new Date(r.createdAt).toDateString()
        return readingDate === today && (r.readingType === 'past-present-future' || r.spreadType === 'past-present-future')
      })

      if (todayPPF) {
        // Уже есть расклад за сегодня - показываем его
        console.log('Found today reading on server')
        setTodayReading(todayPPF)
        setCards(todayPPF.cards || [])
        setResult({
          summary: todayPPF.interpretation?.summary || 'Ваш расклад за сегодня',
          positions: todayPPF.cards?.map((card, idx) => ({
            card: { name: card.name || card.cardName, reversed: card.reversed },
            interpretation: todayPPF.interpretation?.positions?.[idx]?.interpretation || card.meaning || `${POSITIONS[idx].name}: ${card.name}`
          })) || []
        })
        setStep('result')
      } else {
        console.log('No today reading found - showing intro')
        setStep('intro')
      }
    } catch (error) {
      console.error('Check today reading error:', error)
      setStep('intro')
    }
  }

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
    if (todayReading) {
      // Уже есть расклад - предупреждаем
      setStep('already-done')
      return
    }
    await loadCards()
    setStep('drawing')
    setCurrentPosition(0)
  }

  const drawCard = async () => {
    if (currentPosition >= 3) return

    setLoading(true)

    try {
      // Имитация вытягивания карты
      await new Promise(resolve => setTimeout(resolve, 800))

      const card = allCards[currentPosition]
      const newCards = [...cards, card]
      setCards(newCards)

      if (currentPosition === 2) {
        // Все 3 карты вытянуты - получаем интерпретацию
        await getInterpretation(newCards)
        // loading выключится внутри getInterpretation
      } else {
        setCurrentPosition(currentPosition + 1)
        setLoading(false)
      }
    } catch (error) {
      console.error('Draw card error:', error)
      setLoading(false)
    }
  }

  const getInterpretation = async (drawnCards) => {
    setLoading(true)
    console.log('Getting interpretation for cards:', drawnCards.map(c => c.name))

    // Создаём расширенную интерпретацию для каждой позиции
    const getCardDetails = (card, position, positionName) => {
      const contexts = {
        'past': {
          intro: `Карта ${card.name} в позиции Прошлого раскрывает корни и основы вашего текущего пути.`,
          meaning: `Это показывает события, энергии и уроки из прошлого, которые заложили фундамент для того, где вы находитесь сейчас. Прошлое не определяет будущее, но даёт важный контекст.`,
          whatToExpect: [
            'Понимание причин текущей ситуации',
            'Осознание паттернов и повторений',
            'Уроки, которые нужно было усвоить'
          ],
          recommendations: [
            'Примите прошлый опыт как ценный урок',
            'Отпустите то, что больше не служит вам',
            'Используйте накопленную мудрость'
          ],
          avoid: [
            'Не застревайте в прошлом',
            'Избегайте повторения старых ошибок',
            'Не позволяйте прошлому определять будущее'
          ]
        },
        'present': {
          intro: `${card.name} в позиции Настоящего отражает текущий момент вашей жизни.`,
          meaning: `Это карта показывает активные энергии, вызовы и возможности прямо сейчас. Настоящее - это точка силы, где ваши действия имеют наибольшее влияние на будущее.`,
          whatToExpect: [
            'Текущие вызовы и возможности',
            'Активные энергии в вашей жизни',
            'Центральная тема этого периода'
          ],
          recommendations: [
            'Действуйте осознанно в текущем моменте',
            'Используйте доступные возможности',
            'Будьте полностью присутствующими'
          ],
          avoid: [
            'Не откладывайте важные решения',
            'Избегайте отрицания текущей реальности',
            'Не упускайте момент для действий'
          ]
        },
        'future': {
          intro: `Карта ${card.name} в позиции Будущего указывает потенциальное направление вашего пути.`,
          meaning: `Это не жёсткое предсказание, а показ вероятного развития при сохранении текущего курса. Будущее гибко и формируется вашими текущими выборами и действиями.`,
          whatToExpect: [
            'Вероятное развитие событий',
            'Потенциальные возможности',
            'Энергии, которые будут проявляться'
          ],
          recommendations: [
            'Стремитесь к позитивным аспектам карты',
            'Готовьтесь к указанным изменениям',
            'Оставайтесь гибкими и открытыми'
          ],
          avoid: [
            'Не воспринимайте как абсолютное',
            'Избегайте пассивного ожидания',
            'Не игнорируйте предупреждения карты'
          ]
        }
      }

      return contexts[position]
    }

    const fallbackResult = {
      summary: `🌟 ВАША ВРЕМЕННАЯ ЛИНИЯ РАСКРЫТА

Три мощные карты Таро проливают свет на ваш жизненный путь, показывая откуда вы пришли, где находитесь сейчас, и куда движетесь.

═══════════════════════════

🔮 ПРОШЛОЕ: ${drawnCards[0].name}
Основа и корни вашего текущего положения. Эта карта показывает энергии, события и уроки, которые сформировали фундамент вашей текущей ситуации. Прошлое не определяет будущее, но даёт важный контекст для понимания настоящего.

⭐ НАСТОЯЩЕЕ: ${drawnCards[1].name}
Центральная тема вашей жизни в данный момент. ${drawnCards[1].name} показывает активные энергии, текущие вызовы и возможности. Это точка силы - здесь и сейчас вы можете влиять на своё будущее своими выборами и действиями.

✨ БУДУЩЕЕ: ${drawnCards[2].name}
Потенциальное направление развития событий. ${drawnCards[2].name} не предсказывает жёстко определённое будущее, а показывает вероятный путь при сохранении текущего курса. Ваши действия сегодня формируют эту реальность.

═══════════════════════════

💡 ОБЩИЙ СМЫСЛ:
Эти три карты образуют цельную историю вашего пути. ${drawnCards[0].name} из прошлого создал основу, ${drawnCards[1].name} в настоящем даёт возможности для роста, а ${drawnCards[2].name} в будущем показывает потенциал, который раскроется при мудром использовании текущего момента.

🎯 КЛЮЧЕВОЙ ИНСАЙТ:
Ваше прошлое - это опыт и уроки. Настоящее - это сила и возможность. Будущее - это потенциал и надежда. Вместе они показывают, что вы не жертва обстоятельств, а творец своей реальности.`,
      positions: [
        {
          card: { name: drawnCards[0].name, reversed: false },
          ...getCardDetails(drawnCards[0], 'past', POSITIONS[0].name)
        },
        {
          card: { name: drawnCards[1].name, reversed: false },
          ...getCardDetails(drawnCards[1], 'present', POSITIONS[1].name)
        },
        {
          card: { name: drawnCards[2].name, reversed: false },
          ...getCardDetails(drawnCards[2], 'future', POSITIONS[2].name)
        }
      ]
    }

    console.log('Using interpretation:', fallbackResult)
    setResult(fallbackResult)
    setStep('result')
    console.log('Step changed to result')

    setLoading(false)

    // Сохраняем в localStorage как временное решение
    const readingToSave = {
      _id: Date.now().toString(),
      readingType: 'past-present-future',
      cards: drawnCards.map((c, idx) => ({
        cardId: c._id,
        name: c.name,
        cardName: c.name,
        positionName: POSITIONS[idx].name,
        reversed: false
      })),
      interpretation: fallbackResult,
      createdAt: new Date().toISOString()
    }

    const today = new Date().toDateString()
    localStorage.setItem(`ppf-reading-${today}`, JSON.stringify(readingToSave))
    console.log('Reading saved to localStorage')

    // Также пробуем сохранить на сервер (не критично если не сработает)
    try {
      await axios.post(
        `${API_URL}/spreads/past-present-future/save`,
        { cards: drawnCards, interpretation: fallbackResult, question: '', context: {} },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Also saved to server')
    } catch (err) {
      console.log('Server save failed (using localStorage):', err.message)
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
      <DecisionSEO />
      <header className="ppf-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад к Dashboard
        </button>
        <h1>⏳ Прошлое - Настоящее - Будущее</h1>
      </header>

      <main className="ppf-main">
        {/* Checking Screen */}
        {step === 'checking' && (
          <div className="ppf-intro">
            <div className="intro-card">
              <div className="spinner-large">🔮</div>
              <p>Проверяем ваши расклады...</p>
            </div>
          </div>
        )}

        {/* Already Done Screen */}
        {step === 'already-done' && (
          <div className="ppf-intro">
            <div className="intro-card">
              <div className="intro-icon">ℹ️</div>
              <h2>Вы уже сделали этот расклад сегодня</h2>
              <p className="intro-description">
                Один расклад "Прошлое-Настоящее-Будущее" в день - это традиция Таро для точности предсказаний.
              </p>
              <p className="intro-description">
                Ваш сегодняшний расклад сохранён. Посмотреть его можно ниже или в Истории раскладов.
              </p>
              <div className="already-done-actions">
                <button onClick={() => setStep('result')} className="btn-view-today">
                  📖 Посмотреть Сегодняшний Расклад
                </button>
                <button onClick={() => navigate('/history')} className="btn-secondary-action">
                  История Раскладов
                </button>
              </div>
            </div>
          </div>
        )}

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

            {currentPosition < 3 && cards.length < 3 && (
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

            {cards.length === 3 && loading && (
              <div className="creating-interpretation">
                <div className="spinner-large">🔮</div>
                <p className="interp-text">Создаём интерпретацию временной линии...</p>
                <p className="interp-hint">Карты раскрывают ваш путь...</p>
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

            <div className="summary-card-enhanced">
              <div className="summary-header">
                <div className="summary-icon">🌟</div>
                <h3>Общая Картина Вашего Пути</h3>
              </div>

              <div className="summary-intro">
                <p>Три мощные карты Таро проливают свет на ваш жизненный путь, показывая откуда вы пришли, где находитесь сейчас, и куда движетесь.</p>
              </div>

              <div className="cards-overview-grid">
                <div className="overview-card past-overview">
                  <div className="overview-position">
                    <span className="overview-emoji">🔮</span>
                    <span className="overview-label">ПРОШЛОЕ</span>
                  </div>
                  <div className="overview-card-name">{cards[0]?.name}</div>
                  <p className="overview-text">
                    Основа и корни вашего текущего положения. Энергии, события и уроки, которые сформировали фундамент.
                  </p>
                </div>

                <div className="overview-arrow">→</div>

                <div className="overview-card present-overview">
                  <div className="overview-position">
                    <span className="overview-emoji">⭐</span>
                    <span className="overview-label">НАСТОЯЩЕЕ</span>
                  </div>
                  <div className="overview-card-name">{cards[1]?.name}</div>
                  <p className="overview-text">
                    Центральная тема вашей жизни сейчас. Активные энергии, вызовы и возможности. Точка силы.
                  </p>
                </div>

                <div className="overview-arrow">→</div>

                <div className="overview-card future-overview">
                  <div className="overview-position">
                    <span className="overview-emoji">✨</span>
                    <span className="overview-label">БУДУЩЕЕ</span>
                  </div>
                  <div className="overview-card-name">{cards[2]?.name}</div>
                  <p className="overview-text">
                    Потенциальное направление развития. Вероятный путь при сохранении текущего курса.
                  </p>
                </div>
              </div>

              <div className="summary-insights">
                <div className="insight-item">
                  <strong>💡 Общий Смысл:</strong>
                  <p>
                    Эти три карты образуют цельную историю вашего пути. {cards[0]?.name} из прошлого создал основу,
                    {cards[1]?.name} в настоящем даёт возможности для роста, а {cards[2]?.name} в будущем показывает
                    потенциал, который раскроется при мудром использовании текущего момента.
                  </p>
                </div>

                <div className="insight-item key-insight">
                  <strong>🎯 Ключевой Инсайт:</strong>
                  <p>
                    Ваше прошлое - это опыт и уроки. Настоящее - это сила и возможность. Будущее - это потенциал и надежда.
                    Вместе они показывают, что вы не жертва обстоятельств, а творец своей реальности.
                  </p>
                </div>
              </div>
            </div>

            {/* Связь между картами */}
            <div className="cards-connection-section">
              <h3>🔗 Как Карты Связаны Между Собой</h3>

              <div className="connection-flow">
                <div className="connection-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Прошлое → Настоящее</h4>
                    <p>
                      {cards[0]?.name} из прошлого создал условия для появления {cards[1]?.name} в настоящем.
                      События и энергии прошлого не исчезают - они трансформируются в текущую ситуацию.
                    </p>
                  </div>
                </div>

                <div className="connection-arrow">↓</div>

                <div className="connection-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Настоящее → Будущее</h4>
                    <p>
                      {cards[1]?.name} в настоящем прокладывает путь к {cards[2]?.name} в будущем.
                      Ваши текущие действия и выборы определяют, как быстро и гладко этот потенциал раскроется.
                    </p>
                  </div>
                </div>

                <div className="connection-arrow">↓</div>

                <div className="connection-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Полный Цикл</h4>
                    <p>
                      От {cards[0]?.name} через {cards[1]?.name} к {cards[2]?.name} -
                      это ваша эволюция. Каждая карта - важный этап трансформации.
                      Прошлое учит, настоящее действует, будущее вдохновляет.
                    </p>
                  </div>
                </div>
              </div>

              <div className="key-message">
                <div className="message-icon">💫</div>
                <div className="message-content">
                  <h4>Главное Послание Расклада</h4>
                  <p>
                    Ваши карты показывают не предопределённую судьбу, а живой процесс развития.
                    Прошлое дало вам опыт, настоящее даёт возможности, будущее открывает потенциал.
                    Помните: вы - активный участник, а не пассивный наблюдатель своей истории.
                  </p>
                </div>
              </div>
            </div>

            {/* Практические Рекомендации */}
            <div className="practical-advice-section">
              <h3>🎯 Что Делать С Этой Информацией</h3>

              <div className="advice-grid">
                <div className="advice-card advice-today">
                  <div className="advice-icon">📅</div>
                  <h4>Сегодня</h4>
                  <ul>
                    <li>Проанализируйте как {cards[0]?.name} из прошлого влияет на вашу жизнь сейчас</li>
                    <li>Сосредоточьтесь на энергиях {cards[1]?.name} в текущем моменте</li>
                    <li>Начните маленькие шаги к энергиям {cards[2]?.name}</li>
                    <li>Запишите инсайты в дневник</li>
                  </ul>
                </div>

                <div className="advice-card advice-week">
                  <div className="advice-icon">📆</div>
                  <h4>На Этой Неделе</h4>
                  <ul>
                    <li>Отпустите паттерны {cards[0]?.name}, которые больше не служат</li>
                    <li>Активно используйте возможности {cards[1]?.name}</li>
                    <li>Подготовьтесь к переходу к энергиям {cards[2]?.name}</li>
                    <li>Наблюдайте за знаками и синхроничностями</li>
                  </ul>
                </div>

                <div className="advice-card advice-month">
                  <div className="advice-icon">🗓️</div>
                  <h4>В Ближайший Месяц</h4>
                  <ul>
                    <li>Полностью интегрируйте уроки прошлого ({cards[0]?.name})</li>
                    <li>Освойте вызовы настоящего ({cards[1]?.name})</li>
                    <li>Воплотите потенциал будущего ({cards[2]?.name})</li>
                    <li>Пересмотрите расклад через месяц</li>
                  </ul>
                </div>
              </div>

              <div className="action-plan">
                <h4>📋 Ваш План Действий</h4>
                <div className="plan-steps">
                  <div className="plan-step">
                    <strong>ШАГ 1:</strong> Примите и отпустите энергии {cards[0]?.name} из прошлого
                  </div>
                  <div className="plan-step">
                    <strong>ШАГ 2:</strong> Полностью присутствуйте в энергиях {cards[1]?.name} настоящего
                  </div>
                  <div className="plan-step">
                    <strong>ШАГ 3:</strong> Открыто двигайтесь к потенциалу {cards[2]?.name} будущего
                  </div>
                </div>
              </div>
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
                    {cards[idx]?.keywords && Array.isArray(cards[idx].keywords) && cards[idx].keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="timeline-keyword" style={{ borderColor: POSITIONS[idx].color }}>
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Значение конкретной карты */}
                  {cards[idx] && (
                    <div className="specific-card-meaning">
                      <h5>🎴 О Карте {cards[idx].name}:</h5>
                      <p>{cards[idx].meaning || cards[idx].description || 'Эта карта несёт важное послание.'}</p>
                      {cards[idx].keywords && cards[idx].keywords.length > 0 && (
                        <div className="card-themes">
                          <strong>Ключевые темы:</strong>
                          <span> {cards[idx].keywords.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Основное значение позиции */}
                  {position.intro && (
                    <div className="card-intro">
                      <p>{position.intro}</p>
                    </div>
                  )}

                  {position.meaning && (
                    <div className="card-meaning">
                      <h5>🔮 Значение в Позиции "{POSITIONS[idx].name}":</h5>
                      <p>{position.meaning}</p>
                    </div>
                  )}

                  {/* Что ожидать */}
                  {position.whatToExpect && position.whatToExpect.length > 0 && (
                    <div className="what-to-expect">
                      <h5>✨ Что Это Значит:</h5>
                      <ul>
                        {position.whatToExpect.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Рекомендации */}
                  {position.recommendations && position.recommendations.length > 0 && (
                    <div className="recommendations-box">
                      <h5>✅ Рекомендуется:</h5>
                      <ul>
                        {position.recommendations.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Что избегать */}
                  {position.avoid && position.avoid.length > 0 && (
                    <div className="avoid-box">
                      <h5>❌ Не Рекомендуется:</h5>
                      <ul>
                        {position.avoid.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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

              <button onClick={() => navigate('/dashboard')} className="btn-action-result btn-dashboard">
                🏠 Вернуться на Главную
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

            {/* Daily Limit Notice */}
            <div className="daily-limit-notice">
              <div className="notice-icon-small">ℹ️</div>
              <div className="notice-text">
                <strong>Один расклад в день</strong>
                <p>Расклад "Прошлое-Настоящее-Будущее" доступен раз в день для точности предсказаний. Возвращайтесь завтра за новым раскладом!</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PastPresentFuturePage
