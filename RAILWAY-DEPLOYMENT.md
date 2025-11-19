# 🚂 Railway Deployment Guide

**Самый простой способ задеплоить AI Tarot Decision Assistant**

**Время**: 30-45 минут
**Стоимость**: $0-5/месяц для старта

---

## 🎯 ЧТО ТАКОЕ RAILWAY?

Railway - это современная платформа для деплоя, которая:
- ✅ Автоматически деплоит из Git
- ✅ Предоставляет бесплатный SSL
- ✅ Имеет простой UI
- ✅ Поддерживает Docker
- ✅ Масштабируется автоматически

**Perfect для MVP!**

---

## 📋 ШАГ ЗА ШАГОМ

### ШАГ 1: Установка Railway CLI (2 минуты)

```bash
# Install globally
npm install -g @railway/cli

# Verify installation
railway --version
```

✅ **Результат**: CLI установлен

---

### ШАГ 2: Регистрация и Login (3 минуты)

1. **Откройте**: https://railway.app
2. **Sign up** через GitHub (рекомендуется)
3. **В терминале**:
   ```bash
   railway login
   ```
4. **Авторизуйтесь** в браузере

✅ **Результат**: Залогинились в Railway

---

### ШАГ 3: Инициализация проекта (2 минуты)

```bash
# В корне проекта
cd "C:\Users\siniy\WebstormProjects\AI Tarot Decision Assistant"

# Initialize Railway project
railway init

# Выберите:
# - Create new project: Yes
# - Project name: tarot-assistant (или любое)
```

✅ **Результат**: Railway проект создан

---

### ШАГ 4: Добавление Environment Variables (10 минут)

**Вариант A: Через CLI (быстрее)**

```bash
# Set variables one by one
railway variables set NODE_ENV=production
railway variables set PORT=4000
railway variables set JWT_SECRET=iAcuC4f1RRJggSio+O4tVmzJ2G5T+XwH4lgTf50SG3U=
railway variables set JWT_REFRESH_SECRET=yRHcqzjw77UyTFz6eQhfhPdtRcRw+CPvTIbEaC6p+Fw=

# Stripe keys (после получения)
railway variables set STRIPE_SECRET_KEY=sk_live_your_key
railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_your_key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_secret
railway variables set STRIPE_PREMIUM_PRICE_ID=price_your_price_id

# CORS (будет обновлено после получения домена)
railway variables set CORS_ORIGIN=https://tarot-assistant.up.railway.app
railway variables set FRONTEND_URL=https://tarot-assistant.up.railway.app
```

**Вариант B: Через Dashboard (визуальнее)**

1. Откройте Railway Dashboard
2. Ваш проект → Variables
3. Add Variable для каждой переменной из `.env.production`

✅ **Результат**: Все environment variables добавлены

---

### ШАГ 5: Настройка Build & Start команд (2 минуты)

Railway автоматически определит package.json, но можно задать явно:

**В Railway Dashboard:**
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`

Или создайте `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

✅ **Результат**: Build настроен

---

### ШАГ 6: Deploy! (5 минут)

```bash
# Deploy to Railway
railway up

# Или если используете Git:
git add .
git commit -m "Ready for production"
git push

# Railway автоматически задеплоит
```

**Процесс:**
1. Railway получает код
2. Запускает `npm install`
3. Запускает `npm run build`
4. Создаёт container
5. Запускает `npm run start:prod`
6. Назначает public URL

⏱️ **Время**: 3-5 минут

✅ **Результат**: App deployed!

---

### ШАГ 7: Получение URL (1 минута)

```bash
# Get your app URL
railway domain

# Или в Dashboard:
# Your project → Settings → Domains
```

**URL будет**:
```
https://tarot-assistant.up.railway.app
```

Или подключите custom domain:
```
https://your-domain.com
```

✅ **Результат**: URL получен

---

### ШАГ 8: Seed Database (2 минуты)

После первого deploy:

```bash
# SSH в Railway container
railway run node src/backend/scripts/seed-cards.js

# Или через Dashboard:
# → Variables → Add temporary variable:
# RUN_SEED=true

# Затем в коде проверяйте:
# if (process.env.RUN_SEED === 'true') { await seedCards(); }
```

