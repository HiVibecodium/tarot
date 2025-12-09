import { useState, useEffect, useRef, memo } from 'react';
import './LazyImage.css';

/**
 * LazyImage - Optimized image component with:
 * - Intersection Observer for lazy loading
 * - Blur-up placeholder effect
 * - Error handling with fallback
 * - Native loading="lazy" support
 */
const LazyImage = memo(function LazyImage({
  src,
  alt,
  fallbackSrc = '/cards/placeholder.svg',
  className = '',
  width,
  height,
  placeholder = null,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="lazy-image-placeholder">
          {placeholder || (
            <div className="lazy-image-skeleton" />
          )}
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
          {...props}
        />
      )}
    </div>
  );
});

export default LazyImage;
