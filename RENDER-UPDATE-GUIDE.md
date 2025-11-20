# 🔄 Render.com - Обновление Деплоя

**Дата:** 2025-11-20
**Статус:** Backend на Render.com готов к обновлению
**Current URL:** https://tarot-a2oi.onrender.com

---

## 📊 Текущая Ситуация:

✅ **Frontend на Vercel:** https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
⏳ **Backend на Render:** https://tarot-a2oi.onrender.com (требует обновления)
✅ **GitHub:** https://github.com/HiVibecodium/tarot (синхронизирован)

---

## 🚀 Быстрое Обновление (3 минуты):

### Шаг 1: Откройте Render Dashboard

```
https://dashboard.render.com
```

Войдите через GitHub (если еще не авторизованы).

### Шаг 2: Найдите Ваш Сервис

1. На Dashboard найдите: **tarot-assistant**
2. Нажмите на название сервиса

### Шаг 3: Проверьте Подключение к GitHub

1. Перейдите в **Settings** (боковое меню)
2. Проверьте секцию **Build & Deploy**
3. Убедитесь что подключен репозиторий: **HiVibecodium/tarot**
4. Branch: **main**

### Шаг 4: Обновите Environment Variables

Перейдите в **Environment** и убедитесь что есть все переменные:

#### ✅ Обязательные (уже должны быть):
```
NODE_ENV=production
PORT=4000
AI_ENABLED=false
PREMIUM_ENABLED=true
```

#### ⚠️ Нужно Обновить:

**Старые** (в render.yaml):
```
CORS_ORIGIN=https://tarot-a2oi.onrender.com
FRONTEND_URL=https://tarot-a2oi.onrender.com
```

**Новые** (для работы с Vercel):
```
CORS_ORIGIN=https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
FRONTEND_URL=https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
```

#### 🔑 JWT Secrets (если отсутствуют):

Добавьте эти переменные (сгенерированы для вас):
```
JWT_SECRET=05095e884dd134cc9257f66e46190ac821f3cbd9e3e0127515efeea94bca34246abb4f7f6c2615779d2e613ae234fad75bc292f6a263c59d6031fe6cdf201bf4

JWT_EXPIRES_IN=24h

JWT_REFRESH_SECRET=2ef27b651580d4c00a6778a45a8d437a8be2564509b2dc760abc19922ac284a8e1db265f67855cf7fb5bb28c80a477caf07c1e1f8b072079da9f928b2978e49d

JWT_REFRESH_EXPIRES_IN=7d
```

### Шаг 5: Запустите Redeploy

1. Нажмите кнопку **Manual Deploy** → **Deploy latest commit**
2. Или перейдите в **Events** и нажмите **Manual Deploy**

### Шаг 6: Дождитесь Завершения

- Build займет 2-3 минуты
- Следите за логами в реальном времени
- Дождитесь статуса: **Live** (зеленая точка)

---

## 📝 Альтернатива: Обновить render.yaml

Если хотите автоматический deploy при push:

1. Обновите файл `render.yaml` локально:

```yaml
services:
  - type: web
    name: tarot-assistant
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install && npm run build:render
    startCommand: npm run start:prod
    disk:
      name: tarot-data
      mountPath: /data
      sizeGB: 1
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 4000
      - key: DATA_DIR
        value: /data
      - key: AI_ENABLED
        value: false
      - key: PREMIUM_ENABLED
        value: true
      # ОБНОВЛЕНО для Vercel:
      - key: CORS_ORIGIN
        value: https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
      - key: FRONTEND_URL
        value: https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
      - key: API_BASE_URL
        value: https://tarot-a2oi.onrender.com
      # JWT Secrets (добавьте через Render Dashboard как secret!)
      - key: JWT_SECRET
        sync: false
      - key: JWT_REFRESH_SECRET
        sync: false
```

2. Закоммитьте изменения:
```bash
git add render.yaml
git commit -m "Update Render config with new Vercel URL"
git push origin main
```

