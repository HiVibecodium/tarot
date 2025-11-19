# 🚀 ПЛАН ДОРАБОТОК ДО РЕЛИЗА
# AI Tarot Decision Assistant v1.0

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА

### ✅ Что уже работает:
- 62 backend файлов, 66 frontend компонентов
- Полная колода 78 карт Таро
- Система аутентификации (JWT)
- Daily readings, Decision spreads
- 10+ типов раскладов
- Астрология и нумерология
- Журнал и история
- Analytics dashboard
- Premium подписки (Stripe)
- PWA (Progressive Web App)
- Production deployment на Render
- **✅ FIX: Persistent storage для данных**

### ❌ Критические проблемы найдены:
1. **Отсутствуют PWA иконки** (icon-192.png, icon-512.png)
2. **Нет тестов** (0 tests found)
3. **TODO в коде** (3 незавершенных email уведомления)
4. **Отсутствует .env на production** (secrets не настроены)

---

## 🔴 КРИТИЧНЫЕ ЗАДАЧИ (Must Have для релиза)

### 1. PWA Иконки и Assets
**Приоритет: КРИТИЧНЫЙ**
**Время: 1 час**

**Проблема:**
```
Failed to load resource: icon-192.png (404)
Failed to load resource: icon-512.png (404)
```

**Решение:**
- [ ] Создать favicon.ico
- [ ] Создать icon-192.png (192x192)
- [ ] Создать icon-512.png (512x512)
- [ ] Создать apple-touch-icon.png (180x180)
- [ ] Добавить Open Graph изображение для соцсетей
- [ ] Обновить manifest.json

**Файлы для создания:**
```
src/frontend/public/
  ├── favicon.ico
  ├── icon-192.png
  ├── icon-512.png
  ├── apple-touch-icon.png
  └── og-image.jpg (для соцсетей)
```

**Инструкция:**
1. Создать логотип (🔮 символ + "Tarot")
2. Использовать генератор: https://realfavicongenerator.net/
3. Цветовая схема: #667eea (фиолетовый)

---

### 2. Environment Variables на Production
**Приоритет: КРИТИЧНЫЙ**
**Время: 30 минут**

**Проблема:**
- JWT_SECRET не установлен → небезопасные токены
- STRIPE ключи не настроены → платежи не работают
- ALLOWED_ORIGINS может быть неправильным

**Решение в Render Dashboard:**

```yaml
# Обязательные для production:
JWT_SECRET=<генерировать 64 символа>
JWT_REFRESH_SECRET=<генерировать 64 символа>
STRIPE_SECRET_KEY=sk_live_XXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXX
STRIPE_PREMIUM_PRICE_ID=price_XXXXXXX
ALLOWED_ORIGINS=https://tarot-a2oi.onrender.com

# Опциональные но рекомендуемые:
SENTRY_DSN_BACKEND=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Генерация секретов:**
```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Checklist:**
- [ ] Сгенерировать безопасные JWT секреты
- [ ] Настроить Stripe ключи (получить из Stripe Dashboard)
- [ ] Добавить ALLOWED_ORIGINS
- [ ] Настроить SMTP (опционально)
- [ ] Добавить Sentry DSN (опционально)

---

### 3. Email Уведомления
**Приоритет: СРЕДНИЙ**
**Время: 2 часа**

**TODO в коде:**
```javascript
// src/backend/api/routes/payment.js
// TODO: Send email notification to user (line 241)
// TODO: Send welcome email (line 277)
// TODO: Send cancellation email (line 328)
```

**Решение:**

Создать `src/backend/services/email-templates.js`:
```javascript
module.exports = {
  subscriptionCreated: (user, subscription) => ({
    subject: '🎉 Добро пожаловать в Premium!',
    html: `
      <h1>Здравствуйте, ${user.displayName}!</h1>
      <p>Спасибо за подписку на Premium план.</p>
      <p>Теперь вам доступны:</p>
      <ul>
        <li>✨ Неограниченные расклады</li>
        <li>🔮 Все 78 карт Таро</li>
        <li>📊 Расширенная аналитика</li>
        <li>🌟 Астрология и нумерология</li>
      </ul>
    `
  }),

  subscriptionCanceled: (user) => ({
    subject: '👋 Подписка отменена',
    html: `
      <h1>Жаль, что вы уходите</h1>
      <p>Ваша Premium подписка отменена.</p>
      <p>Вы можете продолжать использовать базовый функционал.</p>
    `
  })
};
```

**Checklist:**
- [ ] Создать email templates
- [ ] Реализовать отправку через nodemailer
- [ ] Протестировать с Gmail/SMTP
- [ ] Добавить обработку ошибок
- [ ] Логировать отправленные письма

