# 🔧 Render Environment Variables Setup

Copy these to Render Dashboard → Environment Variables

---

## ✅ Critical (Required for basic operation)

```env
NODE_ENV=production
PORT=4000
```

```env
# Your production domain
FRONTEND_URL=https://tarot-a2oi.onrender.com
API_BASE_URL=https://tarot-a2oi.onrender.com
CORS_ORIGIN=https://tarot-a2oi.onrender.com
```

```env
# Generated JWT secrets (COPY FROM BELOW)
JWT_SECRET=d6c0a98ba17ce204de0fa7973eb873179d509dbc463da28fa00960470f12efe9
JWT_REFRESH_SECRET=d4961ee9f752f3cc8340c3c2283afacd20427084d7b797037b5e44419749f523
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 💰 Stripe (Required for payments)

```env
# TEST KEYS (for now):
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# When ready for production, replace with:
# STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
# STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
```

**Setup Steps:**
1. Go to https://dashboard.stripe.com
2. Get your API keys
3. Create webhook: https://tarot-a2oi.onrender.com/api/payment/webhook
4. Add events: checkout.session.completed, customer.subscription.*
5. Copy webhook secret

---

## 🔔 Push Notifications (Optional but recommended)

```env
# Generated VAPID keys (COPY FROM BELOW)
VAPID_PUBLIC_KEY=BMDa_CXdQZzeZnuX0q9ZhFTlE-m3u9cVWoqMAeeqhaq7_UXi1hG7zwubuPDf26NK_SP2Uldp14by3V44K1bb8qc
VAPID_PRIVATE_KEY=Gusm2WCuBJI7r-8nS0O9bFL8fzKWlcWBeKg47Y3YvfQ
```

---

## 📧 Email Notifications (Optional)

**Gmail Setup:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=AI Tarot <noreply@tarot-assistant.com>
```

**How to get App Password:**
1. Enable 2FA on Gmail
2. Google Account → Security → 2-Step Verification
3. App passwords → Generate for "Mail"
4. Copy 16-character password

---

## 🐛 Error Tracking (Optional)

```env
# Sentry (recommended for production)
SENTRY_DSN_BACKEND=https://YOUR_DSN@sentry.io/PROJECT_ID
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

**Setup:**
1. Go to sentry.io
2. Create Node.js project
3. Copy DSN

---

## 🎛️ Feature Flags

```env
AI_ENABLED=false
PREMIUM_ENABLED=true
```

---

## 🔐 Rate Limiting

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 👨‍💼 Admin

```env
# Comma-separated admin emails
ADMIN_EMAILS=admin@tarot-assistant.com
```

---

## 📝 Complete Checklist

Copy to Render Dashboard:

### Tier 1: Essential (Required)
- [ ] NODE_ENV=production
- [ ] PORT=4000
- [ ] FRONTEND_URL
- [ ] API_BASE_URL
- [ ] CORS_ORIGIN
- [ ] JWT_SECRET
- [ ] JWT_REFRESH_SECRET

### Tier 2: Payments (For monetization)
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET

### Tier 3: Notifications (For engagement)
- [ ] VAPID_PUBLIC_KEY
- [ ] VAPID_PRIVATE_KEY
- [ ] SMTP_USER (optional)
- [ ] SMTP_PASS (optional)

### Tier 4: Monitoring (For reliability)
- [ ] SENTRY_DSN_BACKEND (optional)

---

## 🚀 After Setting Variables

1. Click "Save" in Render Dashboard
2. Render will automatically redeploy
3. Wait 2-3 minutes
4. Check: https://tarot-a2oi.onrender.com/health
5. Test the app!

---

## 🧪 Verification

Test these URLs after deployment:

```bash
# Health
curl https://tarot-a2oi.onrender.com/health

# Frontend
open https://tarot-a2oi.onrender.com

# API
curl https://tarot-a2oi.onrender.com/api/cards

# Registration
curl -X POST https://tarot-a2oi.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"TestPass2025!#","displayName":"Test"}'
```

---

**Status**: Ready to configure on Render! 🎉
