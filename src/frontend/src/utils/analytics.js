/**
 * Universal Analytics Manager
 * Supports Google Analytics 4, Yandex.Metrika, and custom events
 */

class AnalyticsManager {
  constructor() {
    this.isInitialized = false;
    this.gaInitialized = false;
    this.ymInitialized = false;
    this.queue = [];
  }

  /**
   * Initialize all analytics services
   */
  init(config = {}) {
    if (this.isInitialized) return;

    const {
      ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID,
      yandexMetrikaId = import.meta.env.VITE_YM_COUNTER_ID,
      enableInDev = false
    } = config;

    // Don't track in development unless explicitly enabled
    if (import.meta.env.DEV && !enableInDev) {
      console.log('📊 Analytics disabled in development');
      return;
    }

    // Initialize Google Analytics 4
    if (ga4MeasurementId) {
      this.initGA4(ga4MeasurementId);
    }

    // Initialize Yandex.Metrika
    if (yandexMetrikaId) {
      this.initYandexMetrika(yandexMetrikaId);
    }

    this.isInitialized = true;
    this.processQueue();
  }

  /**
   * Initialize Google Analytics 4
   */
  initGA4(measurementId) {
    if (this.gaInitialized) return;

    try {
      // Load GA4 script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false, // We'll send manually for SPA
        anonymize_ip: true, // Privacy-friendly
        cookie_flags: 'SameSite=None;Secure'
      });

      this.gaInitialized = true;
      console.log('✅ Google Analytics 4 initialized');
    } catch (error) {
      console.error('❌ GA4 initialization failed:', error);
    }
  }

  /**
   * Initialize Yandex.Metrika
   */
  initYandexMetrika(counterId) {
    if (this.ymInitialized) return;

    try {
      // Load Metrika script
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t),a=e.getElementsByTagName(t)[0];
        k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      window.ym = window.ym || function() {
        (window.ym.a = window.ym.a || []).push(arguments);
      };

      window.ym(counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: "dataLayer"
      });

      this.ymInitialized = true;
      console.log('✅ Yandex.Metrika initialized');
    } catch (error) {
      console.error('❌ Yandex.Metrika initialization failed:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(path, title) {
    if (!this.isInitialized) {
      this.queue.push({ type: 'pageView', path, title });
      return;
    }

    // Google Analytics 4
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title
      });
    }

    // Yandex.Metrika
    if (this.ymInitialized && window.ym) {
      const ymId = import.meta.env.VITE_YM_COUNTER_ID;
      if (ymId) {
        window.ym(ymId, 'hit', path, {
          title: title
        });
      }
    }

    console.log('📄 Page view tracked:', path);
  }

  /**
   * Track custom event
   */
  trackEvent(category, action, label = null, value = null) {
    if (!this.isInitialized) {
      this.queue.push({ type: 'event', category, action, label, value });
      return;
    }

    const eventParams = {
      event_category: category,
      event_label: label,
      value: value
    };

    // Google Analytics 4
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', action, eventParams);
    }

    // Yandex.Metrika
    if (this.ymInitialized && window.ym) {
      const ymId = import.meta.env.VITE_YM_COUNTER_ID;
      if (ymId) {
        window.ym(ymId, 'reachGoal', action, eventParams);
      }
    }

    console.log('🎯 Event tracked:', { category, action, label, value });
  }

  /**
   * Track tarot reading
   */
  trackReading(spreadType, cardCount) {
    this.trackEvent('Tarot', 'reading_complete', spreadType, cardCount);
  }

  /**
   * Track premium conversion
   */
  trackPremiumPurchase(plan, amount) {
    const eventParams = {
      transaction_id: Date.now().toString(),
      currency: 'RUB',
      value: amount,
      items: [{
        item_name: plan,
        price: amount
      }]
    };

    // GA4 ecommerce
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'purchase', eventParams);
    }

    // Yandex ecommerce
    if (this.ymInitialized && window.ym) {
      const ymId = import.meta.env.VITE_YM_COUNTER_ID;
      if (ymId) {
        window.ym(ymId, 'reachGoal', 'premium_purchase', {
          plan: plan,
          amount: amount
        });
      }
    }

    console.log('💰 Purchase tracked:', { plan, amount });
  }

  /**
   * Track user engagement
   */
  trackEngagement(engagementType, details = {}) {
    this.trackEvent('Engagement', engagementType, JSON.stringify(details));
  }

  /**
   * Track error
   */
  trackError(errorType, errorMessage, fatal = false) {
    const eventParams = {
      description: errorMessage,
      fatal: fatal
    };

    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'exception', eventParams);
    }

    this.trackEvent('Error', errorType, errorMessage);
  }

  /**
   * Process queued events
   */
  processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();

      switch (event.type) {
        case 'pageView':
          this.trackPageView(event.path, event.title);
          break;
        case 'event':
          this.trackEvent(event.category, event.action, event.label, event.value);
          break;
      }
    }
  }

  /**
   * Set user properties (for segmentation)
   */
  setUserProperties(properties) {
    if (this.gaInitialized && window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }

    if (this.ymInitialized && window.ym) {
      const ymId = import.meta.env.VITE_YM_COUNTER_ID;
      if (ymId) {
        window.ym(ymId, 'userParams', properties);
      }
    }

    console.log('👤 User properties set:', properties);
  }

  /**
   * Track timing (performance)
   */
  trackTiming(category, variable, value) {
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category
      });
    }

    console.log('⏱️ Timing tracked:', { category, variable, value });
  }
}

// Create singleton instance
const analytics = new AnalyticsManager();

// Auto-initialize on import (if env vars present)
if (typeof window !== 'undefined') {
  analytics.init();
}

export default analytics;

// Convenience exports
export const {
  trackPageView,
  trackEvent,
  trackReading,
  trackPremiumPurchase,
  trackEngagement,
  trackError,
  setUserProperties,
  trackTiming
} = {
  trackPageView: (...args) => analytics.trackPageView(...args),
  trackEvent: (...args) => analytics.trackEvent(...args),
  trackReading: (...args) => analytics.trackReading(...args),
  trackPremiumPurchase: (...args) => analytics.trackPremiumPurchase(...args),
  trackEngagement: (...args) => analytics.trackEngagement(...args),
  trackError: (...args) => analytics.trackError(...args),
  setUserProperties: (...args) => analytics.setUserProperties(...args),
  trackTiming: (...args) => analytics.trackTiming(...args)
};
