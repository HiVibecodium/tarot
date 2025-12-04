import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FinanceSEO } from '../components/SEO'
import './FinanceSpreadPage.css'

const SAMPLE_CARDS = [
  { name: 'Туз Пентаклей', description: 'Новая финансовая возможность' },
  { name: 'Десятка Пентаклей', description: 'Материальное благополучие' },
  { name: 'Четвёрка Пентаклей', description: 'Финансовая стабильность' },
  { name: 'Девятка Пентаклей', description: 'Достижение изобилия' },
  { name: 'Король Пентаклей', description: 'Финансовое мастерство' },
  { name: 'Колесо Фортуны', description: 'Удача в деньгах' },
  { name: 'Солнце', description: 'Успех и процветание' },
  { name: 'Звезда', description: 'Надежда на улучшение' },
  { name: 'Императрица', description: 'Изобилие и рост' },
  { name: 'Император', description: 'Структура в финансах' }
]

const POSITIONS = [
  { id: 1, title: 'Текущая ситуация', subtitle: 'Где вы сейчас финансово', icon: '💰' },
  { id: 2, title: 'Источники дохода', subtitle: 'Откуда приходят деньги', icon: '💵' },
  { id: 3, title: 'Расходы', subtitle: 'Куда уходят деньги', icon: '💸' },
  { id: 4, title: 'Препятствия', subtitle: 'Что блокирует изобилие', icon: '⚠️' },
  { id: 5, title: 'Возможности', subtitle: 'Где искать рост', icon: '✨' },
  { id: 6, title: 'Совет', subtitle: 'Как улучшить финансы', icon: '🎯' }
]

function FinanceSpreadPage() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [financialGoal, setFinancialGoal] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)

  const generateSpread = () => {
    if (!financialGoal.trim()) {
      alert('Пожалуйста, укажите вашу финансовую цель')
      return
    }

    const shuffled = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5)
    const drawnCards = shuffled.slice(0, 6).map((card, index) => ({
      ...card,
      position: POSITIONS[index]
    }))
    setCards(drawnCards)
    setIsRevealed(true)
  }

  const reset = () => {
    setCards([])
    setFinancialGoal('')
    setIsRevealed(false)
  }

  return (
    <div className="finance-spread-page">
      <FinanceSEO />
      <div className="finance-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>💰 Финансовый Расклад</h1>
        <p className="subtitle">Анализ вашей денежной ситуации и возможностей</p>
      </div>

      {!isRevealed ? (
        <div className="finance-intro">
          <div className="intro-card">
            <div className="intro-icon">💎</div>
            <h2>Расклад на Финансы и Изобилие</h2>
            <p>
              Получите ясность о вашей финансовой ситуации, найдите новые источники дохода
              и узнайте, как привлечь больше изобилия в вашу жизнь.
            </p>

            <div className="goal-input-section">
              <label htmlFor="financial-goal">Ваша финансовая цель:</label>
              <input
                id="financial-goal"
                type="text"
                value={financialGoal}
                onChange={(e) => setFinancialGoal(e.target.value)}
                placeholder="Например: Накопить на квартиру, увеличить доход, выйти из долгов"
                className="goal-input"
              />
            </div>

            <div className="spread-info">
              <h4>💎 6 карт раскроют:</h4>
              <div className="info-grid">
                {POSITIONS.map(pos => (
                  <div key={pos.id} className="info-item">
                    <span className="info-icon">{pos.icon}</span>
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
        <div className="finance-content">
          <div className="spread-title">
            <h3>💰 Финансовый Расклад</h3>
            <p>Цель: {financialGoal}</p>
          </div>

          <div className="cards-grid-finance">
            {cards.map((card, index) => (
              <div key={index} className="finance-card" style={{ animationDelay: `${index * 0.12}s` }}>
                <div className="position-header">
                  <span className="position-icon-large">{card.position.icon}</span>
                  <div className="position-info">
                    <div className="position-number">Карта {index + 1}</div>
                    <h4>{card.position.title}</h4>
                    <p>{card.position.subtitle}</p>
                  </div>
                </div>
                <div className="card-visual">
                  <div className="card-icon">🎴</div>
                  <h5>{card.name}</h5>
                  <p className="card-meaning">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="finance-analysis">
            <h3>📊 Финансовый Анализ</h3>
            <div className="analysis-grid">
              <div className="analysis-card income">
                <h4>💚 Перспективы Дохода</h4>
                <p>
                  Карты показывают потенциал для роста. Обратите внимание на новые возможности
                  и не бойтесь инвестировать в развитие навыков.
                </p>
              </div>
              <div className="analysis-card expenses">
                <h4>💙 Управление Расходами</h4>
                <p>
                  Важно структурировать траты. Создайте бюджет и придерживайтесь его.
                  Избегайте импульсивных покупок.
                </p>
              </div>
              <div className="analysis-card action">
                <h4>🎯 План Действий</h4>
                <p>
                  1. Оцените текущие источники дохода<br/>
                  2. Найдите области для экономии<br/>
                  3. Изучите новые возможности заработка<br/>
                  4. Инвестируйте в себя
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

export default FinanceSpreadPage
