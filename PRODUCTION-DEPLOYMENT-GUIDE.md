# 🚀 Production Deployment Guide

**AI Tarot Decision Assistant** - Руководство по деплою в production

---

## 📋 Pre-Deployment Checklist

### ✅ Перед началом:

**1. Подготовка окружения:**
- [ ] Выбран хостинг (Railway, Render, DigitalOcean, AWS, etc.)
- [ ] Домен зарегистрирован (опционально)
- [ ] SSL сертификат готов (Let's Encrypt или через хостинг)

**2. Сторонние сервисы:**
- [ ] Stripe аккаунт создан (stripe.com)
- [ ] Production API ключи получены
- [ ] Продукт "Premium Subscription" создан в Stripe
- [ ] Webhook настроен в Stripe Dashboard

**3. База данных:**
- [ ] Выбрана MongoDB Atlas (рекомендуется) или JSON storage (для MVP)
- [ ] Cluster создан и connection string получен (если MongoDB)

---

## 🔧 Step 1: Настройка Environment Variables

### Backend (.env.production):

Скопируйте `.env.production` и заполните:

```bash
# ОБЯЗАТЕЛЬНО ИЗМЕНИТЬ:
NODE_ENV=production
PORT=4000
API_BASE_URL=https://your-domain.com

# JWT (генерируйте случайные строки 32+ символов)
JWT_SECRET=your-random-32-plus-char-secret-here
JWT_REFRESH_SECRET=different-random-32-plus-char-secret

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_... # от stripe.com/dashboard
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # после настройки webhook
STRIPE_PREMIUM_PRICE_ID=price_... # ID продукта Premium

# Database (если используете MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tarot-assistant

# CORS
CORS_ORIGIN=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### Frontend (src/frontend/.env.production):

```bash
VITE_API_URL=https://your-domain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_PREMIUM_ENABLED=true
```

---

## 🏗️ Step 2: Build Frontend

```bash
# Из корневой директории проекта:
npm run build

# Или напрямую:
cd src/frontend
npm run build
```

**Результат**: создаётся папка `src/frontend/dist/` с готовым production build.

---

## 🐳 Step 3: Docker Deployment (Рекомендуется)

### 3.1 Сборка образа:

```bash
docker build -t tarot-assistant .
```

### 3.2 Запуск с docker-compose:

```bash
# Запустить
docker-compose up -d

# Проверить логи
docker-compose logs -f

# Остановить
docker-compose down
```

### 3.3 Или запуск напрямую:

```bash
docker run -d \
  --name tarot-app \
  -p 4000:4000 \
  --env-file .env.production \
  -v $(pwd)/data:/app/data \
  tarot-assistant
```

---

## 🌐 Step 4: Deployment на хостинг

### Option A: Railway.app (Рекомендуется для начинающих)

**1. Установите Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Login:**
```bash
railway login
```

**3. Инициализация:**
```bash
railway init
```

**4. Добавьте environment variables:**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret
# ... и остальные переменные
```

**5. Deploy:**
```bash
railway up
```

**6. Получите URL:**
```bash
railway domain
```

---

### Option B: Render.com

**1. Создайте аккаунт на render.com**

**2. New Web Service:**
- Repository: подключите GitHub repo
- Build Command: `npm run build`
- Start Command: `npm run start:prod`

**3. Environment Variables:**
Добавьте все переменные из `.env.production`

**4. Deploy:**
Автоматически при push в main branch

---

### Option C: Vercel (только Frontend) + Railway (Backend)

**Frontend на Vercel:**
```bash
cd src/frontend
vercel --prod
```

**Backend на Railway:**
```bash
railway up
```

---

### Option D: DigitalOcean / AWS / VPS

**1. Подключитесь к серверу:**
```bash
ssh user@your-server-ip
```

**2. Установите Node.js и Docker:**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

**3. Клонируйте репозиторий:**
```bash
git clone your-repo-url
cd ai-tarot-decision-assistant
```

**4. Настройте .env.production**

**5. Запустите через Docker:**
```bash
docker-compose up -d
```

**6. Настройте Nginx как reverse proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**7. SSL с Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 Step 5: Stripe Configuration

### 5.1 Создайте продукт в Stripe:

1. Перейдите на stripe.com/dashboard
2. Products → Add Product
3. Настройки:
   - Name: "Premium Subscription"
   - Description: "Премиум подписка на Таро Помощник"
   - Pricing: Recurring
   - Price: ₽499 / month (или ваша цена)
   - Currency: RUB
4. Скопируйте **Price ID** (начинается с `price_...`)
5. Добавьте в `.env.production`: `STRIPE_PREMIUM_PRICE_ID=price_...`

### 5.2 Настройте Webhook:

1. Dashboard → Developers → Webhooks
2. Add endpoint
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Скопируйте **Signing secret** (начинается с `whsec_...`)
6. Добавьте в `.env.production`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 5.3 Получите API Keys:

1. Dashboard → Developers → API Keys
2. Скопируйте:
   - **Publishable key** (начинается с `pk_live_...`)
   - **Secret key** (начинается с `sk_live_...`)
3. Добавьте в `.env.production`

---

## 📊 Step 6: Database Setup

### Option A: MongoDB Atlas (Рекомендуется)

**1. Создайте бесплатный cluster:**
- Перейдите на mongodb.com/cloud/atlas
- Create Cluster (Free M0)
- Регион: ближайший к пользователям

**2. Настройте доступ:**
- Database Access → Add User
- Network Access → Add IP (0.0.0.0/0 для начала)

**3. Получите Connection String:**
- Connect → Connect your application
- Скопируйте URI
- Замените `<password>` на ваш пароль

**4. Обновите .env.production:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tarot-assistant
```

**5. Мигрируйте данные из JSON:**
```bash
# Опционально: создайте скрипт миграции
node src/backend/scripts/migrate-to-mongo.js
```

### Option B: JSON Storage (MVP)

JSON storage уже работает из коробки. Данные сохраняются в `/app/data/` внутри Docker контейнера.

**Важно**: Настройте volume для персистентности:
```yaml
volumes:
  - ./data:/app/data
```

---

## 🔒 Step 7: Security Hardening

### 7.1 JWT Secrets:

**Генерация случайных секретов:**
```bash
# Linux/Mac:
openssl rand -base64 32

# Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Добавьте в `.env.production`:
```
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
```

### 7.2 Rate Limiting:

Уже настроен в production (50 запросов/15 минут). При необходимости измените в `.env.production`:
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

### 7.3 HTTPS:

- ✅ Обязательно используйте HTTPS в production
- Railway/Render/Vercel предоставляют автоматически
- Для VPS используйте Let's Encrypt (certbot)

---

## 📦 Step 8: Seed Database

**После первого деплоя**, засейдите карты:

```bash
# Локально (если есть доступ):
npm run db:seed

# Или через Docker:
docker exec -it tarot-app node src/backend/scripts/seed-cards.js

# Или через Railway/Render console
```

---

## ✅ Step 9: Testing Production

### 9.1 Health Check:

```bash
curl https://your-domain.com/health
```

Ожидаемый ответ:
```json
{
  "success": true,
  "message": "AI Tarot Decision Assistant API",
  "environment": "production"
}
```

### 9.2 API Test:

```bash
# Register test user
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","displayName":"Test"}'

# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 9.3 Frontend Test:

1. Откройте `https://your-domain.com`
2. Зарегистрируйтесь
3. Войдите
4. Протестируйте:
   - Расклад дня
   - Анализ решения
   - Премиум страница
   - Профиль

### 9.4 Stripe Test:

1. Перейдите на `/premium`
2. Нажмите "Оформить Премиум"
3. Используйте тестовую карту:
   - Number: `4242 4242 4242 4242`
   - Date: любая будущая
   - CVC: любой 3-значный
4. Проверьте, что статус изменился на Premium

---

## 📈 Step 10: Monitoring & Maintenance

### 10.1 Логи:

**Просмотр логов:**
```bash
# Docker
docker-compose logs -f

# Railway
railway logs

# VPS
tail -f logs/error.log
tail -f logs/combined.log
```

### 10.2 Health Monitoring:

**Используйте:**
- UptimeRobot (бесплатный мониторинг)
- Pingdom
- Railway встроенный мониторинг

**Endpoint для мониторинга:**
```
https://your-domain.com/health
```

### 10.3 Error Tracking:

**Опционально - Sentry.io:**

1. Создайте проект на sentry.io
2. Получите DSN
3. Добавьте в код:

```javascript
// src/backend/index-json.js
const Sentry = require('@sentry/node');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
  });
}
```

### 10.4 Backup:

**Автоматический бэкап данных:**

```bash
# Создайте cron job для бэкапа
0 2 * * * cd /app && tar -czf backup-$(date +\%Y\%m\%d).tar.gz data/
```

---

## 🚀 Quick Deploy Commands

### Railway:
```bash
npm run deploy:railway
```

### Vercel (Frontend only):
```bash
npm run deploy:vercel
```

### Docker:
```bash
npm run docker:build
npm run docker:run
```

---

## 📊 Performance Optimization

### 1. Frontend:

**Vite уже оптимизирует:**
- ✅ Минификация JS/CSS
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Gzip compression

### 2. Backend:

**Production настройки:**
```javascript
// Уже настроено:
- helmet() для безопасности
- cors() с ограничениями
- rate limiting
- JSON body limit 10MB
```

### 3. Database:

**MongoDB indexes (если используете):**
```javascript
// Добавьте в models:
userSchema.index({ email: 1 });
readingSchema.index({ userId: 1, createdAt: -1 });
```

---

## 🔄 Update & Rollback

### Deploy Update:

```bash
# 1. Закоммитьте изменения
git add .
git commit -m "Update: ..."
git push

# 2. Railway/Render автоматически задеплоят
# Или вручную:
railway up
```

### Rollback:

```bash
# Railway
railway rollback

# Docker
docker-compose down
docker-compose up -d
```

---

## 📋 Post-Deployment Checklist

После успешного деплоя:

- [ ] Health check работает
- [ ] Frontend загружается
- [ ] Регистрация работает
- [ ] Логин работает
- [ ] Расклады создаются
- [ ] Stripe checkout открывается
- [ ] Webhook получает события
- [ ] Логи пишутся корректно
- [ ] SSL работает (HTTPS)
- [ ] Мониторинг настроен

---

## 🆘 Troubleshooting

### Проблема: "Cannot connect to database"

**Решение:**
- Проверьте `MONGODB_URI` в .env.production
- Убедитесь что IP разрешён в MongoDB Atlas
- Проверьте пароль в connection string

### Проблема: "Stripe webhook signature failed"

**Решение:**
- Проверьте `STRIPE_WEBHOOK_SECRET`
- Убедитесь что endpoint URL правильный
- Проверьте что webhook использует raw body

### Проблема: "CORS error"

**Решение:**
- Проверьте `CORS_ORIGIN` в .env.production
- Убедитесь что совпадает с frontend URL
- Проверьте что `credentials: true` настроено

### Проблема: "Cards not loading"

**Решение:**
- Запустите seed скрипт: `npm run db:seed`
- Проверьте что база данных доступна

---

## 📚 Useful Commands

```bash
# Check deployment readiness
npm run deploy:check

# View Docker logs
npm run docker:logs

# Restart Docker container
npm run docker:stop && npm run docker:run

# Seed database in production
docker exec -it tarot-app node src/backend/scripts/seed-cards.js

# Check health
curl https://your-domain.com/health

# Test API
curl https://your-domain.com/api/cards
```

---

## 💰 Cost Estimation (Monthly)

**Free Tier MVP:**
- Railway/Render: $0-5 (free tier)
- MongoDB Atlas: $0 (M0 cluster)
- Stripe: $0 (pay per transaction)
- **Total**: $0-5/month

**Small Scale (100-1000 users):**
- Railway Pro: $5-20
- MongoDB Atlas M2: $9
- Stripe: 2.9% + $0.30 per transaction
- **Total**: $15-30/month

**Medium Scale (1000-10000 users):**
- DigitalOcean Droplet: $12-24
- MongoDB Atlas M10: $57
- Stripe: transaction fees
- **Total**: $70-100/month

---

## 🎯 Success Metrics

После деплоя, отслеживайте:

- **Uptime**: >99.5%
- **Response time**: <200ms (API)
- **Error rate**: <1%
- **Conversion rate**: регистрация → premium

---

## 📞 Support

**В случае проблем:**

1. Проверьте логи: `npm run docker:logs`
2. Запустите health check: `npm run deploy:check`
3. Проверьте статус сервисов:
   - Railway Dashboard
   - Stripe Dashboard
   - MongoDB Atlas

---

## ✅ Deployment Complete!

**После успешного деплоя:**

1. 🎉 Откройте https://your-domain.com
2. 📱 Протестируйте на мобильном
3. 💳 Протестируйте Stripe в test mode
4. 📊 Настройте мониторинг
5. 🚀 Начинайте привлекать пользователей!

**Успешного запуска! 🚀**
