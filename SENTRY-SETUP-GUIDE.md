# 📊 Sentry Error Tracking - Setup Guide

**Status**: ✅ Integrated (disabled by default)
**Purpose**: Production error tracking and monitoring

---

## 🎯 Why Sentry?

Sentry provides:
- **Automatic error tracking** in production
- **Stack traces** with source maps
- **Performance monitoring** (API response times)
- **Session replay** for debugging user issues
- **Email alerts** when errors occur
- **Free tier**: 5,000 errors/month

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Sentry Account

1. Go to **https://sentry.io**
2. Sign up (free plan is fine)
3. Create organization: "AI Tarot Assistant"

### Step 2: Create Two Projects

**Project 1: Backend (Node.js)**
- Platform: Node.js
- Project name: `tarot-backend`
- Copy DSN: `https://xxx@sentry.io/yyy`

**Project 2: Frontend (React)**
- Platform: React
- Project name: `tarot-frontend`
- Copy DSN: `https://zzz@sentry.io/www`

### Step 3: Add DSNs to Environment

**Backend (.env)**:
```bash
# Sentry Error Tracking
SENTRY_DSN_BACKEND=https://your-backend-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=1.0
```

**Frontend (src/frontend/.env.local)**:
```bash
# Sentry Error Tracking
VITE_SENTRY_DSN=https://your-frontend-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_ENABLED=true
```

### Step 4: Test It Works

**Backend test**:
```bash
# Add to any route temporarily
throw new Error('Test Sentry Backend');
```

**Frontend test**:
```javascript
// Add to any component temporarily
throw new Error('Test Sentry Frontend');
```

Visit the route → Check Sentry dashboard → Should see error!

---

## 📋 Configuration Details

### Backend Configuration

**File**: `src/backend/config/sentry.js`

**Features**:
- ✅ Automatic error capture
- ✅ Performance monitoring
- ✅ Request tracking
- ✅ User context (no email for privacy)
- ✅ Sensitive data filtering
- ✅ Custom breadcrumbs

**Privacy**:
- Passwords filtered
- Tokens filtered
- Email addresses removed
- IP addresses not captured

### Frontend Configuration

**File**: `src/frontend/src/config/sentry.js`

**Features**:
- ✅ React Error Boundary
- ✅ Navigation tracking
- ✅ Session Replay (10% sample)
- ✅ Performance traces
- ✅ User feedback widget

**Privacy**:
- All text masked in replays
- All media blocked in replays
- Sensitive form fields filtered

---

## 🔒 Security & Privacy

### Data NOT Sent to Sentry:
- ❌ User passwords
- ❌ JWT tokens
- ❌ API keys
- ❌ User email addresses
- ❌ IP addresses
- ❌ Cookie values
- ❌ Authorization headers

### Data Sent to Sentry:
- ✅ Error messages
- ✅ Stack traces
- ✅ User ID (numeric/hash only)
- ✅ Browser info
- ✅ URL visited
- ✅ Breadcrumbs (navigation history)

---

## 🎛️ Environment Control

### Development
```bash
SENTRY_ENVIRONMENT=development
VITE_SENTRY_ENABLED=false
```
Result: Errors logged to console only, NOT sent to Sentry

### Staging
```bash
SENTRY_ENVIRONMENT=staging
VITE_SENTRY_ENABLED=true
```
Result: Errors sent to Sentry with "staging" tag

### Production
```bash
SENTRY_ENVIRONMENT=production
VITE_SENTRY_ENABLED=true
```
Result: Full error tracking enabled

---

## 📊 Sample Rates

### Backend
```bash
# Trace 100% of requests (development)
SENTRY_TRACES_SAMPLE_RATE=1.0

# Trace 10% of requests (production - reduce cost)
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### Frontend
Configured in `src/frontend/src/config/sentry.js`:
```javascript
tracesSampleRate: environment === 'production' ? 0.1 : 1.0
replaysSessionSampleRate: 0.1  // 10% of sessions
replaysOnErrorSampleRate: 1.0  // 100% of errors
```

---

## 🚨 Error Filtering

### Ignored Errors (not sent to Sentry):

**Backend**:
- Network errors
- Cancelled requests
- 4xx validation errors (user errors)

**Frontend**:
- Browser extension errors
- Network failures
- React hydration warnings
- Third-party script errors

---

## 📈 Using Sentry Data

### In Code (Backend):
```javascript
const { captureException, addBreadcrumb, setUser } = require('./config/sentry');

