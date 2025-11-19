/**
 * Production-ready Logger using Winston
 * Logs to console (dev) and files (production)
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'error' : 'info');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// Transports
const transports = [];

// Console transport (always enabled in development)
if (NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    })
  );
}

// File transports (production)
if (NODE_ENV === 'production') {
  // Error logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: customFormat
    })
  );

  // Combined logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: customFormat
    })
  );

  // Console in production (for Docker logs)
  transports.push(
    new winston.transports.Console({
      format: customFormat
    })
  );
}

// Create logger
const logger = winston.createLogger({
  level: LOG_LEVEL,
  transports,
  exitOnError: false
});

// Wrapper functions for easier use
logger.logRequest = (req, statusCode, duration) => {
  const message = `${req.method} ${req.url} ${statusCode} - ${duration}ms`;
  if (statusCode >= 500) {
    logger.error(message);
  } else if (statusCode >= 400) {
    logger.warn(message);
  } else {
    logger.info(message);
  }
};

logger.logError = (error, context = '') => {
  const message = context ? `${context}: ${error.message}` : error.message;
  logger.error(message, { stack: error.stack });
};

logger.logStripe = (eventType, details = '') => {
  logger.info(`[Stripe] ${eventType} ${details}`);
};

module.exports = logger;
