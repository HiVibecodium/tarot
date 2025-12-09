import { useState, useRef, useCallback, useEffect } from 'react';
import './PullToRefresh.css';

/**
 * Pull to Refresh component for mobile
 * Wraps content and provides pull-down-to-refresh functionality
 */
function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false
}) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Check if we're at the top of the scroll container
  const isAtTop = useCallback(() => {
    if (!containerRef.current) return false;
    return containerRef.current.scrollTop <= 0;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (disabled || refreshing || !isAtTop()) return;

    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  }, [disabled, refreshing, isAtTop]);

  const handleTouchMove = useCallback((e) => {
    if (disabled || refreshing || !isAtTop()) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    // Only pull down, not up
    if (diff > 0) {
      // Apply resistance effect
      const resistance = 0.4;
      const distance = Math.min(diff * resistance, threshold * 1.5);

      setPulling(true);
      setPullDistance(distance);

      // Prevent default scroll when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [disabled, refreshing, isAtTop, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || refreshing || !pulling) return;

    if (pullDistance >= threshold && onRefresh) {
      setRefreshing(true);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setRefreshing(false);
      }
    }

    setPulling(false);
    setPullDistance(0);
  }, [disabled, refreshing, pulling, pullDistance, threshold, onRefresh]);

  // Prevent body scroll during pull
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e) => {
      if (pulling && pullDistance > 10) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      container.removeEventListener('touchmove', preventScroll);
    };
  }, [pulling, pullDistance]);

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div
      ref={containerRef}
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={`pull-indicator ${pulling ? 'visible' : ''} ${refreshing ? 'refreshing' : ''}`}
        style={{
          height: pulling ? pullDistance : (refreshing ? 50 : 0),
          opacity: pulling ? progress : (refreshing ? 1 : 0)
        }}
      >
        <div
          className="pull-indicator-icon"
          style={{
            transform: `rotate(${refreshing ? 0 : rotation}deg)`,
          }}
        >
          {refreshing ? (
            <span className="refresh-spinner">↻</span>
          ) : (
            <span className={pullDistance >= threshold ? 'ready' : ''}>
              {pullDistance >= threshold ? '↓' : '↓'}
            </span>
          )}
        </div>
        <span className="pull-indicator-text">
          {refreshing
            ? 'Обновление...'
            : pullDistance >= threshold
              ? 'Отпустите для обновления'
              : 'Потяните для обновления'
          }
        </span>
      </div>

      {/* Content */}
      <div
        className="pull-to-refresh-content"
        style={{
          transform: pulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
          transition: pulling ? 'none' : 'transform 0.3s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default PullToRefresh;
