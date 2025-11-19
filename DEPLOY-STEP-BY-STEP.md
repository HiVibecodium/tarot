# 🚀 Deploy in 15 Minutes - Step by Step

**Current Status**: Code is on GitHub, ready to deploy!

**GitHub Repo**: https://github.com/Vibecodium/tarot.git

**Time Required**: 15-20 minutes

---

## 📋 What You'll Deploy

✅ Full-stack Tarot application
✅ Frontend (React + Vite)
✅ Backend (Node.js + Express)
✅ All 120+ features working

---

## 🎯 Option 1: Railway (Easiest - Recommended)

### Step 1: Go to Railway (2 min)

1. Open browser: **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with **GitHub** (recommended)
4. Authorize Railway to access your repos

### Step 2: Create New Project (1 min)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select: **`Vibecodium/tarot`**
4. Click **"Deploy Now"**

### Step 3: Configure Environment Variables (5 min)

Railway will start building. While it builds:

1. Click on your service/deployment
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these variables one by one:

**Core Variables**:
```
NODE_ENV = production
PORT = 4000
```

**JWT Secrets** (from DEPLOYMENT-SECRETS.md):
```
JWT_SECRET = 6d19f0b756b2b3fbc7d888ad0e8c1d54e0e02713caba5af0f3451d8b8f46264c
JWT_REFRESH_SECRET = 3018c335d65a642f1dc06d46d27f68bb8b16c5df51520cd97d01f9012355e59b
JWT_EXPIRES_IN = 24h
JWT_REFRESH_EXPIRES_IN = 7d
```

**Temporary CORS** (we'll update after we get URL):
```
CORS_ORIGIN = *
ALLOWED_ORIGINS = *
```

**Admin Email** (your email):
```
ADMIN_EMAILS = your-email@example.com
```

5. Click **"Deploy"** or wait for auto-deploy

### Step 4: Get Your URL (1 min)

1. Wait for build to complete (2-5 minutes)
2. Look for: **"Deployment successful"** ✅
3. Find your URL: `https://your-app.up.railway.app`
4. **Copy this URL!** 📋

### Step 5: Update CORS (2 min)

Now update CORS with your real URL:

1. Go back to **"Variables"** tab
2. Edit these variables (replace `*` with your URL):

```
ALLOWED_ORIGINS = https://your-app.up.railway.app
CORS_ORIGIN = https://your-app.up.railway.app
```

3. Add new variable:
```
FRONTEND_URL = https://your-app.up.railway.app
```

4. Add frontend variables:
```
VITE_API_URL = https://your-app.up.railway.app/api
VITE_APP_URL = https://your-app.up.railway.app
```

5. Railway will **auto-redeploy** with new settings

### Step 6: Test Your App! (5 min)

1. Open your URL: `https://your-app.up.railway.app`
2. You should see the Tarot app! 🎉

**Test Checklist**:
- [ ] Page loads ✅
- [ ] Click "Регистрация" → Create account
- [ ] Login with new account
- [ ] Go to "Расклад Дня" → Generate reading
- [ ] Check "История" → See saved reading
- [ ] Try "Анализ Решения" → 3-card spread
- [ ] Open "Аналитика" → View stats
- [ ] Test "Натальная Карта" → Enter birth data

**Everything working?** → **DEPLOYMENT SUCCESSFUL!** 🎊

---

## 🎯 Option 2: Vercel (Frontend) + Railway (Backend)

### Part A: Deploy Backend to Railway

Follow Option 1 above, but:
- Only add backend variables (NODE_ENV, PORT, JWT_*, ADMIN_EMAILS)
- Skip VITE_* variables for now
- Get your Railway backend URL: `https://backend.up.railway.app`

### Part B: Deploy Frontend to Vercel

#### Step 1: Go to Vercel (2 min)

1. Open: **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Use **GitHub** account
4. Authorize Vercel

#### Step 2: Import Project (2 min)

1. Click **"Add New..."** → **"Project"**
2. Find **`Vibecodium/tarot`** repo
3. Click **"Import"**

#### Step 3: Configure Build Settings (3 min)

**Framework Preset**: Vite

**Root Directory**: Click "Edit" → Enter `src/frontend`

**Build Command**:
```
npm run build
```

**Output Directory**:
```
dist
```

**Install Command**: Leave default

#### Step 4: Add Environment Variables (2 min)

Click **"Environment Variables"** section:

Add these:
```
VITE_API_URL = https://your-railway-backend.up.railway.app/api
VITE_APP_URL = https://your-vercel-app.vercel.app
```

(Replace URLs with your actual Railway backend and future Vercel URL)

#### Step 5: Deploy (1 min)

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your Vercel URL: `https://your-project.vercel.app`

#### Step 6: Update Backend CORS (2 min)

Go back to Railway:
1. Open your backend service
2. Go to **"Variables"**
3. Update:
```
ALLOWED_ORIGINS = https://your-vercel-app.vercel.app
CORS_ORIGIN = https://your-vercel-app.vercel.app
FRONTEND_URL = https://your-vercel-app.vercel.app
```

4. Update Vercel `VITE_APP_URL` to actual Vercel URL if needed

#### Step 7: Test

Open your Vercel URL and test all features!

---

## 🎯 Option 3: Render.com (100% Free)

### Step 1: Go to Render (2 min)

1. Open: **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Use **GitHub** account

### Step 2: Create Web Service (3 min)

1. Dashboard → **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Authorize Render to access GitHub
4. Find and select **`Vibecodium/tarot`**

### Step 3: Configure Service (5 min)

**Name**: `ai-tarot-assistant`

**Region**: Choose closest to you

**Branch**: `main`

**Root Directory**: Leave empty

**Runtime**: `Node`

**Build Command**:
```
npm install && cd src/frontend && npm install && npm run build && cd ../..
```

**Start Command**:
```
npm start
```

**Plan**: **Free** (select this!)

### Step 4: Add Environment Variables (5 min)

Scroll down to **"Environment Variables"**

Click **"Add Environment Variable"** for each:

```
NODE_ENV = production
PORT = 4000
JWT_SECRET = 6d19f0b756b2b3fbc7d888ad0e8c1d54e0e02713caba5af0f3451d8b8f46264c
JWT_REFRESH_SECRET = 3018c335d65a642f1dc06d46d27f68bb8b16c5df51520cd97d01f9012355e59b
JWT_EXPIRES_IN = 24h
JWT_REFRESH_EXPIRES_IN = 7d
CORS_ORIGIN = *
ALLOWED_ORIGINS = *
ADMIN_EMAILS = your-email@example.com
```

### Step 5: Create Web Service (10 min)

1. Click **"Create Web Service"**
2. Wait for build (takes 5-10 minutes on free tier)
3. Watch logs for progress

### Step 6: Get URL and Update CORS (2 min)

1. Your URL will be: `https://ai-tarot-assistant.onrender.com`
2. Go to **"Environment"** tab
3. Update these variables:
```
ALLOWED_ORIGINS = https://ai-tarot-assistant.onrender.com
CORS_ORIGIN = https://ai-tarot-assistant.onrender.com
FRONTEND_URL = https://ai-tarot-assistant.onrender.com
VITE_API_URL = https://ai-tarot-assistant.onrender.com/api
VITE_APP_URL = https://ai-tarot-assistant.onrender.com
```

4. Click **"Save Changes"** → Auto-redeploy

### Step 7: Test

Open your Render URL and test!

**Note**: Free tier sleeps after 15 minutes of inactivity. First load after sleep takes ~30 seconds.

---

## 🐛 Troubleshooting

### Build Failed

**Check**:
1. View logs in Railway/Vercel/Render dashboard
2. Look for error message
3. Common issue: Missing dependencies → Usually auto-fixes on retry

**Solution**: Click **"Redeploy"** or **"Retry"**

### CORS Error

**Symptoms**: Frontend can't connect to backend, console shows CORS error

**Solution**:
1. Make sure ALLOWED_ORIGINS exactly matches your frontend URL
2. No trailing slashes: `https://app.com` not `https://app.com/`
3. Include protocol: `https://` not just `app.com`

### 502 Bad Gateway

**Cause**: Server is starting (cold start)

**Solution**: Wait 30-60 seconds and refresh

### JWT Invalid

**Cause**: JWT secrets not set or incorrect

**Solution**:
1. Check JWT_SECRET is set in environment variables
2. Verify it matches the generated one from DEPLOYMENT-SECRETS.md
3. Clear browser localStorage and login again

### Images Not Loading

**Cause**: SVG files not deployed

**Solution**:
1. Check `src/frontend/public/cards-svg/` exists in repo
2. Verify build includes public folder
3. Already configured in vite.config.js, should work automatically

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] URL opens without errors
- [ ] Can register new account
- [ ] Can login
- [ ] Daily reading generates cards
- [ ] Card images display (SVG illustrations)
- [ ] Decision analysis works (3 cards)
- [ ] History saves readings
- [ ] Analytics dashboard shows data
- [ ] Natal chart calculator works
- [ ] No console errors (press F12)

