import { useState, useRef, useCallback, useEffect } from 'react';
import { useSwipe } from '../hooks/useSwipe';
import './SwipeableCards.css';

/**
 * Swipeable Cards component for mobile card navigation
 * Allows swiping left/right to navigate between cards in a spread
 */
function SwipeableCards({
  cards = [],
  renderCard,
  initialIndex = 0,
  onCardChange,
  showIndicators = true,
  showArrows = true,
  loop = false
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef(null);

  const totalCards = cards.length;

  const goToCard = useCallback((index) => {
    let newIndex = index;

    if (loop) {
      if (newIndex < 0) newIndex = totalCards - 1;
      if (newIndex >= totalCards) newIndex = 0;
    } else {
      newIndex = Math.max(0, Math.min(totalCards - 1, newIndex));
    }

    setCurrentIndex(newIndex);
    onCardChange?.(newIndex, cards[newIndex]);
  }, [totalCards, loop, onCardChange, cards]);

  const goToPrevious = useCallback(() => {
    goToCard(currentIndex - 1);
  }, [currentIndex, goToCard]);

  const goToNext = useCallback(() => {
    goToCard(currentIndex + 1);
  }, [currentIndex, goToCard]);

  const { handlers, swipeDirection, swipeDistance, isSwiping } = useSwipe({
    onSwipeLeft: () => goToNext(),
    onSwipeRight: () => goToPrevious(),
    threshold: 50,
    restraint: 100
  });

  // Update translateX during swipe for visual feedback
  useEffect(() => {
    if (isSwiping && (swipeDirection === 'left' || swipeDirection === 'right')) {
      const direction = swipeDirection === 'left' ? -1 : 1;
      setTranslateX(direction * swipeDistance * 0.3);
    } else {
      setTranslateX(0);
    }
  }, [isSwiping, swipeDirection, swipeDistance]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (totalCards === 0) {
    return null;
  }

  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < totalCards - 1;

  return (
    <div className="swipeable-cards" ref={containerRef}>
      {/* Navigation arrows */}
      {showArrows && totalCards > 1 && (
        <>
          <button
            className={`swipe-arrow swipe-arrow-left ${!canGoPrevious ? 'disabled' : ''}`}
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            aria-label="Предыдущая карта"
          >
            ‹
          </button>
          <button
            className={`swipe-arrow swipe-arrow-right ${!canGoNext ? 'disabled' : ''}`}
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Следующая карта"
          >
            ›
          </button>
        </>
      )}

      {/* Cards container */}
      <div
        className="swipeable-cards-container"
        {...handlers}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease'
        }}
      >
        {renderCard ? renderCard(cards[currentIndex], currentIndex) : (
          <div className="swipeable-card-content">
            {cards[currentIndex]}
          </div>
        )}
      </div>

      {/* Card counter */}
      <div className="swipeable-cards-counter">
        {currentIndex + 1} / {totalCards}
      </div>

      {/* Dot indicators */}
      {showIndicators && totalCards > 1 && (
        <div className="swipeable-cards-indicators">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToCard(index)}
              aria-label={`Перейти к карте ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe hint */}
      <div className="swipe-hint">
        <span className="swipe-hint-icon">👆</span>
        Свайпните для навигации
      </div>
    </div>
  );
}

export default SwipeableCards;
