#!/usr/bin/env node

/**
 * Comprehensive System Audit
 * Проверяет все аспекты приложения: Performance, Security, Features, UX
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class SystemAuditor {
  constructor() {
    this.results = {
      performance: [],
      security: [],
      features: [],
      ux: [],
      monetization: [],
      analytics: []
    };
    this.score = {
      performance: 0,
      security: 0,
      features: 0,
      ux: 0,
      monetization: 0,
      analytics: 0
    };
  }

  log(category, status, message, recommendation = '') {
    const icons = { pass: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' };
    console.log(`${icons[status]} [${category.toUpperCase()}] ${message}`);
    if (recommendation) {
      console.log(`   ${COLORS.cyan}→ ${recommendation}${COLORS.reset}`);
    }

    this.results[category].push({ status, message, recommendation });

    if (status === 'pass') this.score[category] += 10;
    else if (status === 'warn') this.score[category] += 5;
  }

  // ===== PERFORMANCE AUDITS =====
  async auditPerformance() {
    console.log(`\n${COLORS.blue}${'='.repeat(60)}`);
    console.log(`🚀 PERFORMANCE AUDIT`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    // Check for lazy loading
    const appJsx = path.join(__dirname, '../src/frontend/src/App.jsx');
    if (fs.existsSync(appJsx)) {
      const content = fs.readFileSync(appJsx, 'utf8');
      if (content.includes('lazy(')) {
        this.log('performance', 'pass', 'Code splitting with lazy() implemented');
      } else {
        this.log('performance', 'warn', 'No lazy loading found',
          'Add React.lazy() for heavy components');
      }
    }

    // Check for PWA manifest
    const manifest = path.join(__dirname, '../src/frontend/public/manifest.json');
    if (fs.existsSync(manifest)) {
      this.log('performance', 'pass', 'PWA manifest.json exists');
    } else {
      this.log('performance', 'fail', 'No PWA manifest found',
        'Create manifest.json for installable app');
    }

    // Check for service worker
    const swPath = path.join(__dirname, '../src/frontend/public/service-worker.js');
    if (fs.existsSync(swPath)) {
      this.log('performance', 'pass', 'Service Worker exists for offline support');
    } else {
      this.log('performance', 'warn', 'No Service Worker found',
        'Add service worker for offline caching');
    }

    // Check for bundle optimization in package.json
    const pkgJson = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../src/frontend/package.json'), 'utf8'
    ));

    if (pkgJson.scripts && pkgJson.scripts.build) {
      this.log('performance', 'pass', 'Build script configured');
    }

    // Check for image optimization
    const publicDir = path.join(__dirname, '../src/frontend/public');
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      const hasWebp = files.some(f => f.endsWith('.webp'));
      const hasLargeImages = files.some(f => {
        if (f.match(/\.(jpg|png)$/)) {
          const stats = fs.statSync(path.join(publicDir, f));
          return stats.size > 200 * 1024; // > 200KB
        }
        return false;
      });

      if (hasWebp) {
        this.log('performance', 'pass', 'WebP images used for optimization');
      }
      if (hasLargeImages) {
        this.log('performance', 'warn', 'Large images detected (>200KB)',
          'Compress images or use WebP format');
      }
    }
  }

  // ===== SECURITY AUDITS =====
  async auditSecurity() {
    console.log(`\n${COLORS.red}${'='.repeat(60)}`);
    console.log(`🔒 SECURITY AUDIT`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    // Check for .env.example
    const envExample = path.join(__dirname, '../.env.example');
    if (fs.existsSync(envExample)) {
      this.log('security', 'pass', '.env.example exists for safe config');
    } else {
      this.log('security', 'warn', 'No .env.example found',
        'Create .env.example to document required variables');
    }

    // Check if .env is in .gitignore
    const gitignore = path.join(__dirname, '../.gitignore');
    if (fs.existsSync(gitignore)) {
      const content = fs.readFileSync(gitignore, 'utf8');
      if (content.includes('.env')) {
        this.log('security', 'pass', '.env is gitignored');
      } else {
        this.log('security', 'fail', '.env not in .gitignore',
          'Add .env to .gitignore immediately!');
      }
    }

    // Check for security packages
    const rootPkg = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../package.json'), 'utf8'
    ));

    const securityPkgs = ['helmet', 'express-rate-limit', 'express-mongo-sanitize', 'xss-clean'];
    securityPkgs.forEach(pkg => {
      if (rootPkg.dependencies && rootPkg.dependencies[pkg]) {
        this.log('security', 'pass', `${pkg} installed for security`);
      } else {
        this.log('security', 'warn', `${pkg} not found`,
          `Install ${pkg} for better security`);
      }
    });

    // Check backend for security middleware
    const backendIndex = path.join(__dirname, '../src/backend/index-json.js');
    if (fs.existsSync(backendIndex)) {
      const content = fs.readFileSync(backendIndex, 'utf8');

      if (content.includes('helmet')) {
        this.log('security', 'pass', 'Helmet middleware configured');
      }

      if (content.includes('rateLimit')) {
        this.log('security', 'pass', 'Rate limiting implemented');
      }

      if (content.includes('cors')) {
        this.log('security', 'pass', 'CORS configured');
      }
    }
  }

  // ===== FEATURES AUDIT =====
  async auditFeatures() {
    console.log(`\n${COLORS.green}${'='.repeat(60)}`);
    console.log(`✨ FEATURES AUDIT`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    // Check for key pages
    const pages = [
      'DailyReadingPage',
      'DecisionPage',
      'HistoryPage',
      'AnalyticsPage',
      'ProfilePage',
      'PremiumPage',
      'QuizPage',
      'JournalPage',
      'AchievementsPage'
    ];

    const pagesDir = path.join(__dirname, '../src/frontend/src/pages');
    pages.forEach(page => {
      const pagePath = path.join(pagesDir, `${page}.jsx`);
      if (fs.existsSync(pagePath)) {
        this.log('features', 'pass', `${page} implemented`);
      } else {
        this.log('features', 'warn', `${page} not found`,
          `Implement ${page} per roadmap`);
      }
    });

    // Check for spread types
    const spreadTypes = [
      'CelticCrossPage',
      'RelationshipSpreadPage',
      'CareerPathPage',
      'YearSpreadPage'
    ];

    spreadTypes.forEach(spread => {
      const spreadPath = path.join(pagesDir, `${spread}.jsx`);
      if (fs.existsSync(spreadPath)) {
        this.log('features', 'pass', `${spread} spread available`);
      }
    });

    // Check for key components
    const components = [
      'MoodSelector',
      'GuidedInterpretation',
      'AchievementBadge',
      'PersonalizedInsights',
      'VoiceReader'
    ];

    const componentsDir = path.join(__dirname, '../src/frontend/src/components');
    components.forEach(comp => {
      const compPath = path.join(componentsDir, `${comp}.jsx`);
      if (fs.existsSync(compPath)) {
        this.log('features', 'pass', `${comp} component exists`);
      } else {
        this.log('features', 'warn', `${comp} not found`,
          `Add ${comp} for better UX`);
      }
    });
  }

  // ===== UX AUDIT =====
  async auditUX() {
    console.log(`\n${COLORS.magenta}${'='.repeat(60)}`);
    console.log(`🎨 UX/UI AUDIT`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    // Check for loading states
    const componentsDir = path.join(__dirname, '../src/frontend/src/components');
    const skeletonsPath = path.join(componentsDir, 'skeletons');

    if (fs.existsSync(skeletonsPath)) {
      this.log('ux', 'pass', 'Loading skeleton components found');
    } else {
      this.log('ux', 'warn', 'No skeleton loaders found',
        'Add skeleton screens for better perceived performance');
    }

    // Check for error handling
    const errorDisplayPath = path.join(componentsDir, 'ErrorDisplay.jsx');
    if (fs.existsSync(errorDisplayPath)) {
      this.log('ux', 'pass', 'Error display component exists');
    } else {
      this.log('ux', 'warn', 'No error display component',
        'Add ErrorDisplay component for better error UX');
    }

    // Check for toast notifications
    const toastPath = path.join(componentsDir, 'Toast.jsx');
    if (fs.existsSync(toastPath)) {
      this.log('ux', 'pass', 'Toast notifications available');
    }

    // Check for onboarding
    const onboardingPath = path.join(componentsDir, 'Onboarding.jsx');
    if (fs.existsSync(onboardingPath)) {
      this.log('ux', 'pass', 'Onboarding flow implemented');
    } else {
      this.log('ux', 'warn', 'No onboarding found',
        'Add onboarding tutorial for new users');
    }

    // Check for responsive CSS
    const appCss = path.join(__dirname, '../src/frontend/src/App.css');
    if (fs.existsSync(appCss)) {
      const content = fs.readFileSync(appCss, 'utf8');
      if (content.includes('@media')) {
        this.log('ux', 'pass', 'Responsive design media queries found');
      } else {
        this.log('ux', 'warn', 'No media queries in App.css',
          'Add responsive breakpoints for mobile/tablet');
      }
    }

    // Check for accessibility
    const hasAriaLabels = this.checkForPattern(
      path.join(__dirname, '../src/frontend/src'),
      'aria-label'
    );

    if (hasAriaLabels) {
      this.log('ux', 'pass', 'ARIA labels found for accessibility');
    } else {
      this.log('ux', 'warn', 'Limited ARIA labels',
        'Add aria-label attributes for screen readers');
    }
  }

  // ===== MONETIZATION AUDIT =====
  async auditMonetization() {
    console.log(`\n${COLORS.yellow}${'='.repeat(60)}`);
    console.log(`💰 MONETIZATION AUDIT`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    // Check for Stripe integration
    const rootPkg = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../package.json'), 'utf8'
    ));

    if (rootPkg.dependencies && rootPkg.dependencies['stripe']) {
      this.log('monetization', 'pass', 'Stripe package installed');
    } else {
      this.log('monetization', 'fail', 'Stripe not installed',
        'Run: npm install stripe');
    }

    // Check for payment routes
    const hasPaymentRoutes = this.checkForPattern(
      path.join(__dirname, '../src/backend/api/routes'),
      'payment|subscription|checkout'
    );

    if (hasPaymentRoutes) {
      this.log('monetization', 'pass', 'Payment routes exist');
    } else {
      this.log('monetization', 'warn', 'No payment routes found',
        'Create payment/subscription API routes');
    }

    // Check for Premium page
    const premiumPage = path.join(__dirname, '../src/frontend/src/pages/PremiumPage.jsx');
    if (fs.existsSync(premiumPage)) {
      this.log('monetization', 'pass', 'Premium page exists');

      const content = fs.readFileSync(premiumPage, 'utf8');
      if (content.includes('Stripe') || content.includes('checkout')) {
        this.log('monetization', 'pass', 'Premium page has payment integration');
      } else {
        this.log('monetization', 'warn', 'Premium page exists but no payment flow',
          'Add Stripe checkout to Premium page');
      }
    }

    // Check for feature gating
    const hasFeatureGating = this.checkForPattern(
      path.join(__dirname, '../src/frontend/src'),
      'isPremium|hasPremium|subscription'
    );

    if (hasFeatureGating) {
      this.log('monetization', 'pass', 'Premium feature gating implemented');
    } else {
      this.log('monetization', 'warn', 'No clear premium feature gating',
        'Add premium checks to restrict features');
    }
  }

  // ===== ANALYTICS AUDIT =====
  async auditAnalytics() {
    console.log(`\n${COLORS.cyan}${'='.repeat(60)}`);
    console.log(`📊 ANALYTICS AUDIT`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    // Check for analytics page
    const analyticsPage = path.join(__dirname, '../src/frontend/src/pages/AnalyticsPage.jsx');
    if (fs.existsSync(analyticsPage)) {
      this.log('analytics', 'pass', 'Analytics page implemented');

      const content = fs.readFileSync(analyticsPage, 'utf8');
      if (content.includes('Chart') || content.includes('graph')) {
        this.log('analytics', 'pass', 'Charts/visualizations in analytics');
      }
    } else {
      this.log('analytics', 'warn', 'No analytics page',
        'Create analytics dashboard per roadmap');
    }

    // Check for tracking services
    const rootPkg = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../package.json'), 'utf8'
    ));

    const analyticsPkgs = ['@sentry/node', 'mixpanel', 'google-analytics'];
    analyticsPkgs.forEach(pkg => {
      if (rootPkg.dependencies && (rootPkg.dependencies[pkg] || pkg.includes('sentry') && rootPkg.dependencies['@sentry/node'])) {
        this.log('analytics', 'pass', `${pkg} tracking available`);
      }
    });

    // Check for user stats endpoint
    const hasStatsEndpoint = this.checkForPattern(
      path.join(__dirname, '../src/backend/api/routes'),
      'stats|analytics|insights'
    );

    if (hasStatsEndpoint) {
      this.log('analytics', 'pass', 'Stats/analytics API endpoints exist');
    } else {
      this.log('analytics', 'warn', 'No analytics endpoints',
        'Add /api/users/stats endpoint');
    }

    // Check for PersonalizedInsights
    const insightsComp = path.join(__dirname, '../src/frontend/src/components/PersonalizedInsights.jsx');
    if (fs.existsSync(insightsComp)) {
      this.log('analytics', 'pass', 'PersonalizedInsights component exists');
    } else {
      this.log('analytics', 'warn', 'No PersonalizedInsights component',
        'Add insights component for user patterns');
    }
  }

  // ===== HELPER METHODS =====
  checkForPattern(dir, pattern) {
    if (!fs.existsSync(dir)) return false;

    const regex = new RegExp(pattern, 'i');
    const files = this.getAllFiles(dir);

    return files.some(file => {
      const content = fs.readFileSync(file, 'utf8');
      return regex.test(content);
    });
  }

  getAllFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.includes('node_modules')) {
        this.getAllFiles(fullPath, files);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        files.push(fullPath);
      }
    });

    return files;
  }

  // ===== FINAL REPORT =====
  printReport() {
    console.log(`\n${COLORS.blue}${'='.repeat(60)}`);
    console.log(`📋 AUDIT SUMMARY`);
    console.log(`${'='.repeat(60)}${COLORS.reset}\n`);

    const categories = Object.keys(this.score);
    let totalScore = 0;
    let maxScore = 0;

    categories.forEach(cat => {
      const score = this.score[cat];
      const maxCatScore = this.results[cat].length * 10;
      const percentage = maxCatScore > 0 ? Math.round((score / maxCatScore) * 100) : 0;

      totalScore += score;
      maxScore += maxCatScore;

      const color = percentage >= 80 ? COLORS.green :
                    percentage >= 60 ? COLORS.yellow : COLORS.red;

      console.log(`${color}${cat.toUpperCase().padEnd(20)} ${score}/${maxCatScore} (${percentage}%)${COLORS.reset}`);
    });

    const overallPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const overallColor = overallPercentage >= 80 ? COLORS.green :
                         overallPercentage >= 60 ? COLORS.yellow : COLORS.red;

    console.log(`\n${overallColor}${'─'.repeat(60)}`);
    console.log(`OVERALL SCORE: ${totalScore}/${maxScore} (${overallPercentage}%)`);
    console.log(`${'─'.repeat(60)}${COLORS.reset}\n`);

    // Recommendations
    console.log(`${COLORS.cyan}🎯 TOP PRIORITY RECOMMENDATIONS:\n${COLORS.reset}`);

    const allIssues = [];
    categories.forEach(cat => {
      this.results[cat].forEach(item => {
        if (item.status === 'fail' || item.status === 'warn') {
          allIssues.push({
            category: cat,
            status: item.status,
            message: item.message,
            recommendation: item.recommendation
          });
        }
      });
    });

    // Sort by priority (fails first)
    allIssues.sort((a, b) => a.status === 'fail' ? -1 : 1);

    allIssues.slice(0, 10).forEach((issue, i) => {
      const icon = issue.status === 'fail' ? '🔴' : '🟡';
      console.log(`${i + 1}. ${icon} [${issue.category.toUpperCase()}] ${issue.message}`);
      if (issue.recommendation) {
        console.log(`   ${COLORS.cyan}→ ${issue.recommendation}${COLORS.reset}`);
      }
    });

    console.log(`\n${COLORS.green}✨ Audit complete! Review recommendations above.${COLORS.reset}\n`);
  }

  async run() {
    console.log(`${COLORS.blue}`);
    console.log(`╔${'═'.repeat(58)}╗`);
    console.log(`║${' '.repeat(15)}🔮 AI TAROT SYSTEM AUDIT 🔮${' '.repeat(15)}║`);
    console.log(`╚${'═'.repeat(58)}╝`);
    console.log(COLORS.reset);

    await this.auditPerformance();
    await this.auditSecurity();
    await this.auditFeatures();
    await this.auditUX();
    await this.auditMonetization();
    await this.auditAnalytics();

    this.printReport();

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      scores: this.score
    };

    const reportPath = path.join(__dirname, '../audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`${COLORS.green}📄 Full report saved to: audit-report.json${COLORS.reset}\n`);
  }
}

// Run audit
const auditor = new SystemAuditor();
auditor.run().catch(console.error);
