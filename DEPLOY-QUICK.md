# ⚡ Deploy in 5 Minutes - Ultra Quick Guide

**GitHub**: https://github.com/Vibecodium/tarot.git

---

## 🚀 Railway (Fastest)

1. **Login**: https://railway.app → Login with GitHub

2. **New Project** → **"Deploy from GitHub repo"** → Select `Vibecodium/tarot`

3. **Add Variables** (click Variables tab):
```
NODE_ENV=production
PORT=4000
JWT_SECRET=6d19f0b756b2b3fbc7d888ad0e8c1d54e0e02713caba5af0f3451d8b8f46264c
JWT_REFRESH_SECRET=3018c335d65a642f1dc06d46d27f68bb8b16c5df51520cd97d01f9012355e59b
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
ALLOWED_ORIGINS=*
ADMIN_EMAILS=your@email.com
```

4. **Wait for deploy** (3-5 min)

5. **Copy your URL**: `https://your-app.up.railway.app`

6. **Update CORS** (replace * with your URL):
```
ALLOWED_ORIGINS=https://your-app.up.railway.app
CORS_ORIGIN=https://your-app.up.railway.app
FRONTEND_URL=https://your-app.up.railway.app
VITE_API_URL=https://your-app.up.railway.app/api
VITE_APP_URL=https://your-app.up.railway.app
```

7. **Done!** Open your URL 🎉

---

## ✅ Test Checklist

- [ ] Register account
- [ ] Generate daily reading
- [ ] Try decision analysis
- [ ] Check history
- [ ] View analytics
- [ ] Test natal chart

---

## 🐛 Issues?

**CORS Error**: Update ALLOWED_ORIGINS to exact URL (no trailing slash)

**502 Error**: Wait 30 seconds (cold start)

**Build Failed**: Click "Redeploy"

---

**Full Guide**: See DEPLOY-STEP-BY-STEP.md

**Secrets**: See DEPLOYMENT-SECRETS.md
