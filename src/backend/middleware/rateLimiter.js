/**
 * Advanced Rate Limiting Middleware
 * Protects against brute force and DDoS attacks
 */

const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Applies to all /api routes
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Слишком много запросов. Пожалуйста, попробуйте через 15 минут.'
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Skip successful requests (don't count against limit)
  skipSuccessfulRequests: false,
  // Skip failed requests
  skipFailedRequests: false,
  // Skip rate limiting in test environment
  skip: (req) => process.env.NODE_ENV === 'test',
});

/**
 * Strict Auth Limiter
 * For login/register endpoints (prevent brute force)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Слишком много попыток входа. Попробуйте через 15 минут.',
      retryAfter: 15
    }
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  skipFailedRequests: false, // Count failed attempts
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in test environment
  skip: (req) => process.env.NODE_ENV === 'test',
});

/**
 * Premium Endpoints Limiter
 * Stricter for resource-intensive operations
 */
const premiumLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Слишком много запросов к premium функциям. Подождите минуту.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stripe Webhook Limiter
 * More permissive for webhooks
 */
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 webhook calls per minute
  message: {
    success: false,
    error: {
      code: 'WEBHOOK_RATE_LIMIT',
      message: 'Too many webhook requests'
    }
  },
  standardHeaders: false,
  legacyHeaders: false,
});

/**
 * Reading Generation Limiter
 * Prevent spam readings
 */
const readingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 readings per minute
  message: {
    success: false,
    error: {
      code: 'READING_RATE_LIMIT',
      message: 'Слишком много раскладов за короткое время. Подождите минуту.',
      suggestion: 'Изучите текущий расклад перед созданием нового'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Password Reset Limiter
 * Very strict for security
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset attempts per hour
  message: {
    success: false,
    error: {
      code: 'PASSWORD_RESET_LIMIT',
      message: 'Слишком много попыток сброса пароля. Попробуйте через час.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create custom rate limiter with dynamic limits
 */
function createCustomLimiter(options = {}) {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: options.message || 'Слишком много запросов. Попробуйте позже.'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
}

/**
 * Log rate limit configuration
 */
function logRateLimitConfig() {
  console.log('⏱️  Rate Limiting Configuration:');
  console.log('   General API: 100 requests / 15 min');
  console.log('   Auth (Login): 5 attempts / 15 min');
  console.log('   Readings: 10 generations / 1 min');
  console.log('   Premium: 10 requests / 1 min');
  console.log('   Password Reset: 3 attempts / 1 hour');
  console.log('');
}

module.exports = {
  apiLimiter,
  authLimiter,
  premiumLimiter,
  webhookLimiter,
  readingLimiter,
  passwordResetLimiter,
  createCustomLimiter,
  logRateLimitConfig
};
