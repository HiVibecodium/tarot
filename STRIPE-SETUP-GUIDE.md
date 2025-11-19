# 💳 Stripe Setup Guide - Пошаговая Инструкция

**Цель**: Получить production API ключи для приёма платежей

**Время**: 30-45 минут

---

## 🎯 ЧТО ВАМ ПОНАДОБИТСЯ

1. Email адрес
2. Данные компании (или личные для ИП)
3. Банковские реквизиты для выплат

---

## 📋 ПОШАГОВАЯ ИНСТРУКЦИЯ

### ШАГ 1: Регистрация на Stripe (5 минут)

1. **Откройте**: https://stripe.com
2. **Нажмите**: "Start now" или "Sign up"
3. **Заполните**:
   - Email
   - Полное имя
   - Страна: Russia (или ваша)
   - Пароль
4. **Подтвердите** email (проверьте почту)

✅ **Результат**: Вы в Stripe Dashboard

---

### ШАГ 2: Активация аккаунта (10 минут)

1. **В Dashboard** нажмите "Activate account"
2. **Заполните информацию**:

**Business Details:**
- Business type: Individual (ИП) или Company
- Business name: "AI Tarot Decision Assistant"
- Industry: Software/SaaS
- Website: ваш сайт или оставьте пустым

**Personal Details:**
- Legal name
- Date of birth
- Address
- Phone number

**Bank Account:**
- Банковские реквизиты для получения выплат
- IBAN или номер счёта
- БИК банка

3. **Подтвердите** личность (может потребоваться паспорт)

✅ **Результат**: Account activated

---

### ШАГ 3: Создание продукта Premium (10 минут)

1. **В Dashboard** → **Products** → **Add Product**

2. **Заполните**:
   - **Name**: Premium Subscription
   - **Description**: Премиум подписка на Таро Помощник Решений
   - **Pricing model**: Recurring (повторяющийся платёж)
   - **Price**: 499 RUB
   - **Billing period**: Monthly (ежемесячно)
   - **Currency**: RUB (рубли)

3. **Сохраните продукт**

4. **Скопируйте Price ID**:
   - Формат: `price_xxxxxxxxxxxxx`
   - Сохраните куда-нибудь

✅ **Результат**: Продукт создан, Price ID получен

---

### ШАГ 4: Получение API ключей (5 минут)

1. **Dashboard** → **Developers** → **API Keys**

2. **Увидите 2 ключа**:

**Test Mode (для тестирования):**
- Publishable key: `pk_test_xxxxx`
- Secret key: `sk_test_xxxxx`

**Live Mode (для production):**
- Нажмите toggle "View test data" → OFF
- Publishable key: `pk_live_xxxxx`
- Secret key: `sk_live_xxxxx`

3. **Скопируйте Live ключи**:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

⚠️ **ВАЖНО**: Храните Secret key в безопасности!

✅ **Результат**: API ключи получены

---

### ШАГ 5: Настройка Webhook (10 минут)

1. **Dashboard** → **Developers** → **Webhooks**

2. **Add endpoint**

3. **Заполните**:
   - **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - **Description**: "Payment webhooks for Tarot Assistant"
   - **Version**: Latest API version

4. **Select events to listen to**:
   - ☑️ `checkout.session.completed`
   - ☑️ `customer.subscription.created`
   - ☑️ `customer.subscription.updated`
   - ☑️ `customer.subscription.deleted`
   - ☑️ `invoice.payment_succeeded`
   - ☑️ `invoice.payment_failed`

5. **Add endpoint**

6. **Скопируйте Signing Secret**:
   - Откроется webhook
   - Нажмите "Reveal" рядом с "Signing secret"
   - Формат: `whsec_xxxxxxxxxxxxx`
   - Сохраните

✅ **Результат**: Webhook настроен, signing secret получен

---

### ШАГ 6: Обновление .env.production

Откройте `.env.production` и обновите:

```bash
# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_ваш_ключ_здесь
STRIPE_PUBLISHABLE_KEY=pk_live_ваш_ключ_здесь
STRIPE_WEBHOOK_SECRET=whsec_ваш_секрет_здесь
STRIPE_PREMIUM_PRICE_ID=price_ваш_price_id_здесь
```

