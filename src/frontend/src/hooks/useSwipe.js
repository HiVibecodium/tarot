import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for handling swipe gestures
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {Function} options.onSwipeUp - Callback for up swipe
 * @param {Function} options.onSwipeDown - Callback for down swipe
 * @param {number} options.threshold - Minimum distance to trigger swipe (default: 50)
 * @param {number} options.restraint - Maximum perpendicular distance (default: 100)
 * @returns {Object} - Touch event handlers and swipe state
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  restraint = 100
} = {}) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = { x: touch.clientX, y: touch.clientY };
    setIsSwiping(true);
    setSwipeDirection(null);
    setSwipeDistance(0);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isSwiping) return;

    const touch = e.touches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };

    const distX = touchEnd.current.x - touchStart.current.x;
    const distY = touchEnd.current.y - touchStart.current.y;

    // Determine primary direction
    if (Math.abs(distX) > Math.abs(distY)) {
      setSwipeDirection(distX > 0 ? 'right' : 'left');
      setSwipeDistance(Math.abs(distX));
    } else {
      setSwipeDirection(distY > 0 ? 'down' : 'up');
      setSwipeDistance(Math.abs(distY));
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;

    setIsSwiping(false);

    const distX = touchEnd.current.x - touchStart.current.x;
    const distY = touchEnd.current.y - touchStart.current.y;
    const absDistX = Math.abs(distX);
    const absDistY = Math.abs(distY);

    // Calculate swipe velocity for better detection
    const elapsedTime = Date.now() - touchStart.current.time;
    const velocityX = absDistX / elapsedTime;
    const velocityY = absDistY / elapsedTime;

    // Horizontal swipe
    if (absDistX >= threshold && absDistY <= restraint) {
      if (distX > 0 && onSwipeRight) {
        onSwipeRight({ distance: absDistX, velocity: velocityX });
      } else if (distX < 0 && onSwipeLeft) {
        onSwipeLeft({ distance: absDistX, velocity: velocityX });
      }
    }

    // Vertical swipe
    if (absDistY >= threshold && absDistX <= restraint) {
      if (distY > 0 && onSwipeDown) {
        onSwipeDown({ distance: absDistY, velocity: velocityY });
      } else if (distY < 0 && onSwipeUp) {
        onSwipeUp({ distance: absDistY, velocity: velocityY });
      }
    }

    setSwipeDirection(null);
    setSwipeDistance(0);
  }, [isSwiping, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, restraint]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    isSwiping,
    swipeDirection,
    swipeDistance
  };
}

export default useSwipe;