// Capture custom error
try {
  // risky operation
} catch (error) {
  captureException(error, {
    tags: { feature: 'tarot-reading' },
    extra: { userId: user.id }
  });
}

// Add context
addBreadcrumb('User started reading', { type: 'decision' });

// Set user context
setUser({ id: user._id, username: user.name });
```

### In Code (Frontend):
```javascript
import { captureException, addBreadcrumb } from './config/sentry';

// Capture custom error
try {
  // risky operation
} catch (error) {
  captureException(error, {
    tags: { component: 'DailyReadingPage' }
  });
}

// Add breadcrumb
addBreadcrumb('Card revealed', { cardId: card._id });
```

---

## 🎯 Best Practices

### 1. Don't Over-Track
```javascript
// ❌ Bad
captureException(new Error('User clicked button'));

// ✅ Good
// Only capture unexpected errors
```

### 2. Add Context
```javascript
// ✅ Good
captureException(error, {
  tags: {
    feature: 'stripe-payment',
    plan: 'premium'
  },
  extra: {
    amount: 499,
    currency: 'RUB'
  }
});
```

### 3. Use Breadcrumbs
```javascript
// Before error happens
addBreadcrumb('User started checkout');
addBreadcrumb('Payment method selected', { method: 'card' });
// Error occurs - breadcrumbs show what led to it
```

---

## 📧 Alerts Setup

In Sentry dashboard:
1. Go to **Alerts** → **Create Alert**
2. **Type**: Issues
3. **Conditions**:
   - When: new issue is created
   - If: error level is >= error
4. **Actions**: Email to admin@example.com

---

## 💰 Free Tier Limits

**Sentry Free Plan**:
- 5,000 errors/month
- 10,000 performance events/month
- 30 days retention
- 1 team member

**If exceeded**:
- Oldest events are dropped
- Upgrade to paid: $26/month (50K errors)

---

## 🔍 Checking Sentry Works

### After deployment:

1. **Open Sentry dashboard**: https://sentry.io
2. **Check Issues tab**: Should see errors (if any)
3. **Check Performance tab**: Should see transaction traces
4. **Check Releases**: Should see your app version

### Trigger test error:

**Frontend**:
- Add `?sentry-test=true` to URL
- Should crash with test error
- Check Sentry → Should appear in 30s

**Backend**:
- Visit `/api/sentry-test` (if you add route)
- Check Sentry → Should appear immediately

---

## 🐛 Troubleshooting

### "Sentry not initialized"
→ Check `.env` has `SENTRY_DSN_BACKEND` set

### "Errors not appearing in Sentry"
→ Check `SENTRY_ENVIRONMENT=development` (doesn't send in dev)
→ Change to `staging` or `production`

### "Too many events"
→ Reduce sample rates:
```bash
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% only
```

### "Sensitive data in Sentry"
→ Check `beforeSend` hook in config
→ Add more filtering

---

## ✅ Checklist

Before going to production:

- [ ] Sentry account created
- [ ] Two projects created (frontend + backend)
- [ ] DSN keys added to `.env.production`
- [ ] `VITE_SENTRY_ENABLED=true`
- [ ] `SENTRY_ENVIRONMENT=production`
- [ ] Test error captured successfully
- [ ] Email alerts configured
- [ ] Source maps uploaded (optional)
- [ ] Team members invited (optional)

---

## 📚 Resources

- **Sentry Docs**: https://docs.sentry.io
- **Node.js SDK**: https://docs.sentry.io/platforms/node/
- **React SDK**: https://docs.sentry.io/platforms/javascript/guides/react/
- **Best Practices**: https://docs.sentry.io/product/best-practices/

---

**Status**: ✅ **READY FOR PRODUCTION**

Sentry is fully integrated and will activate automatically when:
- `SENTRY_DSN_BACKEND` is set
- `VITE_SENTRY_ENABLED=true`
- `SENTRY_ENVIRONMENT=production`

Without these env vars, app works normally (no Sentry overhead).
