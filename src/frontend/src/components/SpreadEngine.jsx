import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import TarotCardPlaceholder from './TarotCardPlaceholder'
import { playCardDrawSound, playCardRevealSound, playSpreadCompleteSound, toggleMute, isSoundMuted } from '../utils/soundEffects'
import './SpreadEngine.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

/**
 * Universal Tarot Spread Engine
 * Works with any spread template from backend
 */
function SpreadEngine({ spread, onComplete, className = '' }) {
  const { token } = useSelector((state) => state.auth)
  const [drawnCards, setDrawnCards] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [availableCards, setAvailableCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastDrawnCard, setLastDrawnCard] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(!isSoundMuted())

  // Load all tarot cards on mount
  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const response = await axios.get(`${API_URL}/cards`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      setAvailableCards(response.data.data || [])
    } catch (error) {
      console.error('Failed to load cards:', error)
      setAvailableCards([])
    } finally {
      setLoading(false)
    }
  }

  const drawCard = (position) => {
    if (drawnCards.find(c => c.position === position.id)) {
      return // Already drawn
    }

    if (availableCards.length === 0) {
      console.error('No cards available')
      return
    }

    setIsDrawing(true)

    // Play card draw sound
    playCardDrawSound()

    // Simulate card draw animation
    setTimeout(() => {
      // Get cards not yet drawn
      const usedCardIds = drawnCards.map(c => c.cardId)
      const remainingCards = availableCards.filter(c => !usedCardIds.includes(c._id))

      if (remainingCards.length === 0) {
        console.error('No cards left in deck')
        setIsDrawing(false)
        return
      }

      // Pick random card
      const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)]
      const isReversed = Math.random() > 0.7

      const drawnCard = {
        position: position.id,
        cardId: randomCard._id,
        name: randomCard.name,
        imageUrl: randomCard.imageUrl,
        reversed: isReversed,
        arcana: randomCard.arcana,
        keywords: isReversed ? randomCard.keywords.reversed : randomCard.keywords.upright
      }

      setDrawnCards([...drawnCards, drawnCard])
      setLastDrawnCard(drawnCard)
      setIsDrawing(false)

      // Play card reveal sound
      playCardRevealSound()

      // Clear last drawn card highlight after animation
      setTimeout(() => setLastDrawnCard(null), 2000)

      // Check if spread complete
      if (drawnCards.length + 1 === spread.cardCount) {
        // Play spread complete sound
        setTimeout(() => playSpreadCompleteSound(), 300)
        onComplete?.([...drawnCards, drawnCard])
      }
    }, 800)
  }

  const resetSpread = () => {
    setDrawnCards([])
  }

  if (loading) {
    return (
      <div className="spread-engine-loading">
        <div className="loading-spinner">🔮</div>
        <p>Загрузка колоды Таро...</p>
      </div>
    )
  }

  return (
    <div className={`spread-engine ${className}`}>
      {/* Spread Header */}
      <div className="spread-header">
        <h2>{spread.name}</h2>
        <p className="spread-description">{spread.description}</p>
        <div className="spread-meta">
          <span className="spread-cards">🎴 {spread.cardCount} карт</span>
          <span className="spread-time">⏱️ {spread.estimatedTime}</span>
          <span className={`spread-difficulty ${spread.difficulty}`}>
            {spread.difficulty === 'beginner' && '⭐ Начальный'}
            {spread.difficulty === 'intermediate' && '⭐⭐ Средний'}
            {spread.difficulty === 'advanced' && '⭐⭐⭐ Продвинутый'}
          </span>
        </div>
        <div className="deck-info">
          <span>📚 Колода: {availableCards.length} карт</span>
          <button
            onClick={() => {
              toggleMute()
              setSoundEnabled(!soundEnabled)
            }}
            className="btn-sound-toggle"
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Card Layout */}
      <div className="spread-layout">
        <svg viewBox="0 0 100 100" className="spread-svg">
          {spread.positions.map((position) => {
            const drawn = drawnCards.find(c => c.position === position.id)

            return (
              <g key={position.id} onClick={() => !drawn && drawCard(position)}>
                <rect
                  x={position.x - 5}
                  y={position.y - 7}
                  width="10"
                  height="14"
                  rx="1"
                  className={`card-slot ${drawn ? 'drawn' : 'empty'} ${isDrawing ? 'drawing' : ''}`}
                  transform={position.rotation ? `rotate(${position.rotation} ${position.x} ${position.y})` : ''}
                />
                <text
                  x={position.x}
                  y={position.y + 10}
                  textAnchor="middle"
                  className="position-label"
                >
                  {position.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Position Details */}
        <div className="positions-list">
          {spread.positions.map((position) => {
            const drawn = drawnCards.find(c => c.position === position.id)

            const isLastDrawn = lastDrawnCard && drawn && lastDrawnCard.position === position.id

            return (
              <div
                key={position.id}
                className={`position-item ${drawn ? 'drawn' : ''} ${isLastDrawn ? 'just-drawn' : ''}`}
                onClick={() => !drawn && drawCard(position)}
              >
                <div className="position-number">{position.id}</div>
                <div className="position-info">
                  <h4>{position.name}</h4>
                  <p>{position.description}</p>
                  {drawn && (
                    <>
                      <div className="card-visual-preview">
                        <TarotCardPlaceholder card={drawn} size="small" />
                      </div>
                      <div className="drawn-card-preview">
                        <div className="card-preview-header">
                          <strong>✓ {drawn.name}</strong>
                          {drawn.reversed && <span className="reversed-badge">Перевёрнута</span>}
                        </div>
                        <div className="card-keywords">
                          {drawn.keywords?.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="spread-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(drawnCards.length / spread.cardCount) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          {drawnCards.length} из {spread.cardCount} карт вытянуто
        </div>
      </div>

      {/* Actions */}
      <div className="spread-actions">
        <button onClick={resetSpread} className="btn-secondary">
          🔄 Начать заново
        </button>
        {drawnCards.length === spread.cardCount && (
          <button onClick={() => onComplete?.(drawnCards)} className="btn-primary">
            ✨ Получить Интерпретацию
          </button>
        )}
      </div>
    </div>
  )
}

SpreadEngine.propTypes = {
  spread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cardCount: PropTypes.number.isRequired,
    difficulty: PropTypes.string.isRequired,
    estimatedTime: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      rotation: PropTypes.number
    })).isRequired
  }).isRequired,
  onComplete: PropTypes.func,
  className: PropTypes.string
}

export default SpreadEngine