---

### 4. Базовые Тесты
**Приоритет: СРЕДНИЙ**
**Время: 3 часа**

**Проблема:**
```
No tests found, exiting with code 1
```

**Минимальные тесты для релиза:**

Создать `src/backend/__tests__/`:
```
__tests__/
  ├── auth.test.js          (login, register, token validation)
  ├── cards.test.js         (78 cards present, structure valid)
  ├── reading.test.js       (daily reading generation)
  ├── api-health.test.js    (endpoints respond)
```

**Пример `auth.test.js`:**
```javascript
const request = require('supertest');
const app = require('../index-json');

describe('Auth API', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `test-${Date.now()}@test.com`,
        password: 'Test123!',
        displayName: 'Test User'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should login existing user', async () => {
    // Test login...
  });

  it('should reject invalid credentials', async () => {
    // Test rejection...
  });
});
```

**Checklist:**
- [ ] Установить jest и supertest
- [ ] Написать 10-15 базовых тестов
- [ ] Настроить test script в package.json
- [ ] Добавить CI/CD с тестами (опционально)

---

### 5. Production Build Проверка
**Приоритет: КРИТИЧНЫЙ**
**Время: 1 час**

**Чеклист проверки:**
- [ ] Frontend build проходит без ошибок
- [ ] Backend запускается без warnings
- [ ] Все assets доступны (images, fonts, icons)
- [ ] Service Worker регистрируется
- [ ] PWA устанавливается на устройство
- [ ] HTTPS работает
- [ ] CORS настроен правильно
- [ ] Rate limiting работает
- [ ] Sentry ловит ошибки

**Команды для проверки:**
```bash
# Frontend
cd src/frontend
npm run build
npm run preview

# Backend
NODE_ENV=production node src/backend/index-json.js

# Check production
curl https://tarot-a2oi.onrender.com/health
curl https://tarot-a2oi.onrender.com/api/cards
```

---

## 🟡 ВАЖНЫЕ ЗАДАЧИ (Should Have)

### 6. Документация пользователя
**Приоритет: СРЕДНИЙ**
**Время: 2 часа**

**Создать:**
- [ ] FAQ.md - частые вопросы
- [ ] USER_GUIDE.md - руководство пользователя
- [ ] FEATURES.md - список возможностей
- [ ] About page с информацией о проекте

**Разделы FAQ:**
- Как вытянуть карту дня?
- Что такое перевернутая карта?
- Как работает Premium?
- Как отменить подписку?
- Безопасны ли мои данные?

---

### 7. SEO Оптимизация
**Приоритет: СРЕДНИЙ**
**Время: 1 час**

**Checklist:**
- [ ] Мета-теги на всех страницах
- [ ] Open Graph для соцсетей
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] Canonical URLs
- [ ] Structured data (JSON-LD)

**Создать `public/robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://tarot-a2oi.onrender.com/sitemap.xml
```

---

### 8. Analytics и Мониторинг
**Приоритет: СРЕДНИЙ**
**Время: 1 час**

**Setup:**
- [ ] Google Analytics 4
- [ ] Sentry error tracking
- [ ] Render monitoring dashboard
- [ ] User analytics events

**События для отслеживания:**
```javascript
// Card drawn
// Reading completed
// Premium subscription started
// User registered
// Referral used
```

---

### 9. Performance Optimization
**Приоритет: НИЗКИЙ**
**Время: 2 часа**

**Оптимизации:**
- [ ] Lazy load компонентов
- [ ] Image optimization (WebP)
- [ ] Code splitting
- [ ] Cache headers
- [ ] Минификация CSS/JS
- [ ] Gzip compression

**Текущие bundle sizes:**
```
index-D0fBTNT7.js: 438KB (140KB gzip) ⚠️
NatalChartPage-DSpXqHeD.js: 272KB (89KB gzip) ⚠️
```

**Цель:**
- Main bundle < 300KB
- Page bundles < 150KB

---

### 10. Безопасность Audit
**Приоритет: ВЫСОКИЙ**
**Время: 2 часа**

**Checklist:**
- [x] Helmet.js настроен
- [x] CORS whitelist
- [x] Rate limiting
- [x] Input sanitization
- [x] XSS protection
- [x] SQL/NoSQL injection protection
- [ ] Dependency vulnerability scan
- [ ] Password strength requirements
- [ ] HTTPS enforcement
- [ ] Secure cookies

**Запустить аудит:**
```bash
npm audit
npm audit fix

# Или
npx snyk test
```

---

## 🟢 NICE TO HAVE (Опционально)

