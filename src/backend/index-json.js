/**
 * AI Tarot Decision Assistant - Backend Server (JSON Storage Version)
 * Lightweight version using JSON file storage instead of MongoDB
 */

require('dotenv').config();

// Validate environment variables BEFORE anything else
const { checkEnv } = require('./utils/validateEnv');
checkEnv();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db/json-store');
const {
  initSentry,
  getRequestHandler,
  getTracingHandler,
  getErrorHandler
} = require('./config/sentry');
const { getCorsOptions, logCorsConfig } = require('./middleware/cors.middleware');
const { apiLimiter, logRateLimitConfig } = require('./middleware/rateLimiter');
const {
  sanitizeInput,
  mongoSanitizeMiddleware,
  xssMiddleware
} = require('./middleware/sanitize.middleware');

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ========================================
// SENTRY INITIALIZATION (must be first!)
// ========================================

initSentry();

// ========================================
// MIDDLEWARE
// ========================================

// Sentry request handler (must be first middleware)
app.use(getRequestHandler());
app.use(getTracingHandler());

// Helmet with relaxed CSP for Vite
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for Vite in production
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://tarot-a2oi.onrender.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

// Secure CORS with whitelist
app.use(cors(getCorsOptions()));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input sanitization (prevent XSS and injection attacks)
app.use(mongoSanitizeMiddleware); // NoSQL injection protection
app.use(xssMiddleware); // XSS protection
app.use(sanitizeInput); // Custom sanitization

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// ========================================
// DATABASE INITIALIZATION
// ========================================

const initDatabase = async () => {
  try {
    await db.init();
    console.log('✅ JSON Database initialized');
    console.log(`📁 Storage: ${db.dbPath}`);

    // Make db available to all routes via app.locals
    app.locals.db = db;

    // Seed cards if database is empty (first time setup)
    const Card = require('./models/Card.json-model');
    const cardCount = await Card.count();

    if (cardCount === 0) {
      console.log('📦 Database is empty, seeding cards...');
      const { seedCards } = require('./scripts/seed-cards');
      await seedCards();
      console.log('✅ Cards seeded successfully');
    } else {
      console.log(`📚 Found ${cardCount} cards in database`);
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// ========================================
// ROUTES
// ========================================

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Tarot Decision Assistant API',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    storage: 'JSON File Storage',
    uptime: process.uptime(),
    features: {
      ai: process.env.AI_ENABLED === 'true',
      premium: process.env.PREMIUM_ENABLED === 'true'
    }
  });
});

// API Info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    version: '1.0.0',
    storage: 'JSON File Storage (MVP)',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      readings: '/api/readings/*',
      cards: '/api/cards/*'
    }
  });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cardRoutes = require('./routes/card.routes');
const readingRoutes = require('./routes/reading.routes');
const numerologyRoutes = require('./routes/numerology.routes');
const moonPhasesRoutes = require('./routes/moon-phases.routes');
const journalRoutes = require('./routes/journal.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const insightsRoutes = require('./routes/insights.routes');
const astrologyRoutes = require('./routes/astrology.routes');
const paymentRoutes = require('./api/routes/payment');
const analyticsRoutes = require('./api/routes/analytics');
const socialRoutes = require('./api/routes/social');
const feedbackRoutes = require('./routes/feedback.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/numerology', numerologyRoutes);
app.use('/api/moon', moonPhasesRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/astrology', astrologyRoutes);
app.use('/api/feedback', feedbackRoutes);

// Stripe routes
const stripeRoutes = require('./routes/stripe.routes');
app.use('/api/stripe', stripeRoutes);

// Admin routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Horoscope routes
const horoscopeRoutes = require('./routes/horoscope.routes');
app.use('/api/horoscope', horoscopeRoutes);

// Spread Routes (Universal Tarot Spread System)
const spreadRoutes = require('./routes/spread.routes');
app.use('/api/spreads', spreadRoutes);

// Quiz routes (Interactive Learning)
const quizRoutes = require('./routes/quiz.routes');
app.use('/api/quiz', quizRoutes);

// ========================================
// SERVE STATIC FILES IN PRODUCTION
// ========================================

if (NODE_ENV === 'production') {
  const path = require('path');
  const fs = require('fs');

  // Serve static files from React build
  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), 'src', 'frontend', 'dist'),
    path.join(process.cwd(), 'frontend', 'dist'),
    path.join(__dirname, '..', 'frontend', 'dist'),
    path.join(__dirname, '../../frontend/dist')
  ];

  console.log('🔍 Current working directory:', process.cwd());
  console.log('🔍 __dirname:', __dirname);
  console.log('🔍 Checking possible paths:');

  let frontendPath = null;
  for (const testPath of possiblePaths) {
    console.log(`  Testing: ${testPath}`);
    if (fs.existsSync(path.join(testPath, 'index.html'))) {
      frontendPath = testPath;
      console.log(`  ✅ Found index.html!`);
      break;
    } else {
      console.log(`  ❌ Not found`);
    }
  }

  if (!frontendPath) {
    console.error('❌ Could not find frontend dist folder!');
    frontendPath = path.join(process.cwd(), 'src', 'frontend', 'dist');
  }

  console.log('📁 Using frontend path:', frontendPath);

  // Serve static files with proper MIME types
  app.use(express.static(frontendPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }));

  // SPA fallback - only for non-file requests
  app.get('*', (req, res) => {
    // Don't send index.html for asset requests
    if (req.path.startsWith('/assets/') ||
        req.path.startsWith('/cards/') ||
        req.path.match(/\.(js|css|png|jpg|svg|ico|json|woff|woff2|ttf)$/)) {
      return res.status(404).send('File not found');
    }

    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath);
  });
}

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`
    }
  });
});

// Sentry error handler (must be before other error handlers)
app.use(getErrorHandler());

// Custom error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Error already sent by Sentry handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: NODE_ENV === 'development' ? err.message : 'Internal server error',
      ...(NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ========================================
// SERVER STARTUP
// ========================================

const startServer = async () => {
  try {
    // Initialize JSON database
    await initDatabase();

    // Initialize notifications service
    const notificationsService = require('./services/notifications.service');
    await notificationsService.init();

    // Log security configuration
    logCorsConfig();
    logRateLimitConfig();

    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n🚀 ================================');
      console.log(`🚀 Server started successfully`);
      console.log(`📡 Environment: ${NODE_ENV}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`📖 Health: http://localhost:${PORT}/health`);
      console.log(`💾 Storage: JSON File (MVP)`);
      console.log('🚀 ================================\n');
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

let server;

const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received, shutting down...`);

  if (server) {
    server.close(() => {
      console.log('👋 Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer().then(s => { server = s; });
}

module.exports = app;
 