Также обновите frontend `.env.production`:

```bash
# src/frontend/.env.production
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_ваш_ключ_здесь
```

---

## ✅ ПРОВЕРКА

После настройки:

```bash
# Запустите deployment check
npm run deploy:check

# Должно показать:
# ✅ Stripe keys configured
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Test Mode (безопасно):

Используйте test ключи (`pk_test_...`, `sk_test_...`) для проверки:

**Тестовая карта:**
```
Card number: 4242 4242 4242 4242
Expiry: любая будущая дата (например 12/25)
CVC: любые 3 цифры (123)
ZIP: любой (12345)
```

**Тест:**
1. Откройте /premium
2. Нажмите "Оформить Премиум"
3. Введите тестовую карту
4. Complete payment
5. Проверьте что subscription стал "premium"

### Live Mode (реальные деньги!):

⚠️ **ОСТОРОЖНО**: Live mode - реальные платежи!

Убедитесь что:
- ✅ Цены правильные
- ✅ Webhook работает
- ✅ Тестировали на test mode

---

## 💰 PRICING RECOMMENDATION

**Для России:**
- Start: ₽499/месяц
- Alternative: ₽4,990/год (17% скидка)
- Trial: 7 дней бесплатно (опционально)

**Для International:**
- $9.99/month
- $99/year

---

## 🔒 БЕЗОПАСНОСТЬ

**НИКОГДА не делайте:**
- ❌ Не коммитьте secret keys в Git
- ❌ Не храните в frontend коде
- ❌ Не передавайте по незащищённым каналам

**ВСЕГДА делайте:**
- ✅ Используйте environment variables
- ✅ Храните в .env файлах (в .gitignore)
- ✅ Используйте HTTPS
- ✅ Проверяйте webhook signatures

---

## 📊 DASHBOARD MONITORING

После запуска отслеживайте в Stripe Dashboard:

**Payments:**
- Successful charges
- Failed payments
- Refunds

**Subscriptions:**
- Active subscriptions
- Churn rate
- MRR (Monthly Recurring Revenue)

**Customers:**
- Total customers
- Lifetime value
- Payment methods

---

## 🆘 TROUBLESHOOTING

### Проблема: "Invalid API key"

**Решение:**
- Проверьте что используете `sk_live_` (не `sk_test_`)
- Проверьте что ключ скопирован полностью
- Проверьте нет лишних пробелов

### Проблема: "Webhook signature verification failed"

**Решение:**
- Проверьте `STRIPE_WEBHOOK_SECRET`
- Убедитесь что endpoint URL правильный
- Проверьте что используете raw body для webhook

### Проблема: "Price not found"

**Решение:**
- Проверьте `STRIPE_PREMIUM_PRICE_ID`
- Убедитесь что продукт активен в Dashboard
- Проверьте что используете live price ID (не test)

---

## 📋 CHECKLIST

После настройки Stripe:

- [ ] Account activated
- [ ] Product created (Premium)
- [ ] Price ID скопирован
- [ ] Live API keys получены
- [ ] Publishable key добавлен
- [ ] Secret key добавлен
- [ ] Webhook настроен
- [ ] Webhook secret получен
- [ ] .env.production обновлён
- [ ] Frontend .env.production обновлён
- [ ] Test mode протестирован
- [ ] Готов к Live mode

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

После получения ключей:

1. ✅ Обновите .env.production файлы
2. ✅ Запустите `npm run deploy:check`
3. ✅ Все checks должны пройти (18/18)
4. ✅ Готовы к deployment!

**Команды:**
```bash
# Build
npm run build

# Deploy
npm run docker:build
npm run docker:run

# Or Railway
railway up
```

---

## 💡 ПОЛЕЗНЫЕ ССЫЛКИ

- Stripe Dashboard: https://dashboard.stripe.com
- API Docs: https://stripe.com/docs/api
- Webhook Guide: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

---

## ✅ ГОТОВО!

**После выполнения всех шагов у вас будет:**
- ✅ Работающая система платежей
- ✅ Production API ключи
- ✅ Webhook для автоматизации
- ✅ Готовность к приёму денег

**Успешной монетизации! 💰**