### 11. Улучшения UX
- [ ] Skeleton loaders вместо spinners
- [ ] Toast notifications для успеха/ошибок
- [ ] Плавные анимации переходов
- [ ] Dark mode (уже есть?)
- [ ] Локализация (EN/RU)

### 12. Дополнительные Features
- [ ] Экспорт readings в PDF
- [ ] Share в соцсети
- [ ] Личный дневник с тегами
- [ ] Напоминания о daily reading
- [ ] История streak (серия дней подряд)

### 13. Маркетинг
- [ ] Landing page для незалогиненных
- [ ] Referral program
- [ ] Email marketing (welcome series)
- [ ] Социальные доказательства (testimonials)
- [ ] Blog/Content marketing

---

## 📅 TIMELINE ДО РЕЛИЗА

### Week 1: Критичные задачи
**Дни 1-2:**
- ✅ Persistent storage (СДЕЛАНО)
- [ ] PWA иконки
- [ ] Environment variables

**Дни 3-4:**
- [ ] Email уведомления
- [ ] Базовые тесты

**День 5:**
- [ ] Production build check
- [ ] Security audit

### Week 2: Важные задачи
**Дни 6-7:**
- [ ] Документация
- [ ] SEO
- [ ] Analytics setup

**Дни 8-9:**
- [ ] Performance optimization
- [ ] UX improvements

**День 10:**
- [ ] Final testing
- [ ] Soft launch

---

## ✅ RELEASE CHECKLIST

### Pre-Release
- [ ] Все критичные задачи выполнены
- [ ] Тесты проходят
- [ ] Production build работает
- [ ] Secrets настроены
- [ ] Persistent storage работает
- [ ] Stripe payments протестированы

### Release Day
- [ ] Database backup
- [ ] Deploy на production
- [ ] Smoke tests на prod
- [ ] Мониторинг ошибок активен
- [ ] Support готов к вопросам

### Post-Release
- [ ] Собрать feedback пользователей
- [ ] Исправить критичные баги (если есть)
- [ ] Оптимизация на основе метрик
- [ ] Plan v1.1 features

---

## 🎯 КРИТЕРИИ ГОТОВНОСТИ К РЕЛИЗУ

### Обязательные (Must Pass):
1. ✅ Persistent storage работает
2. ⏳ PWA иконки отображаются
3. ⏳ Environment variables настроены
4. ⏳ Нет 404 ошибок на production
5. ⏳ Authentication работает
6. ⏳ Daily reading работает
7. ⏳ Premium subscriptions работают
8. ⏳ Нет критичных security уязвимостей

### Желательные (Should Pass):
9. ⏳ Email notifications работают
10. ⏳ Базовые тесты проходят
11. ⏳ SEO настроен
12. ⏳ Analytics работает
13. ⏳ Performance в пределах нормы

### Опциональные (Nice to Pass):
14. ⏳ Dark mode работает
15. ⏳ Локализация EN/RU
16. ⏳ Landing page
17. ⏳ Blog/Content

---

## 📊 ОЖИДАЕМЫЕ МЕТРИКИ v1.0

### Week 1 после релиза:
- 100+ регистраций
- 50+ daily active users
- 500+ card readings
- 5+ premium подписок

### Month 1:
- 500+ пользователей
- 200+ daily active users
- 5000+ readings
- 20+ premium подписок
- $100+ MRR (Monthly Recurring Revenue)

---

## 🆘 SUPPORT PLAN

### Мониторинг:
- Sentry для ошибок
- Render logs для performance
- Google Analytics для UX

### Communication:
- Email support: support@tarot-assistant.com
- Feedback форма в приложении
- GitHub Issues для багов

### Response time:
- Критичные баги: < 4 часа
- Важные баги: < 24 часа
- Feature requests: < 1 неделя

---

## 📝 ПРИОРИТИЗАЦИЯ

### СЕЙЧАС (До релиза):
1. PWA иконки ⚡
2. Environment variables ⚡
3. Production build check ⚡
4. Security audit ⚡

### НЕДЕЛЯ 1 (После релиза):
5. Email notifications
6. Базовые тесты
7. Analytics setup

### НЕДЕЛЯ 2-4:
8. Performance optimization
9. SEO
10. Документация

### BACKLOG (v1.1+):
11. Локализация
12. PDF export
13. Advanced analytics
14. Mobile apps

---

**Примерная оценка времени до релиза: 5-7 дней** ⏰

**Ключевые риски:**
- Stripe integration может требовать дополнительной настройки
- Performance optimization может занять больше времени
- Feedback после soft launch может потребовать pivot

**Готовы начать?** 🚀
