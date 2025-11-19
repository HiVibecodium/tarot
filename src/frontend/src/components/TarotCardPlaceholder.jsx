import PropTypes from 'prop-types'
import './TarotCardPlaceholder.css'

/**
 * Beautiful placeholder for tarot cards when images are not available
 */
function TarotCardPlaceholder({ card, size = 'medium', className = '' }) {
  const getArcanaEmoji = (arcana) => {
    return arcana === 'major' ? '⭐' : '🎴'
  }

  const getSuitEmoji = (suit) => {
    const suits = {
      'wands': '🔥',
      'cups': '💧',
      'swords': '⚔️',
      'pentacles': '⭕'
    }
    return suits[suit] || '🎴'
  }

  // If we have imageUrl, show the image
  if (card.imageUrl) {
    return (
      <div className={`tarot-card-image ${size} ${card.reversed ? 'reversed' : ''} ${className}`}>
        <img src={card.imageUrl} alt={card.name} />
        {card.reversed && (
          <div className="reversed-overlay-img">⚡ Перевёрнута</div>
        )}
      </div>
    )
  }

  return (
    <div className={`tarot-card-placeholder ${size} ${card.reversed ? 'reversed' : ''} ${className}`}>
      <div className="card-border">
        <div className="card-header">
          <span className="arcana-indicator">{getArcanaEmoji(card.arcana)}</span>
          {card.suit && <span className="suit-indicator">{getSuitEmoji(card.suit)}</span>}
        </div>

        <div className="card-name-display">
          {card.name}
        </div>

        {card.keywords && card.keywords.length > 0 && (
          <div className="card-keywords-list">
            {card.keywords.slice(0, 3).map((kw, i) => (
              <span key={i} className="kw-tag">{kw}</span>
            ))}
          </div>
        )}

        {card.reversed && (
          <div className="reversed-overlay">
            ⚡ Перевёрнута
          </div>
        )}
      </div>
    </div>
  )
}

TarotCardPlaceholder.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    arcana: PropTypes.string,
    suit: PropTypes.string,
    keywords: PropTypes.array,
    reversed: PropTypes.bool
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
}

export default TarotCardPlaceholder
