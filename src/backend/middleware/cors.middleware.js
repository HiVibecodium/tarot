/**
 * CORS Middleware with Whitelist
 * Secure CORS configuration for production
 */

/**
 * Get allowed origins from environment
 */
function getAllowedOrigins() {
  const env = process.env.NODE_ENV || 'development';

  // Development: allow localhost
  if (env === 'development') {
    return [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:3000'
    ];
  }

  // Production: use environment variable or defaults
  const originsString = process.env.ALLOWED_ORIGINS;

  if (originsString) {
    // Parse comma-separated list
    return originsString.split(',').map(o => o.trim());
  }

  // Default production origins
  return [
    'https://tarot-assistant.com',
    'https://www.tarot-assistant.com'
  ];
}

/**
 * CORS options factory
 */
function getCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in whitelist
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },

    credentials: true, // Allow cookies

    // Allowed methods
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Allowed headers
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept'
    ],

    // Expose headers to client
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],

    // Preflight cache duration (seconds)
    maxAge: 86400, // 24 hours

    // Pass preflight to next handler
    preflightContinue: false,

    // Success status for OPTIONS
    optionsSuccessStatus: 204
  };
}

/**
 * Log CORS configuration on startup
 */
function logCorsConfig() {
  const allowedOrigins = getAllowedOrigins();
  const env = process.env.NODE_ENV || 'development';

  console.log('\n🔒 CORS Configuration:');
  console.log(`   Environment: ${env}`);
  console.log(`   Allowed origins (${allowedOrigins.length}):`);
  allowedOrigins.forEach(origin => {
    console.log(`   - ${origin}`);
  });
  console.log('');
}

module.exports = {
  getCorsOptions,
  getAllowedOrigins,
  logCorsConfig
};
