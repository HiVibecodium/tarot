# 🚀 ФАЗА 1: Pre-Launch Polish - План Реализации

**Старт**: 14 ноября 2025
**Дедлайн**: 21 ноября 2025 (7 дней)
**Цель**: Подготовить production-ready продукт к публичному запуску

---

## 📋 TASK BREAKDOWN

### Day 1-2: Card Images + Error Tracking (Критично!)

#### Task 1.1: Rider-Waite Card Images ⭐⭐⭐⭐⭐
**Время**: 3-4 часа
**Приоритет**: 🔴 CRITICAL

**Шаги**:
1. ✅ **Найти и скачать Rider-Waite public domain images**
   ```bash
   # Source: Sacred Texts или Wikipedia Commons
   # 78 images, минимум 400x700px
   ```

2. ✅ **Оптимизировать изображения**
   ```bash
   # Install sharp (already in dependencies)
   node scripts/optimize-card-images.js

   # Результат:
   # - WebP format (80% compression)
   # - 400x700px standard size
   # - ~30KB per image
   ```

3. ✅ **Организовать файлы**
   ```
   public/images/cards/
   ├── major/
   │   ├── 00-fool.webp
   │   ├── 01-magician.webp
   │   └── ... (22 cards)
   ├── wands/
   │   ├── ace.webp
   │   ├── 02.webp
   │   └── ... (14 cards)
   ├── cups/ (14 cards)
   ├── swords/ (14 cards)
   └── pentacles/ (14 cards)
   ```

4. ✅ **Обновить TarotCard component**
   ```jsx
   // src/frontend/src/components/TarotCard.jsx
   const getCardImage = (card) => {
     const suite = card.suit?.toLowerCase() || 'major'
     const number = card.number || card._id
     return `/images/cards/${suite}/${number}.webp`
   }

   <img
     src={getCardImage(card)}
     alt={card.name}
     loading="lazy"
     onError={(e) => {
       e.target.src = '/images/cards/placeholder.webp'
     }}
   />
   ```

5. ✅ **Создать fallback placeholder**
   ```jsx
   // На случай если изображение не загрузилось
   // Оставить текущий emoji placeholder
   ```

**Deliverable**: 78 card images интегрированы и отображаются

---

#### Task 1.2: Sentry Error Tracking ⭐⭐⭐⭐⭐
**Время**: 2 часа
**Приоритет**: 🔴 CRITICAL

**Шаги**:
1. ✅ **Setup Sentry account**
   ```bash
   # 1. Go to sentry.io
   # 2. Create free account
   # 3. Create new project: "AI Tarot Assistant"
   # 4. Get DSN keys (frontend + backend)
   ```

2. ✅ **Install dependencies**
   ```bash
   npm install @sentry/react @sentry/node
   cd src/frontend && npm install @sentry/react
   ```

3. ✅ **Configure Frontend**
   ```javascript
   // src/frontend/src/main.jsx
   import * as Sentry from "@sentry/react"

   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     environment: import.meta.env.MODE,
     integrations: [
       new Sentry.BrowserTracing(),
       new Sentry.Replay()
     ],
     tracesSampleRate: 1.0,
     replaysSessionSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
     beforeSend(event) {
       // Don't send in development
       if (import.meta.env.MODE === 'development') {
         return null
       }
       return event
     }
   })
   ```

4. ✅ **Configure Backend**
   ```javascript
   // src/backend/index-json.js
   const Sentry = require('@sentry/node')

   Sentry.init({
     dsn: process.env.SENTRY_DSN_BACKEND,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0
   })

   // Error handler middleware
   app.use(Sentry.Handlers.errorHandler())
   ```

5. ✅ **Add to .env.example**
   ```bash
   # Sentry
   VITE_SENTRY_DSN=your-frontend-dsn
   SENTRY_DSN_BACKEND=your-backend-dsn
   ```

6. ✅ **Test error reporting**
   ```javascript
   // Trigger test error
   throw new Error("Test Sentry Integration")
   ```

**Deliverable**: Sentry активен и ловит ошибки

---

### Day 3-4: Security Hardening

#### Task 1.3: Security Improvements ⭐⭐⭐⭐⭐
**Время**: 4-5 часов
**Приоритет**: 🔴 CRITICAL

**Шаги**:

**A) CORS Whitelist**
```javascript
// src/backend/index-json.js
const allowedOrigins = [
  'http://localhost:5173',
  'https://tarot-assistant.com',
  'https://www.tarot-assistant.com'
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

**B) Rate Limiting**
```javascript
// src/backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit')

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  message: 'Слишком много запросов, попробуйте позже'
})

// Auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 min
  skipSuccessfulRequests: true,
  message: 'Слишком много попыток входа, попробуйте через 15 минут'
})

// Premium endpoints
const premiumLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10
})

module.exports = { apiLimiter, authLimiter, premiumLimiter }

// Apply
app.use('/api', apiLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/stripe', premiumLimiter)
```

**C) Input Sanitization**
```javascript
// src/backend/middleware/sanitize.js
const { body, validationResult } = require('express-validator')

const sanitizeInput = (req, res, next) => {
  // Remove HTML tags, SQL injection attempts
  const sanitize = (value) => {
    if (typeof value === 'string') {
      return value
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[<>]/g, '')
    }
    return value
  }

  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitize(req.body[key])
    })
  }

  next()
}

module.exports = sanitizeInput

// Apply globally
app.use(sanitizeInput)
```

**D) Password Strength Validation**
```javascript
// src/backend/controllers/auth.controller.js
const validatePassword = (password) => {
  // Minimum 8 characters, at least 1 letter and 1 number
  const minLength = 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (password.length < minLength) {
    return 'Пароль должен содержать минимум 8 символов'
  }
  if (!hasLetter || !hasNumber) {
    return 'Пароль должен содержать буквы и цифры'
  }
  return null
}

// In register controller
const passwordError = validatePassword(password)
if (passwordError) {
  return res.status(400).json({
    success: false,
    message: passwordError
  })
}
```

**E) Secure Cookie Settings**
```javascript
// src/backend/index-json.js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))
```

**F) Environment Variables Check**
```javascript
// src/backend/utils/checkEnv.js
const requiredEnvVars = [
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'SESSION_SECRET'
]

const checkEnv = () => {
  const missing = requiredEnvVars.filter(v => !process.env[v])

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  console.log('✅ All required environment variables present')
}

module.exports = checkEnv

