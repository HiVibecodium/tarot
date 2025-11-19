# 🔐 Deployment Secrets & Configuration

**Generated on**: 2025-11-17
**Status**: Ready for deployment

---

## 🔑 Generated JWT Secrets

**IMPORTANT**: Use these secrets for production deployment!

```bash
JWT_SECRET=6d19f0b756b2b3fbc7d888ad0e8c1d54e0e02713caba5af0f3451d8b8f46264c
JWT_REFRESH_SECRET=3018c335d65a642f1dc06d46d27f68bb8b16c5df51520cd97d01f9012355e59b
```

---

## 🚀 Quick Deployment Guide

### Option 1: Railway (Backend + Frontend together)

1. **Push code to GitHub** (if not done):
```bash
git push origin main
```

2. **Go to Railway.app**:
   - Sign up/Login: https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables in Railway Dashboard**:

Click on your service → Variables tab → Add these:

```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=6d19f0b756b2b3fbc7d888ad0e8c1d54e0e02713caba5af0f3451d8b8f46264c
JWT_REFRESH_SECRET=3018c335d65a642f1dc06d46d27f68bb8b16c5df51520cd97d01f9012355e59b
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
ALLOWED_ORIGINS=*
ADMIN_EMAILS=your-email@example.com
```

4. **After first deployment**, update CORS with your Railway URL:
```bash
ALLOWED_ORIGINS=https://your-app.up.railway.app
CORS_ORIGIN=https://your-app.up.railway.app
FRONTEND_URL=https://your-app.up.railway.app
```

5. **Add Frontend Environment Variables**:
```bash
VITE_API_URL=https://your-app.up.railway.app/api
VITE_APP_URL=https://your-app.up.railway.app
```

6. **Deploy**: Railway will auto-deploy!

---

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Step A: Deploy Backend to Railway

Follow Option 1 above, but only set backend variables.

#### Step B: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Import project from GitHub**
3. **Configure build settings**:
   - Framework Preset: Vite
   - Root Directory: `src/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables in Vercel**:
```bash
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_APP_URL=https://your-vercel-frontend.vercel.app
```

5. **Deploy**: Vercel will auto-deploy!

6. **Update Railway CORS**:
```bash
ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
FRONTEND_URL=https://your-vercel-frontend.vercel.app
```

---

### Option 3: Render.com (Free Tier)

1. **Go to Render.com**: https://render.com
2. **New Web Service**
3. **Connect GitHub repo**
4. **Configure**:
   - Name: ai-tarot-assistant
   - Environment: Node
   - Build Command: `npm install && cd src/frontend && npm install && npm run build && cd ../..`
   - Start Command: `npm start`
   - Plan: Free

5. **Add all environment variables** from Railway section above

6. **Deploy**: Will take 5-10 minutes on free tier

---

## 🧪 Testing After Deployment

### Checklist:

- [ ] Open deployment URL
- [ ] Register new account
- [ ] Login works
- [ ] Generate daily reading
- [ ] Card images display
- [ ] Create decision analysis
- [ ] Check reading history
- [ ] View analytics dashboard
- [ ] Test natal chart calculator
- [ ] Check all pages load

### Expected URLs:

**Railway**:
- Full app: `https://ai-tarot-assistant-production.up.railway.app`
- API: `https://ai-tarot-assistant-production.up.railway.app/api`
- Health: `https://ai-tarot-assistant-production.up.railway.app/api/health`

**Vercel (Frontend only)**:
- App: `https://your-project.vercel.app`

**Render**:
- Full app: `https://ai-tarot-assistant.onrender.com`

---

## 🐛 Common Issues

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check ALLOWED_ORIGINS matches your frontend URL exactly
2. Include both http:// and https:// if needed
3. No trailing slashes in URLs

### 502 Bad Gateway

**Problem**: Server not responding

**Solution**:
1. Wait 1-2 minutes (Railway cold start)
2. Check logs in Railway/Vercel dashboard
3. Verify all environment variables are set

### Build Failed

**Problem**: Deployment build fails

**Solution**:
1. Check logs for error message
2. Verify package.json has all dependencies
3. Test build locally: `npm run build`

### JWT Errors

**Problem**: "Invalid token" or "Token expired"

**Solution**:
1. Verify JWT_SECRET is set correctly
2. Check JWT_EXPIRES_IN format (24h, not 86400)
3. Clear browser localStorage and re-login

---

## 💡 Post-Deployment Steps

### Immediate:
1. Test all features (use checklist above)
2. Share URL with test users
3. Monitor logs for errors
4. Check performance

### Within 24 hours:
1. Configure custom domain (optional)
2. Setup Sentry error tracking
3. Enable Stripe (if ready)
4. Add Google Analytics

### Within 1 week:
1. Submit to Google Search Console
2. Configure email notifications
3. Setup backup strategy
4. Monitor user feedback

---

## 📊 Expected Performance

**Railway Free Tier**:
- First load: 2-3 seconds (cold start)
- Subsequent: < 1 second
- Uptime: 99%+
- Sleep after 30 min inactivity

**Vercel Free Tier**:
- First load: < 1 second
- Subsequent: < 500ms
- Uptime: 99.9%+
- No sleep

**Render Free Tier**:
- First load: 3-5 seconds (cold start)
- Subsequent: 1-2 seconds
- Uptime: 99%+
- Sleep after 15 min inactivity

---

## 🎯 Success Criteria

Deployment is successful when:

✅ URL accessible from any browser
✅ All pages load without errors
✅ Users can register and login
✅ Tarot readings work
✅ Card images display correctly
✅ Analytics dashboard functional
✅ No console errors
✅ API responses < 500ms
✅ Security headers present
✅ HTTPS enabled (automatic)

---

## 📞 Support

**Railway**:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel**:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Render**:
- Docs: https://render.com/docs
- Community: https://community.render.com

---

**Ready to deploy!** 🚀

Choose your preferred platform and follow the guide above!
