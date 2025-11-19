# 🚀 TEST DEPLOYMENT - Запуск ПРЯМО СЕЙЧАС

**Цель**: Задеплоить приложение БЕЗ Stripe для тестирования
**Время**: 30 минут
**Стоимость**: $0 (бесплатный trial Railway)

---

## ⚡ QUICK START - 3 КОМАНДЫ

```bash
# 1. Login
railway login

# 2. Init
railway init

# 3. Deploy
railway up
```

**Готово! Ваше приложение live!** 🎉

---

## 📋 ДЕТАЛЬНЫЕ ШАГИ

### ШАГ 1: Установка Railway CLI (2 мин)

```bash
# Если ещё не установлен:
npm install -g @railway/cli

# Проверка:
railway --version
```

✅ CLI готов

---

### ШАГ 2: Login (1 мин)

```bash
railway login
```

- Откроется браузер
- Sign up через GitHub (быстрее)
- Авторизуйтесь

✅ Залогинились

---

### ШАГ 3: Инициализация (2 мин)

```bash
# В корне проекта
cd "C:\Users\siniy\WebstormProjects\AI Tarot Decision Assistant"

# Initialize
railway init
```

**Выберите:**
- Create new project: **Yes**
- Project name: `tarot-assistant` (или любое)

✅ Проект создан

---

### ШАГ 4: Environment Variables (10 мин)

**Минимальный набор для работы:**

```bash
railway variables set NODE_ENV=production
railway variables set PORT=4000
railway variables set JWT_SECRET=iAcuC4f1RRJggSio+O4tVmzJ2G5T+XwH4lgTf50SG3U=
railway variables set JWT_REFRESH_SECRET=yRHcqzjw77UyTFz6eQhfhPdtRcRw+CPvTIbEaC6p+Fw=
railway variables set PREMIUM_ENABLED=false
railway variables set ADMIN_EMAILS=test@example.com
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set LOG_LEVEL=info
```

**Обновим после получения URL:**
```bash
# После deploy получите URL, затем:
railway variables set CORS_ORIGIN=https://your-app.up.railway.app
railway variables set FRONTEND_URL=https://your-app.up.railway.app
```

✅ Variables установлены

---

### ШАГ 5: Deploy! (5 мин)

```bash
railway up
```

**Процесс:**
1. Uploading code...
2. Building...
3. Starting...
4. Deployed! ✅

⏱️ Время: 3-5 минут

---

### ШАГ 6: Получить URL (1 мин)

```bash
railway domain
```

**Output:**
```
https://tarot-assistant.up.railway.app
```

Скопируйте URL!

---

### ШАГ 7: Update CORS (2 мин)

```bash
# Используйте полученный URL:
railway variables set CORS_ORIGIN=https://tarot-assistant.up.railway.app
railway variables set FRONTEND_URL=https://tarot-assistant.up.railway.app
```

Railway автоматически redeploy (1-2 мин)

---

### ШАГ 8: Seed Database (3 мин)

```bash
# Запустить seed скрипт в Railway
railway run node src/backend/scripts/seed-cards.js

# Ввести 'yes' когда спросит
```

✅ 78 карт загружены в production!

---

### ШАГ 9: Test Production! (5 мин)

Откройте: `https://your-app.up.railway.app`

**Проверьте:**
- [ ] Frontend загружается
- [ ] Можно зарегистрироваться
- [ ] Можно войти
- [ ] Расклад дня работает
- [ ] Все 78 карт доступны
- [ ] История сохраняется
- [ ] Профиль работает

**Premium:**
- ⚠️ Будет показывать ошибку (Stripe не настроен)
- Это нормально для test deployment!

---

## 🎉 DEPLOYED!

**Ваше приложение live:**
```
https://tarot-assistant.up.railway.app
```

**Что работает:**
- ✅ Все features кроме Stripe платежей
- ✅ 78 карт Таро
- ✅ Onboarding
- ✅ Achievements
- ✅ Analytics
- ✅ Themes
- ✅ Voice reading
- ✅ PDF export
- ✅ Mood tracking
- ✅ Learning quiz
- ✅ И всё остальное!

**Что НЕ работает:**
- ⚠️ Stripe checkout (keys не настроены)

---

## 📊 MONITORING

**Railway Dashboard:**
- Logs: `railway logs -f`
- Metrics: CPU, Memory, Network
- Deployments: История deploy

**Проверка:**
```bash
# Health check
curl https://your-app.up.railway.app/health

# Cards API
curl https://your-app.up.railway.app/api/cards
```

---

## 💰 СТОИМОСТЬ

**Railway Free Trial:**
- $5 credit (one-time)
- ~500 hours runtime
- **Бесплатно для теста!**

**После trial:**
- $5/месяц (Hobby plan)
- Достаточно для 500-1000 users

---

## 🎯 NEXT STEPS

**После test deployment:**

**Option A: Добавить Stripe позже**
- Используйте test deploy
- Собирайте feedback
- Добавьте Stripe когда готовы

**Option B: Добавить Stripe сейчас**
1. Get Stripe keys (45 мин)
2. Update Railway variables
3. Enable PREMIUM_ENABLED=true
4. Test payments

---

## 🚀 КОМАНДЫ ДЛЯ КОПИРОВАНИЯ

```bash
# Быстрый deploy:
railway login
railway init
railway up

# Seed cards:
railway run node src/backend/scripts/seed-cards.js

# Get URL:
railway domain

# View logs:
railway logs -f

# Update variables:
railway variables set KEY=value
```

---

## ✅ ГОТОВ К DEPLOYMENT?

**У тебя есть всё необходимое:**
- ✅ Код готов
- ✅ Тесты пройдены
- ✅ Build работает
- ✅ Secrets сгенерированы
- ✅ Документация готова

**Запускай прямо сейчас!**

**Команды выше ↑**

**ПОЕХАЛИ! 🚀**