// In index-json.js
checkEnv()
```

**Deliverable**: Security hardened, готов к production

---

### Day 5: Loading States + Error Messages

#### Task 1.4: Skeleton Loading States ⭐⭐⭐⭐
**Время**: 2-3 часа
**Приоритет**: 🟡 HIGH

**Шаги**:

1. ✅ **Install react-loading-skeleton**
   ```bash
   cd src/frontend && npm install react-loading-skeleton
   ```

2. ✅ **Create skeleton components**
   ```jsx
   // src/frontend/src/components/skeletons/CardSkeleton.jsx
   import Skeleton from 'react-loading-skeleton'
   import 'react-loading-skeleton/dist/skeleton.css'

   export const CardSkeleton = () => (
     <div className="card-skeleton">
       <Skeleton height={400} />
       <Skeleton count={2} style={{ marginTop: 10 }} />
     </div>
   )

   export const ReadingHistorySkeleton = () => (
     <div className="history-skeleton">
       {[1,2,3].map(i => (
         <div key={i} className="history-item-skeleton">
           <Skeleton circle width={50} height={50} />
           <div style={{ flex: 1, marginLeft: 15 }}>
             <Skeleton width="60%" />
             <Skeleton width="40%" style={{ marginTop: 5 }} />
           </div>
         </div>
       ))}
     </div>
   )

   export const AnalyticsSkeleton = () => (
     <div className="analytics-skeleton">
       <Skeleton height={300} />
       <Skeleton height={200} style={{ marginTop: 20 }} />
       <Skeleton count={3} style={{ marginTop: 10 }} />
     </div>
   )
   ```

3. ✅ **Apply to pages**
   ```jsx
   // HistoryPage.jsx
   if (loading) {
     return <ReadingHistorySkeleton />
   }

   // AnalyticsPage.jsx
   if (loading) {
     return <AnalyticsSkeleton />
   }

   // DecisionPage.jsx
   {generatingReading && <CardSkeleton />}
   ```

**Deliverable**: Все loading states красивые

---

#### Task 1.5: Improved Error Messages ⭐⭐⭐⭐
**Время**: 2 часа
**Приоритет**: 🟡 HIGH

**Шаги**:

1. ✅ **Create error utility**
   ```javascript
   // src/frontend/src/utils/errorMessages.js
   export const getErrorMessage = (error) => {
     // Network errors
     if (!error.response) {
       return {
         title: 'Нет соединения',
         message: 'Проверьте интернет-соединение и попробуйте снова.',
         actions: ['retry', 'support']
       }
     }

     const status = error.response?.status

     // Auth errors
     if (status === 401) {
       return {
         title: 'Сессия истекла',
         message: 'Войдите в аккаунт снова.',
         actions: ['login']
       }
     }

     // Validation errors
     if (status === 400) {
       return {
         title: 'Ошибка ввода',
         message: error.response?.data?.message || 'Проверьте введённые данные.',
         actions: ['retry']
       }
     }

     // Rate limit
     if (status === 429) {
       return {
         title: 'Слишком много запросов',
         message: 'Подождите немного и попробуйте снова.',
         actions: []
       }
     }

     // Server errors
     if (status >= 500) {
       return {
         title: 'Ошибка сервера',
         message: 'Что-то пошло не так. Мы уже работаем над этим.',
         actions: ['retry', 'support']
       }
     }

     // Default
     return {
       title: 'Ошибка',
       message: error.response?.data?.message || 'Попробуйте позже.',
       actions: ['retry']
     }
   }
   ```

2. ✅ **Create ErrorDisplay component**
   ```jsx
   // src/frontend/src/components/ErrorDisplay.jsx
   import './ErrorDisplay.css'

   function ErrorDisplay({ error, onRetry, onSupport }) {
     const errorInfo = getErrorMessage(error)

     return (
       <div className="error-display">
         <div className="error-icon">⚠️</div>
         <h3>{errorInfo.title}</h3>
         <p>{errorInfo.message}</p>

         <div className="error-actions">
           {errorInfo.actions.includes('retry') && (
             <button onClick={onRetry} className="btn-primary">
               Попробовать снова
             </button>
           )}
           {errorInfo.actions.includes('login') && (
             <button onClick={() => navigate('/login')} className="btn-primary">
               Войти
             </button>
           )}
           {errorInfo.actions.includes('support') && (
             <button onClick={onSupport} className="btn-secondary">
               Связаться с поддержкой
             </button>
           )}
         </div>
       </div>
     )
   }
   ```

3. ✅ **Apply to pages**
   ```jsx
   // Replace all generic error messages
   {error && <ErrorDisplay error={error} onRetry={loadData} />}
   ```

**Deliverable**: Понятные, actionable error messages

---

### Day 6-7: SEO + Testing

#### Task 1.6: SEO Implementation ⭐⭐⭐⭐
**Время**: 3-4 часа
**Приоритет**: 🟡 HIGH

**Шаги**:

1. ✅ **Install react-helmet-async**
   ```bash
   cd src/frontend && npm install react-helmet-async
   ```

2. ✅ **Setup Helmet provider**
   ```jsx
   // src/frontend/src/main.jsx
   import { HelmetProvider } from 'react-helmet-async'

   <HelmetProvider>
     <App />
   </HelmetProvider>
   ```

3. ✅ **Create SEO component**
   ```jsx
   // src/frontend/src/components/SEO.jsx
   import { Helmet } from 'react-helmet-async'

   function SEO({
     title,
     description,
     keywords,
     image = '/og-image.jpg',
     url
   }) {
     const fullTitle = title
       ? `${title} | AI Tarot Decision Assistant`
       : 'AI Tarot Decision Assistant - Расклады Таро для Принятия Решений'

     const defaultDescription = 'Помощник для принятия решений через Таро. Ежедневные расклады, анализ решений, premium функции.'

     return (
       <Helmet>
         {/* Basic */}
         <title>{fullTitle}</title>
         <meta name="description" content={description || defaultDescription} />
         {keywords && <meta name="keywords" content={keywords} />}

         {/* Open Graph (Facebook, VK) */}
         <meta property="og:title" content={fullTitle} />
         <meta property="og:description" content={description || defaultDescription} />
         <meta property="og:image" content={image} />
         <meta property="og:url" content={url || window.location.href} />
         <meta property="og:type" content="website" />

         {/* Twitter */}
         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:title" content={fullTitle} />
         <meta name="twitter:description" content={description || defaultDescription} />
         <meta name="twitter:image" content={image} />

         {/* Additional */}
         <link rel="canonical" href={url || window.location.href} />
       </Helmet>
     )
   }

   export default SEO
   ```

4. ✅ **Add to all pages**
   ```jsx
   // DailyReadingPage.jsx
   <SEO
     title="Расклад Дня"
     description="Получите ежедневную карту Таро с персонализированной интерпретацией"
     keywords="таро, расклад дня, гадание"
   />

   // DecisionPage.jsx
   <SEO
     title="Анализ Решения"
     description="Расклад на 3 карты для анализа сложных решений"
   />
   ```

5. ✅ **Generate sitemap.xml**
   ```xml
   <!-- public/sitemap.xml -->
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://tarot-assistant.com/</loc>
       <priority>1.0</priority>
       <changefreq>daily</changefreq>
     </url>
     <url>
       <loc>https://tarot-assistant.com/cards</loc>
       <priority>0.8</priority>
       <changefreq>weekly</changefreq>
     </url>
     <url>
       <loc>https://tarot-assistant.com/premium</loc>
       <priority>0.9</priority>
       <changefreq>weekly</changefreq>
     </url>
     <!-- Add all public pages -->
   </urlset>
   ```

6. ✅ **Create robots.txt**
   ```txt
   # public/robots.txt
   User-agent: *
   Allow: /
   Disallow: /api/
   Disallow: /admin
   Disallow: /profile

   Sitemap: https://tarot-assistant.com/sitemap.xml
   ```

7. ✅ **Add structured data**
   ```jsx
   // public/index.html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "WebApplication",
     "name": "AI Tarot Decision Assistant",
     "description": "Помощник для принятия решений через Таро",
     "url": "https://tarot-assistant.com",
     "applicationCategory": "LifestyleApplication",
     "offers": {
       "@type": "Offer",
       "price": "499",
       "priceCurrency": "RUB",
       "name": "Premium подписка"
     }
   }
   </script>
   ```

**Deliverable**: SEO-оптимизированный сайт

---

## 📊 PROGRESS TRACKING

### Checklist:
- [ ] Day 1-2: Card Images + Sentry
  - [ ] Rider-Waite images downloaded (78)
  - [ ] Images optimized (WebP)
  - [ ] TarotCard component updated
  - [ ] Sentry account created
  - [ ] Sentry integrated (frontend + backend)
  - [ ] Error tracking tested

- [ ] Day 3-4: Security
  - [ ] CORS whitelist implemented
  - [ ] Rate limiting added
  - [ ] Input sanitization
  - [ ] Password validation
  - [ ] Secure cookies
  - [ ] Environment check

- [ ] Day 5: UX Improvements
  - [ ] Skeleton screens added
  - [ ] Error messages improved
  - [ ] ErrorDisplay component
  - [ ] Applied to all pages

- [ ] Day 6-7: SEO + Polish
  - [ ] Helmet setup
  - [ ] SEO component created
  - [ ] Meta tags on all pages
  - [ ] Sitemap.xml generated
  - [ ] Robots.txt created
  - [ ] Structured data added
  - [ ] Final testing
  - [ ] Bug fixes

---

## 🧪 TESTING CHECKLIST

### Before Launch:
- [ ] All 78 card images load correctly
- [ ] Sentry captures test errors
- [ ] Rate limiting works (test with Postman)
- [ ] CORS blocks unauthorized origins
- [ ] Loading states show on all pages
- [ ] Error messages are helpful
- [ ] SEO meta tags present in HTML
- [ ] sitemap.xml accessible
- [ ] robots.txt accessible
- [ ] Mobile responsive (test on phone)
- [ ] All existing tests still pass (33/33)

### Performance:
- [ ] Lighthouse score > 90
- [ ] Image loading < 2s
- [ ] First Contentful Paint < 1.8s

---

## 🚀 DEPLOYMENT AFTER PHASE 1

### Pre-deployment:
```bash
# 1. Final tests
npm test

