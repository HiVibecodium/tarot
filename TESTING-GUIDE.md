# 🧪 Testing Guide - Local Development

**Servers Running**:
- Backend: http://localhost:4000
- Frontend: http://localhost:5173

---

## 🐛 Common Issue: "Authentication token is invalid"

### Причина:
Токен в localStorage был создан с другим JWT_SECRET (после перезапуска сервера)

### Решение (выбери один):

#### Option 1: Logout и Login заново
1. Открой http://localhost:5173
2. Click "Выйти" (если logged in)
3. Login снова
4. Токен обновится автоматически

#### Option 2: Clear Browser Data
```javascript
// Открой Console в браузере (F12)
// Вставь:
localStorage.clear()
location.reload()
```

#### Option 3: Clear localStorage via Script
```bash
# В браузере Console:
localStorage.removeItem('token')
localStorage.removeItem('user')
location.reload()
```

---

## ✅ Quick Test Checklist

### 1. Registration/Login
- [ ] Go to http://localhost:5173
- [ ] Click "Регистрация"
- [ ] Create account (email + password)
- [ ] Should redirect to /dashboard
- [ ] Token saved in localStorage

### 2. Daily Reading (NEW CARD IMAGES!)
- [ ] Click "Расклад Дня"
- [ ] Should see **colored card image** (not just emoji)
- [ ] Card should have gradient background
- [ ] Image loads smoothly (lazy load)
- [ ] Click "Получить расклад дня"
- [ ] Should see interpretation

### 3. Decision Analysis
- [ ] Click "Анализ Решения"
- [ ] Enter question + options
- [ ] Click "Получить расклад"
- [ ] Should see 3 cards (Past/Present/Future)
- [ ] All cards have images

### 4. Card Encyclopedia
- [ ] Click "Энциклопедия"
- [ ] Should see grid of cards
- [ ] Each card has unique colored image
- [ ] Click on card → Details

### 5. Profile & Stats
- [ ] Go to "Профиль"
- [ ] Should see user stats
- [ ] Streak counter
- [ ] GDPR export button

### 6. Analytics (Charts)
- [ ] Go to "Аналитика"
- [ ] Should see charts
- [ ] Card frequency
- [ ] Reading types

### 7. Premium Page
- [ ] Go to "Premium"
- [ ] Should see pricing
- [ ] Stripe integration info

---

## 🎨 Visual Testing - Card Images

### Check These:

**Major Arcana** (Purple gradient):
- [ ] The Fool - Purple with 🔮
- [ ] The Magician - Purple with 🔮
- [ ] The Empress - Purple with 🔮

**Wands** (Pink gradient):
- [ ] Ace of Wands - Pink with 🔥
- [ ] Two of Wands - Pink with 🔥

**Cups** (Blue gradient):
- [ ] Ace of Cups - Blue with 💧

**Swords** (Green gradient):
- [ ] Ace of Swords - Green with ⚔️

**Pentacles** (Red gradient):
- [ ] Ace of Pentacles - Red with ⭐

### Expected Behavior:
- ✅ Each suit has unique color
- ✅ Images load with fade-in
- ✅ Placeholder shows while loading
- ✅ Fallback works if image missing

---

## 🔧 Development Tools

### Browser Console Checks:

**Check localStorage**:
```javascript
// Should have:
localStorage.getItem('token')      // JWT token
localStorage.getItem('user')       // User data JSON
localStorage.getItem('theme')      // 'light' or 'dark'
```

**Check API calls**:
```javascript
// Open Network tab (F12)
// Filter: XHR
// Should see:
- POST /api/auth/login (200)
- POST /api/readings/daily (200)
- GET /api/readings/history (200)
```

**Check errors**:
```javascript
// Console tab should be clean
// No red errors
// Warnings OK (React DevTools warnings are normal)
```

---

## 🚨 Troubleshooting

### Issue: "Authentication token is invalid"
**Solution**: Clear localStorage and login again

### Issue: Card images не загружаются
**Solution**: Check browser console for 404 errors
```bash
# Verify images exist:
ls src/frontend/public/images/cards/major/
# Should see: 00.webp, 01.webp, ... 21.webp
```

### Issue: Server не запускается
**Solution**:
```bash
# Check if port 4000 is free
netstat -ano | findstr :4000

# Kill process if needed
taskkill /PID <pid> /F
```

### Issue: Frontend не запускается
**Solution**:
```bash
# Check if port 5173 is free
netstat -ano | findstr :5173

# Kill if needed
taskkill /PID <pid> /F
```

---

## 📊 Performance Testing

### Check Lighthouse Score:

1. Open http://localhost:5173
2. F12 → Lighthouse tab
3. Click "Analyze page load"

**Target Scores**:
- Performance: > 90
- Accessibility: > 85
- Best Practices: > 90
- SEO: > 80 (will improve in Task 1.6)

### Check Network Load:

1. F12 → Network tab
2. Reload page
3. Check transferred size:
   - Initial load: < 500KB
   - With 78 card images: < 3MB (lazy loaded)

---

## ✅ Expected Results

After following this guide you should have:
- ✅ Logged in successfully
- ✅ Saw beautiful colored card images
- ✅ Generated daily reading
- ✅ Created decision analysis
- ✅ Viewed analytics charts
- ✅ No console errors
- ✅ Smooth UX

---

## 🎯 Known Issues (Non-Blocking)

1. **Sentry not configured** - Expected (needs DSN)
2. **No real Rider-Waite images** - Placeholders work fine
3. **Some warnings in console** - React DevTools (normal)

---

## 📝 Feedback

If you find any bugs:
1. Check browser console for errors
2. Check backend logs (terminal with nodemon)
3. Note the steps to reproduce
4. We'll fix in Phase 1!

---

**Happy Testing!** 🧪

Everything should work beautifully with new card images! 🎴✨
