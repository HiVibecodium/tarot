import { useState, useEffect, useRef } from 'react';

/**
 * useIntersectionObserver - Track element visibility in viewport
 *
 * @param {Object} options - IntersectionObserver options
 * @param {string} options.root - Root element (default: viewport)
 * @param {string} options.rootMargin - Margin around root (default: '0px')
 * @param {number} options.threshold - Visibility threshold 0-1 (default: 0)
 * @param {boolean} options.triggerOnce - Only trigger once (default: false)
 *
 * @returns {[ref, isIntersecting, entry]}
 */
export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false,
} = {}) {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: assume element is always visible
      setIsIntersecting(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        // Disconnect after first intersection if triggerOnce
        if (triggerOnce && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return [elementRef, isIntersecting, entry];
}

/**
 * useOnScreen - Simplified hook for checking if element is on screen
 *
 * @param {Object} options
 * @param {string} options.rootMargin - Margin to expand viewport
 * @param {boolean} options.once - Only trigger once
 */
export function useOnScreen({ rootMargin = '0px', once = true } = {}) {
  const [ref, isIntersecting] = useIntersectionObserver({
    rootMargin,
    triggerOnce: once,
  });

  return [ref, isIntersecting];
}

/**
 * useLazyLoad - Hook for lazy loading content
 * Returns a ref to attach to the container and whether content should be loaded
 */
export function useLazyLoad(options = {}) {
  const {
    rootMargin = '100px', // Start loading 100px before element is visible
    threshold = 0,
  } = options;

  const [ref, isIntersecting] = useIntersectionObserver({
    rootMargin,
    threshold,
    triggerOnce: true,
  });

  return [ref, isIntersecting];
}

export default useIntersectionObserver;
