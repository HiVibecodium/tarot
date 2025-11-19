/**
 * Pre-deployment Checklist
 * Validates that all required configurations are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Pre-Deployment Checklist...\n');

const checks = [];
let passedCount = 0;
let failedCount = 0;

// Check function
function check(name, condition, details = '') {
  const status = condition ? '✅' : '❌';
  const result = { name, passed: condition, details };
  checks.push(result);

  if (condition) {
    passedCount++;
    console.log(`${status} ${name}`);
  } else {
    failedCount++;
    console.log(`${status} ${name}`);
    if (details) console.log(`   ${details}`);
  }
}

// 1. Environment files
console.log('📋 Environment Configuration:\n');

const envProdExists = fs.existsSync(path.join(__dirname, '../.env.production'));
check('Production .env file exists', envProdExists, 'Create .env.production file');

const frontendEnvExists = fs.existsSync(path.join(__dirname, '../src/frontend/.env.production'));
check('Frontend production .env exists', frontendEnvExists, 'Create src/frontend/.env.production');

// 2. Build files
console.log('\n📦 Build Configuration:\n');

const dockerfileExists = fs.existsSync(path.join(__dirname, '../Dockerfile'));
check('Dockerfile exists', dockerfileExists);

const dockerComposeExists = fs.existsSync(path.join(__dirname, '../docker-compose.yml'));
check('docker-compose.yml exists', dockerComposeExists);

const dockerIgnoreExists = fs.existsSync(path.join(__dirname, '../.dockerignore'));
check('.dockerignore exists', dockerIgnoreExists);

// 3. Required dependencies
console.log('\n📚 Dependencies:\n');

const packageJson = require('../package.json');
const hasStripe = packageJson.dependencies.stripe !== undefined;
check('Stripe SDK installed', hasStripe);

const hasExpress = packageJson.dependencies.express !== undefined;
check('Express installed', hasExpress);

const hasBcrypt = packageJson.dependencies.bcryptjs !== undefined;
check('bcryptjs installed', hasBcrypt);

// 4. Frontend build
console.log('\n🎨 Frontend Build:\n');

const distExists = fs.existsSync(path.join(__dirname, '../src/frontend/dist'));
check('Frontend dist folder exists', distExists, 'Run: npm run build');

if (distExists) {
  const indexExists = fs.existsSync(path.join(__dirname, '../src/frontend/dist/index.html'));
  check('Frontend index.html built', indexExists);
}

// 5. Backend structure
console.log('\n🔧 Backend Structure:\n');

const controllersExist = fs.existsSync(path.join(__dirname, '../src/backend/controllers'));
check('Controllers directory exists', controllersExist);

const routesExist = fs.existsSync(path.join(__dirname, '../src/backend/routes'));
check('Routes directory exists', routesExist);

const modelsExist = fs.existsSync(path.join(__dirname, '../src/backend/models'));
check('Models directory exists', modelsExist);

// 6. Security checks
console.log('\n🔒 Security:\n');

if (envProdExists) {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.production'), 'utf-8');

  const hasRealJWTSecret = !envContent.includes('CHANGE-THIS');
  check('JWT_SECRET is customized', hasRealJWTSecret, 'Change JWT_SECRET in .env.production');

  const hasRealStripeKey = !envContent.includes('YOUR_PRODUCTION_SECRET_KEY');
  check('Stripe keys configured', hasRealStripeKey, 'Add real Stripe keys');
}

// 7. Package.json scripts
console.log('\n📜 Scripts:\n');

const hasStartScript = packageJson.scripts.start !== undefined;
check('Start script defined', hasStartScript);

const hasBuildScript = packageJson.scripts.build !== undefined;
check('Build script defined', hasBuildScript);

const hasDockerScript = packageJson.scripts['docker:build'] !== undefined;
check('Docker scripts defined', hasDockerScript);

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY:');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passedCount}`);
console.log(`❌ Failed: ${failedCount}`);
console.log(`📈 Total:  ${checks.length}`);
console.log('='.repeat(50));

if (failedCount === 0) {
  console.log('\n🎉 All checks passed! Ready for deployment!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Fix them before deploying.\n');
  process.exit(1);
}