---

## 📊 What You Get (Free Tier)

### Railway Free:
- ✅ $5 free credit
- ✅ ~550 hours/month
- ✅ Auto-sleep after 30 min inactivity
- ✅ Perfect for testing
- 💰 **After credit**: $5/month

### Vercel Free:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ No sleep
- ✅ Super fast CDN
- 💰 **Always free** for personal projects

### Render Free:
- ✅ 750 hours/month
- ✅ Auto-sleep after 15 min
- ✅ Good for demos
- 💰 **Always free** (with sleep)

---

## 🎉 Next Steps After Deployment

### Immediate:
1. Share URL with friends for testing
2. Monitor logs for any errors
3. Test all features thoroughly

### This Week:
1. Get custom domain (optional): `mytarot.com`
2. Configure Stripe for payments (when ready)
3. Setup Sentry for error tracking
4. Add Google Analytics

### Marketing:
1. Create landing page
2. Share on social media
3. Submit to product directories
4. Get user feedback

---

## 🆘 Need Help?

**Check logs first**:
- Railway: Dashboard → Logs tab
- Vercel: Deployment → Build Logs
- Render: Logs tab

**Platform Support**:
- Railway: https://discord.gg/railway
- Vercel: https://vercel.com/support
- Render: https://community.render.com

**Project Issues**:
- Review DEPLOYMENT-SECRETS.md
- Check environment variables match
- Verify URLs have no typos

---

## 🎯 Recommended Approach

**For Beginners**: Use **Railway Option 1** - Easiest, everything in one place

**For Best Performance**: Use **Vercel + Railway Option 2** - Fast frontend, reliable backend

**For Zero Cost**: Use **Render Option 3** - Completely free forever (with sleep)

---

**Ready?** Pick your option above and start deploying! 🚀

You'll have a live app in 15-20 minutes! 🎊
