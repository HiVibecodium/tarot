# Railway Deployment - Пошаговая Инструкция

**Дата:** 2025-11-20
**Backend:** Node.js + Express
**Статус:** Ready to Deploy

---

## Вариант 1: Через Railway Web Dashboard (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Откройте Railway Dashboard

1. Перейдите на: https://railway.app
2. Нажмите **"Login"** или **"Start a New Project"**
3. Авторизуйтесь через GitHub

### Шаг 2: Создайте Новый Проект

1. На Dashboard нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Найдите репозиторий: **HiVibecodium/tarot**
4. Нажмите **"Deploy Now"**

### Шаг 3: Настройте Environment Variables

После создания проекта, перейдите в **Settings → Variables** и добавьте:

#### Обязательные переменные:

```bash
# Server
NODE_ENV=production
PORT=4000

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret-change-in-production-minimum-32-characters-long
JWT_REFRESH_EXPIRES_IN=7d

# CORS (используйте ваш Vercel URL)
CORS_ORIGIN=https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
FRONTEND_URL=https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Feature Flags
AI_ENABLED=false
PREMIUM_ENABLED=true

# Admin
ADMIN_EMAILS=admin@example.com
```

#### Опциональные (для Stripe):

```bash
# Stripe (если нужен Premium)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_PRICE_ID
```

#### Опциональные (для Sentry):

```bash
# Sentry Error Tracking
SENTRY_DSN_BACKEND=https://your-backend-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=1.0
```

### Шаг 4: Настройте Build Settings

Railway автоматически определит конфигурацию из `railway.json`. Проверьте что:

1. **Build Command:** `npm install && cd src/frontend && npm install && npm run build`
2. **Start Command:** `npm run start:prod`
3. **Port:** 4000

### Шаг 5: Deploy!

1. Railway автоматически начнет деплой после добавления переменных
2. Следите за логами в разделе **"Deployments"**
3. После успешного деплоя получите URL: `https://your-app.railway.app`

### Шаг 6: Получите Production URL

После деплоя:

1. Перейдите в **Settings → Networking**
2. Скопируйте **Public URL**: `https://ai-tarot-assistant-production.up.railway.app`
3. Этот URL понадобится для настройки frontend

---

## Вариант 2: Через Railway CLI

### Шаг 1: Авторизация

```bash
railway login
```

Откроется браузер для авторизации.

### Шаг 2: Создание Проекта

```bash
# Создать новый проект
railway init

# Или связать с существующим
railway link
```

### Шаг 3: Добавление Environment Variables

```bash
# Добавить переменные одну за другой
railway variables set NODE_ENV=production
railway variables set PORT=4000
railway variables set JWT_SECRET=your-secret-key
# ... и т.д.
```

Или через файл:

```bash
# Создайте .env.production и добавьте переменные
railway variables set --file .env.production
```

### Шаг 4: Deploy

```bash
railway up
```

---

## После Деплоя: Обновите Frontend

### 1. Получите Railway URL

После успешного деплоя, получите URL вашего backend:

```
https://your-app.railway.app
```

### 2. Обновите Vercel Environment Variables

1. Откройте: https://vercel.com/vibecodium/ai-tarot-assistant
2. Перейдите: **Settings → Environment Variables**
3. Добавьте/обновите:

```bash
VITE_API_URL=https://your-app.railway.app
```

4. **Redeploy** frontend на Vercel:

```bash
vercel --prod
```

---

## Проверка Деплоя

### 1. Проверьте Backend Health

```bash
curl https://your-app.railway.app/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T12:00:00.000Z"
}
```

### 2. Проверьте API

```bash
curl https://your-app.railway.app/api/v1/cards
```

Должен вернуть список карт Таро.

### 3. Проверьте Frontend

Откройте ваш Vercel URL и проверьте:
- Регистрация работает
- Login работает
- API запросы проходят
- Данные загружаются

---

## Troubleshooting

### Build Failed

**Проблема:** Build не проходит

**Решение:**
1. Проверьте логи в Railway Dashboard
2. Убедитесь что все зависимости в package.json
3. Проверьте Node версию (должна быть >=18.0.0)

### Cannot Connect to Backend

**Проблема:** Frontend не может подключиться к backend

**Решение:**
1. Проверьте CORS_ORIGIN в Railway variables
2. Убедитесь что VITE_API_URL правильный в Vercel
3. Проверьте что backend запущен (логи в Railway)

### 502 Bad Gateway

**Проблема:** Railway возвращает 502

**Решение:**
1. Проверьте что PORT=4000 в environment variables
2. Убедитесь что backend слушает на правильном порту
3. Проверьте логи на ошибки запуска

### Database Errors

**Проблема:** Ошибки с базой данных

**Решение:**
1. Проект использует JSON storage по умолчанию
2. Railway автоматически создаст persistent disk
3. Если нужна MongoDB - добавьте MongoDB plugin в Railway

---

## Railway Features

### Persistent Disk (для JSON storage)

Railway автоматически создаст persistent volume для `/app/data`.

Если нужно:
1. Settings → Volumes
2. Mount path: `/app/data`

### Custom Domain

1. Settings → Domains
2. Add custom domain
3. Configure DNS (CNAME record)

### Monitoring

1. Metrics → См. CPU, Memory, Network
2. Logs → Real-time логи
3. Deployments → История деплоев

---

## Стоимость Railway

### Free Tier:
- $5 credits per month
- Достаточно для тестирования
- ~500 часов работы

### Hobby Plan ($5/month):
- $5 credits + usage
- Рекомендуется для production

### Оптимизация Стоимости:
1. Используйте sleep mode (автоматически)
2. Оптимизируйте memory usage
3. Используйте caching

---

## Next Steps

После успешного деплоя:

1. ✅ Backend запущен на Railway
2. ✅ Frontend обновлен с новым API URL
3. ✅ Environment variables настроены
4. [ ] Настройте Stripe для payments
5. [ ] Настройте Sentry для error tracking
6. [ ] Настройте custom domain (опционально)
7. [ ] Настройте мониторинг
8. [ ] Создайте backup strategy

---

## Полезные Ссылки

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app
- **GitHub Repo:** https://github.com/HiVibecodium/tarot
- **Vercel Dashboard:** https://vercel.com/vibecodium/ai-tarot-assistant

---

**Created:** 2025-11-20
**Status:** Ready to Deploy
**Recommended:** Use Web Dashboard (Вариант 1)

---

> "Backend готов к деплою! Следуйте инструкциям выше для быстрого запуска." 🚀
