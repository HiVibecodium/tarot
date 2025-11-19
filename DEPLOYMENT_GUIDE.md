# Пошаговая Инструкция по Деплою
**Проект:** AI Tarot Decision Assistant
**GitHub:** https://github.com/Vibecodium/tarot
**Дата:** 2025-11-16

---

## 🎯 План Деплоя

**Frontend** → Vercel (бесплатно)
**Backend** → Railway или Render (бесплатно/дешево)

**Время:** 30-40 минут
**Сложность:** Средняя

---

## 📦 ШАГ 1: Деплой Frontend на Vercel

### 1.1 Зайдите на Vercel

1. Откройте **https://vercel.com**
2. Нажмите **"Sign Up"** или **"Login"**
3. Войдите через **GitHub аккаунт**
4. Авторизуйте Vercel для доступа к репозиториям

### 1.2 Создайте Новый Проект

1. Нажмите **"Add New Project"** или **"New Project"**
2. Найдите репозиторий **`Vibecodium/tarot`** в списке
3. Нажмите **"Import"**

### 1.3 Настройте Проект

**Configure Project:**

```
Project Name: tarot-assistant (или любое другое)
Framework Preset: Vite
Root Directory: src/frontend
```

**Build and Output Settings:**

```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables (пока оставьте пустым):**

Нажмите **"Deploy"**

### 1.4 Ожидайте Деплой

- Vercel начнёт сборку (2-3 минуты)
- Вы увидите логи сборки
- После завершения получите URL: `https://tarot-assistant-xxxxx.vercel.app`

**✅ Frontend готов!** Но API пока не работает (backend локальный)

---

## 🖥️ ШАГ 2: Деплой Backend (Railway или Render)

### Вариант A: Railway.app ($5/месяц бесплатно)

Инструкция ниже...

### Вариант B: Render.com (БЕСПЛАТНО навсегда) - РЕКОМЕНДУЕТСЯ

#### 2.1 Регистрация на Render

1. Откройте **https://render.com**
2. Нажмите **"Get Started"** или **"Sign Up"**
3. Выберите **"Sign up with GitHub"**
4. Авторизуйте Render

#### 2.2 Создайте Web Service

1. Нажмите **"New +"** → **"Web Service"**
2. **"Build and deploy from a Git repository"**
3. Найдите **`Vibecodium/tarot`** → **"Connect"**

#### 2.3 Настройте

```
Name: tarot-backend
Region: Frankfurt (ближе к России)
Branch: main
Root Directory: (пустое)
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

#### 2.4 Environment Variables

```
NODE_ENV=production
JWT_SECRET=super-secret-key-min-32-chars
PORT=4000
FRONTEND_URL=https://tarot-tan-beta.vercel.app
ALLOWED_ORIGINS=https://tarot-tan-beta.vercel.app
```

#### 2.5 Deploy

Нажмите **"Create Web Service"** → ждите 3-5 минут

#### 2.6 Получите URL

После деплоя: `https://tarot-backend.onrender.com`

**⚠️ Важно:** Бесплатный план "засыпает" после 15 мин неактивности. Первый запрос = 30-60 сек (просыпание).

---

## 🖥️ ШАГ 2 (альтернатива): Деплой Backend на Railway

### 2.1 Зайдите на Railway

1. Откройте **https://railway.app**
2. Нажмите **"Login"** или **"Start a New Project"**
3. Войдите через **GitHub аккаунт**

### 2.2 Создайте Новый Проект

1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Найдите **`Vibecodium/tarot`**
4. Нажмите **"Deploy Now"**

### 2.3 Настройте Backend

**Settings → General:**

```
Name: tarot-backend
```

**Settings → Environment:**

