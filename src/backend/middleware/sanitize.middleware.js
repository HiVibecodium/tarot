/**
 * Input Sanitization Middleware
 * Protects against XSS and injection attacks
 */

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/**
 * Custom input sanitizer
 * Trims whitespace and removes dangerous characters
 */
function sanitizeInput(req, res, next) {
  // Sanitize function for strings
  const sanitize = (value) => {
    if (typeof value === 'string') {
      return value
        .trim()
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Limit length
        .substring(0, 10000);
    }

    if (typeof value === 'object' && value !== null) {
      // Recursively sanitize objects
      const sanitized = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          sanitized[key] = sanitize(value[key]);
        }
      }
      return sanitized;
    }

    return value;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitize(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize and validate email
 */
function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }

  // Trim and lowercase
  const cleaned = email.trim().toLowerCase();

  // Validate format
  if (!isValidEmail(cleaned)) {
    return null;
  }

  // Max length
  if (cleaned.length > 255) {
    return null;
  }

  return cleaned;
}

/**
 * Remove HTML tags
 */
function stripHtml(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Sanitize user input fields
 */
function sanitizeUserInput(data) {
  const sanitized = {};

  if (data.email) {
    sanitized.email = sanitizeEmail(data.email);
  }

  if (data.name) {
    sanitized.name = stripHtml(data.name?.substring(0, 100));
  }

  if (data.username) {
    sanitized.username = stripHtml(data.username?.substring(0, 50));
  }

  if (data.question) {
    sanitized.question = stripHtml(data.question?.substring(0, 500));
  }

  if (data.notes) {
    sanitized.notes = stripHtml(data.notes?.substring(0, 1000));
  }

  // Pass through other fields
  Object.keys(data).forEach(key => {
    if (!sanitized[key]) {
      sanitized[key] = data[key];
    }
  });

  return sanitized;
}

/**
 * MongoDB injection protection middleware
 * Removes $ and . from user input
 */
const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Potential NoSQL injection blocked: ${key}`);
  }
});

/**
 * XSS protection middleware
 * Removes XSS attempts from user input
 */
const xssMiddleware = xss();

module.exports = {
  sanitizeInput,
  sanitizeEmail,
  stripHtml,
  sanitizeUserInput,
  mongoSanitizeMiddleware,
  xssMiddleware,
  isValidEmail
};
