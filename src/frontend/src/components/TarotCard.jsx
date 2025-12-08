import { useState, useCallback } from 'react'
import { getCardVisual } from '../utils/cardVisuals'
import { getCardImagePath, getFallbackImagePath } from '../utils/cardImages'
import './TarotCard.css'

function TarotCard({ card, reversed = false, showInterpretation = true }) {
  const visual = card?._id ? getCardVisual(card._id) : null
  const [isFlipped, setIsFlipped] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleClick = useCallback(() => {
    setIsFlipped(prev => !prev)
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsFlipped(prev => !prev)
    }
  }, [])

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  if (!card) {
    return (
      <div className="tarot-card-placeholder">
        <div className="card-back">🔮</div>
      </div>
    )
  }

  const imagePath = getCardImagePath(card)

  return (
    <div
      className={`tarot-card-container ${isFlipped ? 'flipped' : ''}`}
      data-suit={card.suit || 'major'}
    >
      <div
        className="tarot-card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${card.cardName || card.name}${reversed ? ', reversed' : ''}, click to ${isFlipped ? 'show front' : 'flip'}`}
        aria-pressed={isFlipped}
      >
        {/* Card Front */}
        <div className={`card-front ${reversed ? 'reversed' : ''}`}>
          <div className="card-header">
            <h3>{card.cardName || card.name}</h3>
            {reversed && <span className="reversed-indicator">↓ Reversed</span>}
          </div>

          <div className="card-image">
            {/* Real card image */}
            <img
              src={imageError ? getFallbackImagePath() : imagePath}
              alt={card.cardName || card.name}
              className={`card-img ${imageLoaded ? 'loaded' : 'loading'}`}
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />

            {/* Loading placeholder */}
            {!imageLoaded && (
              <div
                className="card-placeholder"
                style={visual ? {
                  background: `linear-gradient(135deg, ${visual.gradient[0]} 0%, ${visual.gradient[1]} 100%)`
                } : {}}
              >
                <div className="card-icon">
                  {visual?.emoji || (
                    <>
                      {card.suit === 'wands' && '🔥'}
                      {card.suit === 'cups' && '💧'}
                      {card.suit === 'swords' && '⚔️'}
                      {card.suit === 'pentacles' && '⭐'}
                      {!card.suit && '🔮'}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {card.keywords && (
            <div className="card-keywords">
              {card.keywords.slice(0, 3).map((keyword, idx) => (
                <span key={idx} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          )}
        </div>

        {/* Card Back (optional for flip animation) */}
        <div className="card-back">
          <div className="card-back-pattern">🔮</div>
          <p>Click to flip</p>
        </div>
      </div>

      {showInterpretation && card.interpretation && (
        <div className="card-interpretation">
          <p>{card.interpretation}</p>
        </div>
      )}
    </div>
  )
}

export default TarotCard
