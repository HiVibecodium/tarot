/**
 * Sentry Configuration for Backend
 * Error tracking and performance monitoring
 */

const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialize Sentry
 */
function initSentry() {
  const dsn = process.env.SENTRY_DSN_BACKEND;
  const environment = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development';
  const tracesSampleRate = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '1.0');

  // Don't initialize Sentry if no DSN provided
  if (!dsn) {
    console.log('⚠️  Sentry DSN not provided - error tracking disabled');
    return false;
  }

  // Don't initialize in test environment
  if (environment === 'test') {
    console.log('⚠️  Sentry disabled in test environment');
    return false;
  }

  try {
    Sentry.init({
      dsn,
      environment,

      // Performance Monitoring
      tracesSampleRate,

      // Profiling
      profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
      integrations: [
        new ProfilingIntegration(),
      ],

      // Release tracking (optional)
      // release: process.env.npm_package_version,

      // BeforeSend hook - filter sensitive data
      beforeSend(event, hint) {
        // Don't send events in development (optional)
        if (environment === 'development') {
          console.log('🐛 Sentry event (dev - not sent):', event.message || event.exception);
          return null; // Don't send to Sentry in dev
        }

        // Filter out sensitive data
        if (event.request) {
          // Remove authorization headers
          if (event.request.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }

          // Remove sensitive query params
          if (event.request.query_string) {
            event.request.query_string = event.request.query_string
              .replace(/password=[^&]*/g, 'password=REDACTED')
              .replace(/token=[^&]*/g, 'token=REDACTED');
          }
        }

        // Remove sensitive user data
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }

        return event;
      },

      // Ignore certain errors
      ignoreErrors: [
        // Ignore network errors
        'Network request failed',
        'NetworkError',

        // Ignore cancelled requests
        'AbortError',
        'Request aborted',

        // Ignore validation errors (4xx - user errors)
        /^4\d{2}/,
      ],
    });

    console.log('✅ Sentry initialized successfully');
    console.log(`   Environment: ${environment}`);
    console.log(`   Traces Sample Rate: ${tracesSampleRate}`);

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error.message);
    return false;
  }
}

/**
 * Capture exception manually
 */
function captureException(error, context = {}) {
  if (!Sentry.getCurrentHub().getClient()) {
    console.error('Sentry not initialized:', error);
    return null;
  }

  return Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    user: context.user,
    level: context.level || 'error',
  });
}

/**
 * Capture message
 */
function captureMessage(message, level = 'info', context = {}) {
  if (!Sentry.getCurrentHub().getClient()) {
    console.log(`Sentry not initialized: ${message}`);
    return null;
  }

  return Sentry.captureMessage(message, {
    level,
    tags: context.tags,
    extra: context.extra,
  });
}

/**
 * Add breadcrumb (for context)
 */
function addBreadcrumb(message, data = {}, category = 'custom') {
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
function setUser(user) {
  Sentry.setUser({
    id: user.id || user._id,
    username: user.username,
    // Don't include email for privacy
  });
}

/**
 * Clear user context
 */
function clearUser() {
  Sentry.setUser(null);
}

/**
 * Get Express error handler middleware
 */
function getErrorHandler() {
  // Return no-op middleware if Sentry not initialized
  if (!Sentry.Handlers) {
    return (err, req, res, next) => next(err);
  }

  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all errors with status code >= 500
      return error.status >= 500 || !error.status;
    },
  });
}

/**
 * Get Express request handler middleware
 */
function getRequestHandler() {
  // Return no-op middleware if Sentry not initialized
  if (!Sentry.Handlers) {
    return (req, res, next) => next();
  }

  return Sentry.Handlers.requestHandler({
    user: ['id', 'username'],
    ip: false, // Don't capture IP for privacy
    request: true,
    serverName: false,
  });
}

/**
 * Get Express tracing middleware
 */
function getTracingHandler() {
  // Return no-op middleware if Sentry not initialized
  if (!Sentry.Handlers) {
    return (req, res, next) => next();
  }

  return Sentry.Handlers.tracingHandler();
}

module.exports = {
  initSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  clearUser,
  getErrorHandler,
  getRequestHandler,
  getTracingHandler,
  Sentry,
};
