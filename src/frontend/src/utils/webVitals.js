/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

import analytics from './analytics';

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}

/**
 * Send Web Vitals to analytics services
 */
export function sendToAnalytics({ name, delta, value, id }) {
  // Send to Google Analytics as custom event
  analytics.trackEvent('Web Vitals', name, id, Math.round(delta));

  // Send as timing event for better visualization
  analytics.trackTiming('Performance', name, Math.round(delta));

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`📊 Web Vital: ${name}`, {
      value: Math.round(delta),
      id: id,
      rating: getRating(name, value)
    });
  }
}

/**
 * Get rating for a metric (good, needs-improvement, poor)
 */
function getRating(name, value) {
  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    LCP: { good: 2500, poor: 4000 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  };

  const threshold = thresholds[name];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  reportWebVitals(sendToAnalytics);

  // Monitor long tasks (> 50ms)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            analytics.trackEvent('Performance', 'long_task', entry.name, Math.round(entry.duration));
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask might not be supported
    }
  }

  console.log('✅ Web Vitals monitoring initialized');
}

/**
 * Track custom performance metrics
 */
export function trackCustomMetric(name, value, unit = 'ms') {
  analytics.trackTiming('Custom', name, value);

  if (import.meta.env.DEV) {
    console.log(`⏱️ Custom Metric: ${name} = ${value}${unit}`);
  }
}

/**
 * Measure and track component render time
 */
export function measureRenderTime(componentName, callback) {
  const startTime = performance.now();

  const result = callback();

  const endTime = performance.now();
  const duration = endTime - startTime;

  if (duration > 16) { // Longer than 1 frame (60fps)
    trackCustomMetric(`${componentName}_render`, Math.round(duration));
  }

  return result;
}

/**
 * Track API call performance
 */
export function trackAPICall(endpoint, duration, success = true) {
  analytics.trackEvent(
    'API Performance',
    success ? 'api_success' : 'api_error',
    endpoint,
    Math.round(duration)
  );

  if (duration > 3000) {
    analytics.trackEvent('Performance', 'slow_api', endpoint, Math.round(duration));
  }
}

export default {
  initWebVitals,
  reportWebVitals,
  sendToAnalytics,
  trackCustomMetric,
  measureRenderTime,
  trackAPICall
};