# 2. Build frontend
cd src/frontend && npm run build

# 3. Check build size
du -sh dist/

# 4. Test production build locally
npm run start:prod
```

### Environment Variables for Production:
```bash
# Add to Railway/Vercel
NODE_ENV=production
JWT_SECRET=<strong-secret>
STRIPE_SECRET_KEY=<live-key>
VITE_SENTRY_DSN=<frontend-dsn>
SENTRY_DSN_BACKEND=<backend-dsn>
SESSION_SECRET=<strong-secret>
ALLOWED_ORIGINS=https://tarot-assistant.com,https://www.tarot-assistant.com
```

### Deploy:
```bash
# Railway
railway up

# или Vercel
vercel --prod
```

---

## 📈 SUCCESS METRICS

### После ФАЗЫ 1 мы должны иметь:
- ✅ 78 real card images (не placeholders)
- ✅ 0 unhandled errors (Sentry catching all)
- ✅ Security score A+ (на securityheaders.com)
- ✅ Lighthouse score > 90
- ✅ SEO score > 85 (на seobility.net)
- ✅ 0 console errors
- ✅ All tests passing (33/33)

---

## 💬 DAILY STANDUP FORMAT

**Каждый день буду репортить**:
1. Что сделано вчера
2. Что планирую сегодня
3. Есть ли блокеры
4. Обновленный прогресс (%)

---

**НАЧИНАЕМ?** 🚀

Подтверди, и я начну с Task 1.1 (Card Images)!
