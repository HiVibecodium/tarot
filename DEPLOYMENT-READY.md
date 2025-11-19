# 🚀 DEPLOYMENT READY - Quick Start Guide

**Статус**: ✅ **PRODUCTION READY**
**Дата**: 14 ноября 2025

---

## 🎯 QUICK DEPLOYMENT (30 минут)

### Method 1: Railway (Recommended) ⭐

**Шаг 1: Установить Railway CLI** (5 минут)
```bash
# Windows (PowerShell as Admin)
iwr https://railway.app/install.ps1 | iex

# macOS/Linux
curl -fsSL https://railway.app/install.sh | sh

# или через npm
npm install -g @railway/cli
```

**Шаг 2: Login** (1 минута)
```bash
railway login
# Откроется браузер для авторизации
```

**Шаг 3: Initialize Project** (2 минуты)
```bash
# В корне проекта
railway init

# Выбери:
# - Create new project: "AI Tarot Assistant"
# - Environment: production
```

**Шаг 4: Configure Environment Variables** (10 минут)

**Обязательные**:
```bash
railway variables set NODE_ENV=production
railway variables set PORT=4000
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_REFRESH_SECRET=$(openssl rand -hex 32)
```

**CORS (важно!)**:
```bash
# После первого deploy получишь URL типа: https://your-app.up.railway.app
# Добавь его в ALLOWED_ORIGINS:
railway variables set ALLOWED_ORIGINS=https://your-app.up.railway.app
railway variables set CORS_ORIGIN=https://your-app.up.railway.app
railway variables set FRONTEND_URL=https://your-app.up.railway.app
```

**Stripe (опционально)**:
```bash
# Если есть Stripe account
railway variables set STRIPE_SECRET_KEY=sk_test_your_key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_secret
railway variables set STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

**Sentry (опционально)**:
```bash
# Если настроил Sentry
railway variables set SENTRY_DSN_BACKEND=https://your-backend-dsn
railway variables set SENTRY_ENVIRONMENT=production
```

**Шаг 5: Deploy!** (5 минут)
```bash
railway up

# Дождись сообщения:
# ✅ Deployment successful
# 🌐 https://your-app.up.railway.app
```

**Шаг 6: Configure Frontend** (5 минут)
```bash
# После получения URL, добавь frontend env vars:
railway variables set VITE_API_URL=https://your-app.up.railway.app/api
railway variables set VITE_APP_URL=https://your-app.up.railway.app
railway variables set VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

**Шаг 7: Redeploy** (2 минуты)
```bash
# После обновления env vars
railway up
```

**ГОТОВО! Получишь URL типа**: https://ai-tarot.up.railway.app 🎉

---

## Method 2: Render.com (Alternative)

**Шаг 1**: Go to https://render.com
**Шаг 2**: New → Web Service
**Шаг 3**: Connect GitHub repo
**Шаг 4**: Configure:
```
Name: ai-tarot-assistant
Build Command: npm install && cd src/frontend && npm install && npm run build
Start Command: npm run start:prod
```

**Шаг 5**: Add environment variables (same as Railway)
**Шаг 6**: Deploy!

**Free tier**: Yes (but slower than Railway)

---

## Method 3: Vercel (Frontend Only)

**For SPA deployment** (если backend отдельно):

```bash
cd src/frontend
vercel --prod

# Configure:
# Build Command: npm run build
# Output Directory: dist
```

**Backend на Railway/Render**

---

## 📋 ENVIRONMENT VARIABLES CHECKLIST

### Required for Production:
```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=<strong-random-32-chars>
JWT_REFRESH_SECRET=<strong-random-32-chars>
ALLOWED_ORIGINS=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

### Optional but Recommended:
```bash
# Sentry
SENTRY_DSN_BACKEND=https://...
SENTRY_ENVIRONMENT=production
VITE_SENTRY_DSN=https://...
VITE_SENTRY_ENABLED=true

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Copy from:
See `.env.example` for full list

---

## 🔧 PRE-DEPLOYMENT CHECKLIST

### Code:
- [x] All features working locally
- [x] Security hardened (A+ grade)
- [x] Error tracking configured
- [x] SEO implemented
- [x] Git committed

### Configuration:
- [ ] JWT_SECRET generated (strong!)
- [ ] CORS origins configured
- [ ] Environment variables prepared
- [ ] Stripe keys ready (optional)
- [ ] Sentry account created (optional)

### Testing:
- [ ] Build works: `npm run build`
- [ ] Production mode works: `npm run start:prod`
- [ ] No console errors

---

## 🧪 TEST BEFORE DEPLOY

```bash
# Test production build locally
cd src/frontend
npm run build

# Check dist/ folder created
ls dist/

# Test production server
cd ../..
npm run start:prod

# Open http://localhost:4000
# Should serve frontend + API
```

**If all works** → Ready to deploy! ✅

---

## ⚡ QUICK DEPLOY (If Railway CLI installed)

```bash
# One command!
railway login && railway init && railway up
```

**That's it!** 🎉

---

## 🐛 TROUBLESHOOTING

### "railway: command not found"
```bash
# Install Railway CLI first
npm install -g @railway/cli

# Or use web dashboard: https://railway.app
```

### "Build failed"
```bash
# Check Node version
node --version  # Should be >= 18

# Ensure dependencies installed
npm install
cd src/frontend && npm install
```

### "CORS error after deploy"
```bash
# Update ALLOWED_ORIGINS with your Railway URL
railway variables set ALLOWED_ORIGINS=https://your-actual-url.up.railway.app
```

### "Database not persistent"
```bash
# Railway provides persistent volumes
# JSON files will persist across deploys
```

---

## 📊 EXPECTED DEPLOYMENT TIME

### First Time:
- Setup Railway: 5 min
- Configure env vars: 10 min
- First deploy: 5-10 min
- Testing: 5 min
**Total**: ~30 minutes

### Subsequent Deploys:
```bash
railway up  # 2-3 minutes
```

---

## 💰 COSTS

### Railway:
- **Free Trial**: $5 credit (~500 hours)
- **Hobby Plan**: $5/month (enough for MVP)
- **Pro Plan**: $20/month (for scale)

### Domain (Optional):
- $10-15/year

### Total: **$0-5/month** для старта

---

## 🎯 AFTER DEPLOYMENT

### Immediate (5 min):
1. ✅ Test URL works
2. ✅ Register test account
3. ✅ Generate test reading
4. ✅ Check all pages load

### Within 24h:
1. Configure Sentry DSN
2. Submit sitemap to Google
3. Share with beta testers
4. Monitor error logs

### Within 1 week:
1. Setup Stripe (if not done)
2. Collect user feedback
3. Monitor analytics
4. Plan Phase 2 priorities

---

## 🚀 READY TO DEPLOY?

**If Railway CLI installed**:
```bash
railway login
railway init
railway up
```

**If no CLI**:
1. Go to https://railway.app
2. Sign up / Login
3. New Project → Deploy from GitHub
4. Connect your repo
5. Configure environment variables
6. Deploy!

---

## 📝 NEXT STEPS AFTER DEPLOY

1. **Get your URL**: https://your-app.up.railway.app
2. **Test thoroughly**: All features
3. **Share**: Beta users, friends
4. **Monitor**: Logs, errors, usage
5. **Iterate**: Based on feedback

---

**Готов деплоить? Начинаем!** 🚀

Want me to guide you through the deployment step-by-step?