Добавьте переменные окружения:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
PORT=4000
FRONTEND_URL=https://tarot-assistant-xxxxx.vercel.app
```

**Settings → Deploy:**

```
Root Directory: . (оставить пустым или точка)
Build Command: (оставить пустым)
Start Command: npm start
```

### 2.4 Получите URL Backend

После деплоя Railway даст вам URL:
```
https://tarot-backend.railway.app
```

**Скопируйте этот URL!**

---

## 🔗 ШАГ 3: Соедините Frontend и Backend

### 3.1 Обновите Environment Variables на Vercel

1. Зайдите в ваш проект на Vercel
2. **Settings** → **Environment Variables**
3. Добавьте:

```
Name: VITE_API_URL
Value: https://tarot-backend.railway.app/api
```

4. Нажмите **"Save"**

### 3.2 Redeploy Frontend

1. Перейдите на **Deployments**
2. Найдите последний деплой
3. Нажмите **"..."** → **"Redeploy"**

**Или:**

Просто сделайте новый commit и push:
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

Vercel автоматически передеплоит с новыми env variables.

---

## 🔒 ШАГ 4: Настройте CORS на Backend

### 4.1 Обновите ALLOWED_ORIGINS

На Railway в Environment Variables добавьте:

```
ALLOWED_ORIGINS=https://tarot-assistant-xxxxx.vercel.app,http://localhost:5173
```

(замените `xxxxx` на ваш реальный URL с Vercel)

### 4.2 Redeploy Backend

Railway автоматически редеплоится при изменении env variables.

---

## ✅ ШАГ 5: Проверка

### 5.1 Откройте Frontend URL

```
https://tarot-assistant-xxxxx.vercel.app
```

### 5.2 Проверьте что работает:

- Регистрация/Login
- Карта Дня
- Расклад на 3 карты
- Нумерология
- Фазы Луны

### 5.3 Проверьте в консоли (F12)

Не должно быть ошибок подключения к API.

---

## 🎨 ШАГ 6: Кастомный Домен (Опционально)

### 6.1 На Vercel

**Settings** → **Domains** → **Add Domain**

Введите ваш домен: `tarot-assistant.com`

Vercel покажет DNS записи которые нужно добавить.

### 6.2 У Регистратора Домена

Добавьте DNS записи:

```
Type: A
Name: @
Value: 76.76.21.21 (IP Vercel)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Готово!** Через 24-48 часов домен заработает.

---

## 🔧 Troubleshooting

### Проблема: Frontend собирается, но API не работает

**Решение:**
1. Проверьте что `VITE_API_URL` установлена на Vercel
2. Проверьте что backend деплоится без ошибок на Railway
3. Проверьте CORS настройки

### Проблема: Build fails на Vercel

**Решение:**
1. Проверьте что Root Directory = `src/frontend`
2. Проверьте логи сборки
3. Убедитесь что все зависимости в package.json

### Проблема: Backend не стартует на Railway

**Решение:**
1. Проверьте что package.json имеет `"start": "node src/backend/index-json.js"`
2. Проверьте environment variables
3. Смотрите логи деплоя

---

## 📊 После Успешного Деплоя

### Ваши URL:

**Frontend:**
```
https://tarot-assistant-xxxxx.vercel.app
```

**Backend API:**
```
https://tarot-backend.railway.app/api
```

**Health Check:**
```
https://tarot-backend.railway.app/health
```

### Проверьте:
- [ ] Главная страница загружается
- [ ] Регистрация работает
- [ ] Login работает
- [ ] Расклады генерируются
- [ ] Все новые фичи доступны

---

## 🎉 Готово!

Ваше приложение теперь живёт в интернете! 🌍

**Поделитесь ссылкой:**
- В социальных сетях
- С друзьями
- Для тестирования

**Следующие шаги:**
1. Настройте кастомный домен
2. Добавьте analytics (Google Analytics)
3. Настройте мониторинг (Sentry)
4. Собирайте feedback пользователей

---

## 💡 Полезные Команды

**Посмотреть логи Railway:**
```bash
railway logs
```

**Локальный тест production build:**
```bash
npm run build
npm start
```

**Обновить deployment:**
```bash
git add .
git commit -m "update: ..."
git push
```
(Vercel и Railway автоматически передеплоят)

---

**Создано:** 2025-11-16
**Статус:** ✅ ГОТОВО К ДЕПЛОЮ
**Следующий шаг:** Настройте проекты на Vercel и Railway!