3. Render автоматически запустит redeploy

---

## 🔄 После Обновления Render: Обновите Vercel

### Шаг 1: Откройте Vercel Dashboard

```
https://vercel.com/vibecodium/ai-tarot-assistant
```

### Шаг 2: Добавьте Environment Variable

1. Перейдите: **Settings → Environment Variables**
2. Нажмите **Add New**
3. Добавьте переменную:

```
Name: VITE_API_URL
Value: https://tarot-a2oi.onrender.com
```

4. Environment: **Production** (галочка)
5. Нажмите **Save**

### Шаг 3: Redeploy Frontend

1. Перейдите в **Deployments**
2. Найдите последний deployment
3. Нажмите **⋮** (три точки) → **Redeploy**
4. Дождитесь завершения (30 секунд)

---

## ✅ Проверка После Обновления:

### 1. Проверьте Backend Health:

```bash
curl https://tarot-a2oi.onrender.com/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T..."
}
```

### 2. Проверьте API:

```bash
curl https://tarot-a2oi.onrender.com/api/v1/cards
```

Должен вернуть массив карт Таро.

### 3. Откройте Frontend:

```
https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
```

Попробуйте:
- Регистрацию нового пользователя
- Login
- Создать расклад
- Проверить что API работает

---

## 🔍 Troubleshooting:

### Проблема: Build Failed в Render

**Решение:**
1. Проверьте логи: **Events → последний deploy → Logs**
2. Убедитесь что все зависимости в package.json
3. Проверьте что Node version >= 18.0.0

### Проблема: Frontend не подключается к Backend

**Решение:**
1. Проверьте CORS_ORIGIN в Render Environment:
   ```
   CORS_ORIGIN=https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app
   ```
2. Проверьте VITE_API_URL в Vercel:
   ```
   VITE_API_URL=https://tarot-a2oi.onrender.com
   ```
3. Убедитесь что оба сервиса задеплоены

### Проблема: 502 Bad Gateway

**Решение:**
1. Render спит (бесплатный план). Первый запрос разбудит (30-60 секунд)
2. Проверьте логи на ошибки
3. Перезапустите сервис: **Manual Deploy**

### Проблема: CORS Error

**Решение:**
1. Убедитесь что CORS_ORIGIN точно совпадает с Vercel URL
2. Проверьте что нет лишних слешей в конце URL
3. Redeploy оба сервиса после изменения переменных

---

## 📊 Текущая Конфигурация:

| Компонент | Platform | URL | Status |
|-----------|----------|-----|--------|
| **Frontend** | Vercel | https://ai-tarot-assistant-1viqrjm5j-vibecodium.vercel.app | ✅ Live |
| **Backend** | Render | https://tarot-a2oi.onrender.com | ⏳ Needs Update |
| **Database** | JSON (Render Disk) | /data (persistent) | ✅ Ready |
| **GitHub** | - | https://github.com/HiVibecodium/tarot | ✅ Synced |

---

## 💡 Полезная Информация:

### Render Free Tier:
- ✅ Автоматический deploy при push
- ✅ SSL/HTTPS включен
- ✅ Persistent disk (1GB)
- ⚠️ Засыпает после 15 минут неактивности
- ⚠️ Просыпается за 30-60 секунд

### Стоимость Upgrade:
- **Starter Plan**: $7/month
  - Без засыпания
  - Больше CPU/RAM
  - Рекомендуется для production

---

## 🎯 После Успешного Обновления:

✅ Frontend на Vercel - живой
✅ Backend на Render - обновлен
✅ CORS настроен правильно
✅ JWT секреты установлены
✅ API подключен к Frontend
✅ Полный стек работает

**Готово к использованию!** 🚀

---

**Created:** 2025-11-20
**Status:** Инструкция готова
**Platform:** Render.com (было), не Railway
**Next:** Следуйте шагам выше ⬆️

---

> "Render.com уже настроен, просто нужно обновить и пробудить!" 🌅
