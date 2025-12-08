/**
 * Sentry Configuration for Frontend
 * Error tracking and performance monitoring
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development';
  const enabled = import.meta.env.VITE_SENTRY_ENABLED === 'true';

  // Don't initialize if disabled or no DSN
  if (!enabled || !dsn) {
    console.log('⚠️  Sentry disabled or DSN not provided');
    return false;
  }

  // Don't initialize in development (optional)
  if (environment === 'development') {
    console.log('⚠️  Sentry disabled in development');
    return false;
  }

  try {
    Sentry.init({
      dsn,
      environment,

      // Performance Monitoring
      integrations: [
        // Note: BrowserTracing and Replay integrations removed due to compatibility issues
        // They need to be imported separately from @sentry/react v8+
        // Example: import { browserTracingIntegration, replayIntegration } from '@sentry/react';
      ],

      // Performance traces sample rate (0.0 to 1.0)
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

      // Session Replay sample rate
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of errors

      // Release tracking
      // release: import.meta.env.VITE_APP_VERSION,

      // BeforeSend hook - filter sensitive data
      beforeSend(event, _hint) {
        // Filter out sensitive data from breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.data) {
              // Remove sensitive fields
              delete breadcrumb.data.password;
              delete breadcrumb.data.token;
              delete breadcrumb.data.apiKey;
            }
            return breadcrumb;
          });
        }

        // Filter out user email (privacy)
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }

        // Filter out request data
        if (event.request) {
          if (event.request.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }
        }

        return event;
      },

      // Ignore certain errors
      ignoreErrors: [
        // Network errors
        'Network request failed',
        'NetworkError',
        'Failed to fetch',

        // Browser extension errors
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',

        // Random plugins/extensions
        'Can\'t find variable: ZiteReader',
        'jigsaw is not defined',
        'ComboSearch is not defined',

        // React hydration mismatch (often not actionable)
        'Hydration failed',

        // Cancelled requests
        'AbortError',
        'Request aborted',

        // Validation errors (user errors, not bugs)
        /^(400|401|403|404)/,
      ],

      // Deny URLs (don't track errors from these sources)
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome:\/\//i,
        /^moz-extension:\/\//i,

        // Third-party scripts
        /google-analytics\.com/i,
        /googletagmanager\.com/i,
      ],
    });

    console.log('✅ Sentry initialized (frontend)');
    console.log(`   Environment: ${environment}`);

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error.message);
    return false;
  }
}

/**
 * Capture exception manually
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    level: context.level || 'error',
  });
}

/**
 * Capture message
 */
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, {
    level,
    tags: context.tags,
    extra: context.extra,
  });
}

/**
 * Add breadcrumb (for context)
 */
export function addBreadcrumb(message, data = {}, category = 'custom') {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
}

/**
 * Set user context
 */
export function setUser(user) {
  Sentry.setUser({
    id: user.id || user._id,
    username: user.username || user.name,
    // Don't include email for privacy
  });
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Wrap component with Sentry error boundary
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
