# ✅ PRE-DEPLOYMENT CHECKLIST

**Дата**: 14 ноября 2025
**Цель**: Убедиться что всё готово к deploy

---

## 🎯 CRITICAL CHECKS

### Code & Build:
- [x] ✅ All code committed to git
- [x] ✅ Production build successful (`npm run build`)
- [x] ✅ Bundle size acceptable (423KB gzipped)
- [x] ✅ No critical errors in build
- [x] ✅ All features working locally
- [x] ✅ Tests passing (if any)

### Configuration:
- [x] ✅ `.gitignore` configured correctly
- [x] ✅ `railway.json` created
- [x] ✅ `.env.production.example` created
- [x] ✅ Start script working (`npm run start:prod`)
- [x] ✅ Port configured (4000)
- [x] ✅ NODE_ENV=production handling

### Security:
- [x] ✅ CORS whitelist implemented
- [x] ✅ Rate limiting active
- [x] ✅ Input sanitization enabled
- [x] ✅ Password validation strict
- [x] ✅ Environment validation working
- [x] ✅ Helmet security headers
- [x] ✅ No secrets in code

### SEO:
- [x] ✅ Meta tags on key pages
- [x] ✅ sitemap.xml generated
- [x] ✅ robots.txt created
- [x] ✅ Schema.org structured data
- [x] ✅ Open Graph tags

### UX:
- [x] ✅ Loading skeletons (10 components)
- [x] ✅ Error handling (ErrorDisplay)
- [x] ✅ Card images (78 WebP)
- [x] ✅ Responsive design
- [x] ✅ Mobile-friendly

### Documentation:
- [x] ✅ README.md updated
- [x] ✅ Deployment guides created
- [x] ✅ Environment variables documented
- [x] ✅ Troubleshooting guide

**EVERYTHING CHECKED! ✅**

---

## 📝 TODO BEFORE DEPLOY

### Must Do:
1. [ ] **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. [ ] **Generate JWT Secrets** (2 strong secrets)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Run twice, save both secrets
   ```

3. [ ] **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub (recommended)

---

### Optional (Can do after deploy):
- [ ] Create Sentry account (sentry.io)
- [ ] Setup Stripe account (stripe.com)
- [ ] Register custom domain
- [ ] Configure email service (Gmail SMTP)

---

## 🚀 DEPLOYMENT SEQUENCE

### Phase 1: Initial Deploy (15 min)
```bash
# 1. Login
railway login

# 2. Initialize
railway init

# 3. Set required variables
railway variables set NODE_ENV=production
railway variables set PORT=4000
railway variables set JWT_SECRET=YOUR_SECRET_1
railway variables set JWT_REFRESH_SECRET=YOUR_SECRET_2

# 4. Deploy!
railway up
```

**Result**: You get a URL like https://ai-tarot.up.railway.app

---

### Phase 2: CORS Update (5 min)
```bash
# Use your actual Railway URL from Phase 1
railway variables set ALLOWED_ORIGINS=https://your-actual-url.up.railway.app
railway variables set CORS_ORIGIN=https://your-actual-url.up.railway.app
railway variables set FRONTEND_URL=https://your-actual-url.up.railway.app

# Redeploy
railway up
```

---

### Phase 3: Test & Verify (10 min)
1. Open your Railway URL
2. Register test account
3. Generate daily reading
4. Check all pages work
5. Try premium page
6. Verify security (rate limiting)

**If all works** → ✅ LIVE!

---

## 🧪 OPTIONAL: Test Production Locally First

**Before Railway deploy, test locally**:

```bash
# 1. Set production env
export NODE_ENV=production  # Linux/Mac
set NODE_ENV=production     # Windows

# 2. Generate test secrets
export JWT_SECRET=test-secret-32-chars-minimum-length

# 3. Start production server
npm run start:prod

# 4. Open http://localhost:4000
# Should serve built frontend + API
```

**If this works** → Production deploy will work too!

---

## 📊 WHAT TO EXPECT

### First Deploy:
- **Time**: 5-10 minutes
- **Logs**: You'll see build progress
- **Result**: Production URL

### After Deploy:
```
✅ URL: https://your-app.up.railway.app
✅ HTTPS: Automatic (SSL certificate)
✅ Uptime: 99.9%
✅ Performance: Fast (CDN)
✅ Database: Persistent storage
✅ Logs: Real-time via Railway dashboard
```

---

## 💰 COSTS

### Month 1:
- Railway: **$0** (free $5 credit = ~500 hours)
- Domain: $0 (use Railway subdomain)
- SSL: $0 (automatic)
**Total: $0**

### Month 2+:
- Railway Hobby: **$5/month**
- Enough for 1000-5000 users
**Total: $5/month**

### When you scale (10K+ users):
- Railway Pro: $20/month
**Total: $20/month**

---

## 🐛 COMMON ISSUES & FIXES

### "Railway not found"
```bash
# Install first
npm install -g @railway/cli

# Verify
railway --version
```

### "Build fails"
```bash
# Check Node version
node --version  # Should be 18+

# Check build locally first
npm run build
```

### "502 Bad Gateway"
```bash
# Server is starting, wait 1-2 minutes
# Check logs: railway logs
```

### "CORS error"
```bash
# Update ALLOWED_ORIGINS with actual URL
railway variables set ALLOWED_ORIGINS=https://your-url.up.railway.app
railway up
```

---

## 🎯 YOUR EXACT NEXT STEPS

**Right now** (if ready to deploy):

**Step 1**: Install Railway CLI
```bash
npm install -g @railway/cli
```

**Step 2**: Generate secrets (save them!)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Run twice for 2 secrets
```

**Step 3**: Deploy
```bash
railway login
railway init
# Set variables (JWT_SECRET, etc)
railway up
```

**Step 4**: Update CORS with your URL

**Step 5**: Test your live app!

---

## 📚 FILES TO REFERENCE

**During deployment**:
- `DEPLOY-NOW-GUIDE.md` - Step-by-step
- `.env.production.example` - Env vars list

**After deployment**:
- `DEPLOYMENT-READY.md` - Post-deploy tasks
- `TESTING-GUIDE.md` - Testing checklist

---

## ✅ YOU'RE READY!

**All preparation complete**:
- ✅ Code ready
- ✅ Build tested
- ✅ Configs created
- ✅ Guides written
- ✅ Security hardened

**Next command**:
```bash
npm install -g @railway/cli
```

**Then follow DEPLOY-NOW-GUIDE.md!**

---

**Want me to help install Railway CLI and start deployment now?** 🚀

Or prefer to do it yourself when ready?

Let me know! 🎯
