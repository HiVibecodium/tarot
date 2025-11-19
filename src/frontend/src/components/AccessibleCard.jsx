/**
 * Accessible Card Component for Tarot Cards
 * Includes keyboard navigation and screen reader support
 */

import PropTypes from 'prop-types';
import { useState } from 'react';

const AccessibleCard = ({
  card,
  onClick,
  isReversed = false,
  isRevealed = false,
  position,
  ariaLabel,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(card);
    }
  };

  const cardLabel = ariaLabel || `${card.name}${isReversed ? ' (перевернутая)' : ''}${position ? `, позиция: ${position}` : ''}`;

  const interpretationText = isReversed
    ? card.interpretations?.reversed || card.meaning_reversed
    : card.interpretations?.upright || card.meaning_upright;

  return (
    <div
      className={`accessible-tarot-card ${className} ${isReversed ? 'reversed' : ''} ${isRevealed ? 'revealed' : ''} ${isFocused ? 'focused' : ''}`}
      onClick={() => onClick?.(card)}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="button"
      tabIndex={0}
      aria-label={cardLabel}
      aria-describedby={`card-description-${card.id}`}
      aria-pressed={isRevealed}
    >
      <div className="card-visual" aria-hidden="true">
        <img
          src={card.image || `/cards/${card.id}.jpg`}
          alt=""
          className={`card-image ${isReversed ? 'reversed' : ''}`}
        />
      </div>

      <div className="card-info">
        <h3 className="card-name">{card.name}</h3>
        {position && (
          <span className="card-position" aria-label={`Позиция в раскладе: ${position}`}>
            {position}
          </span>
        )}
      </div>

      {/* Hidden description for screen readers */}
      <div id={`card-description-${card.id}`} className="sr-only">
        {interpretationText}
      </div>

      {/* Visual focus indicator */}
      {isFocused && (
        <div className="focus-ring" aria-hidden="true"></div>
      )}
    </div>
  );
};

AccessibleCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    meaning_upright: PropTypes.string,
    meaning_reversed: PropTypes.string,
    interpretations: PropTypes.object
  }).isRequired,
  onClick: PropTypes.func,
  isReversed: PropTypes.bool,
  isRevealed: PropTypes.bool,
  position: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string
};

export default AccessibleCard;