✅ **Результат**: 78 карт засеяны в production

---

### ШАГ 9: Обновление Stripe Webhook URL (2 минуты)

1. **Stripe Dashboard** → Developers → Webhooks
2. **Edit endpoint**
3. **Обновите URL**:
   ```
   https://tarot-assistant.up.railway.app/api/stripe/webhook
   ```
4. **Save**

✅ **Результат**: Webhook указывает на production

---

### ШАГ 10: Обновление CORS (2 минуты)

```bash
# Update CORS to match your domain
railway variables set CORS_ORIGIN=https://tarot-assistant.up.railway.app
railway variables set FRONTEND_URL=https://tarot-assistant.up.railway.app
```

Railway автоматически redeploy after variable changes.

✅ **Результат**: CORS настроен

---

## 🧪 POST-DEPLOYMENT TESTING

### Test Checklist:

```bash
# 1. Health check
curl https://tarot-assistant.up.railway.app/health

# 2. Cards API
curl https://tarot-assistant.up.railway.app/api/cards

# 3. Open in browser
https://tarot-assistant.up.railway.app
```

**Тестируйте:**
- [ ] Frontend загружается
- [ ] Можно зарегистрироваться
- [ ] Можно войти
- [ ] Расклад дня работает
- [ ] Анализ решения работает
- [ ] Stripe checkout открывается
- [ ] Все 78 карт доступны

---

## 📊 MONITORING

### Railway Dashboard:

**Metrics:**
- CPU usage
- Memory usage
- Network traffic
- Deployment history

**Logs:**
```bash
# View logs
railway logs

# Follow logs
railway logs -f
```

**Alerts:**
- Setup в Dashboard → Settings → Notifications
- Email при downtime
- Slack integration

---

### External Monitoring:

**UptimeRobot (бесплатный):**
1. Создайте аккаунт на uptimerobot.com
2. Add Monitor
3. URL: `https://tarot-assistant.up.railway.app/health`
4. Interval: 5 minutes
5. Alert: Email

---

## 💰 PRICING

**Railway Pricing:**

**Free Tier:**
- $5 credit (one-time)
- ~500 hours runtime
- Ideal для testing

**Hobby Plan ($5/месяц):**
- $5 credit/month
- 500GB bandwidth
- Good для small MVPs

**Pro Plan ($20/месяц):**
- $20 credit/month
- Priority support
- Better для growing apps

**Наше использование (estimated):**
- CPU: Low (~$2/месяц)
- Memory: 512MB (~$1/месяц)
- Network: <100GB (~$1/месяц)
- **Total**: ~$4/месяц

---

## 🔄 UPDATES & ROLLBACKS

### Deploy Update:

```bash
# Method 1: Git push
git add .
git commit -m "Update: новая функция"
git push
# Railway автоматически redeploy

# Method 2: CLI
railway up
```

### Rollback:

```bash
# В Dashboard:
# Deployments → Previous deployment → Redeploy

# Или через CLI:
railway rollback
```

---

## 🆘 TROUBLESHOOTING

### "Build failed"

**Check:**
- Build logs в Railway Dashboard
- package.json scripts правильные
- Dependencies установлены

**Fix:**
```bash
railway logs
# Найдите ошибку и исправьте
```

### "App crashes on start"

**Check:**
- Start command правильный
- Environment variables установлены
- Database доступна

**Fix:**
```bash
railway logs -f
# Смотрите error при старте
```

### "Can't connect to app"

**Check:**
- PORT environment variable
- App слушает на process.env.PORT
- Health check endpoint работает

---

## ✅ RAILWAY DEPLOYMENT COMPLETE!

**После всех шагов:**
- ✅ App deployed на Railway
- ✅ Public URL доступен
- ✅ SSL автоматически
- ✅ Logs доступны
- ✅ Monitoring настроен

**Your app**: `https://tarot-assistant.up.railway.app`

**Следующие шаги:**
1. Протестировать production
2. Пригласить beta users
3. Начать маркетинг!

**Успешного запуска! 🚀**
