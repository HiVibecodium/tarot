/**
 * Environment Variables Validation
 * Ensures all required configuration is present before server starts
 */

/**
 * Required environment variables for different environments
 */
const REQUIRED_ENV_VARS = {
  // Always required
  always: [
    'JWT_SECRET',
    'NODE_ENV'
  ],

  // Required in production
  production: [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'ALLOWED_ORIGINS'
  ],

  // Recommended (warnings only)
  recommended: [
    'SENTRY_DSN_BACKEND',
    'SENTRY_ENVIRONMENT',
    'CORS_ORIGIN'
  ]
};

/**
 * Validate environment variables
 */
function validateEnv() {
  const env = process.env.NODE_ENV || 'development';
  const errors = [];
  const warnings = [];

  // Check always required vars
  REQUIRED_ENV_VARS.always.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`❌ Missing required variable: ${varName}`);
    }
  });

  // Check production-specific vars
  if (env === 'production') {
    REQUIRED_ENV_VARS.production.forEach(varName => {
      if (!process.env[varName]) {
        errors.push(`❌ Missing production variable: ${varName}`);
      }
    });
  }

  // Check recommended vars (warnings)
  REQUIRED_ENV_VARS.recommended.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`⚠️  Recommended variable missing: ${varName}`);
    }
  });

  // Check JWT_SECRET strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      warnings.push('⚠️  JWT_SECRET should be at least 32 characters for security');
    }

    // Check for default/weak secrets
    const weakSecrets = ['secret', 'your-secret', 'change-me', 'dev'];
    if (weakSecrets.some(weak => process.env.JWT_SECRET.toLowerCase().includes(weak))) {
      if (env === 'production') {
        errors.push('❌ JWT_SECRET appears to be a default/weak value - change it!');
      } else {
        warnings.push('⚠️  JWT_SECRET appears to be a default value');
      }
    }
  }

  return { errors, warnings };
}

/**
 * Check and log environment validation
 */
function checkEnv() {
  const { errors, warnings } = validateEnv();
  const env = process.env.NODE_ENV || 'development';

  console.log('\n🔐 Environment Validation:');
  console.log(`   Mode: ${env}`);

  if (errors.length > 0) {
    console.error('\n❌ CRITICAL ERRORS:');
    errors.forEach(error => console.error(`   ${error}`));
    console.error('\n💀 Server cannot start with missing required variables');
    console.error('   Check .env.example for reference\n');
    // In serverless environment, throw instead of process.exit
    if (process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      throw new Error('Missing required environment variables: ' + errors.join(', '));
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  WARNINGS:');
    warnings.forEach(warning => console.warn(`   ${warning}`));
    console.warn('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('   ✅ All required variables present');
    console.log('');
  }
}

/**
 * Get environment info for logging
 */
function getEnvInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4000,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasSentry: !!process.env.SENTRY_DSN_BACKEND,
    corsOrigin: process.env.CORS_ORIGIN || 'default',
  };
}

/**
 * Validate specific environment variable
 */
function validateEnvVar(varName, options = {}) {
  const value = process.env[varName];

  if (!value && options.required) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }

  if (value && options.minLength && value.length < options.minLength) {
    throw new Error(`${varName} must be at least ${options.minLength} characters`);
  }

  if (value && options.pattern && !options.pattern.test(value)) {
    throw new Error(`${varName} has invalid format`);
  }

  return value;
}

module.exports = {
  validateEnv,
  checkEnv,
  getEnvInfo,
  validateEnvVar,
  REQUIRED_ENV_VARS
};
