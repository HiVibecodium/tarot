# 🔧 FIX: Данные пользователей исчезают после перезапуска

## 🚨 ПРОБЛЕМА
После каждого перезапуска Render контейнера **все пользовательские данные теряются**, потому что:
- JSON файлы хранятся внутри контейнера
- При рестарте создается новый контейнер
- Старые данные удаляются

## ✅ РЕШЕНИЕ
Добавлен **Persistent Disk** в Render для сохранения данных между перезапусками.

---

## 📋 ЧТО ИЗМЕНЕНО

### 1. `src/backend/db/json-store.js`
Добавлена поддержка environment variable `DATA_DIR`:
```javascript
constructor(dbPath = process.env.DATA_DIR || path.join(__dirname, 'data'))
```

### 2. `render.yaml`
Добавлен persistent disk:
```yaml
disk:
  name: tarot-data
  mountPath: /data
  sizeGB: 1

envVars:
  - key: DATA_DIR
    value: /data
```

### 3. `Dockerfile`
Обновлена переменная окружения:
```dockerfile
ENV DATA_DIR=/data
```

### 4. `src/backend/index-json.js`
Добавлена автоматическая инициализация карт при первом запуске:
```javascript
// Seed cards if database is empty
const cardCount = await Card.count();
if (cardCount === 0) {
  console.log('📦 Database is empty, seeding cards...');
  await seedCards();
}
```

---

## 🚀 КАК ЗАДЕПЛОИТЬ ФИX

### Вариант 1: Через Git (РЕКОМЕНДУЕТСЯ)

```bash
# Закоммитить изменения
git add .
git commit -m "fix: Add persistent disk for user data storage

- Add DATA_DIR environment variable support
- Configure Render persistent disk
- Auto-seed cards on first startup
- Prevent data loss on container restart"

# Запушить в ваш репозиторий
git push origin main
```

Render автоматически задеплоит изменения.

### Вариант 2: Через Render Dashboard

1. Зайдите в Render Dashboard
2. Перейдите в ваш сервис `tarot-assistant`
3. Settings → Disks → Add Disk
   - Name: `tarot-data`
   - Mount Path: `/data`
   - Size: 1 GB
4. Settings → Environment → Add Variable
   - Key: `DATA_DIR`
   - Value: `/data`
5. Manual Deploy → Deploy latest commit

---

## ⚠️ ВАЖНО: Миграция существующих данных

### Если у вас уже есть пользователи в базе

**ПРОБЛЕМА**: При включении persistent disk Render создаст новый пустой диск.

**РЕШЕНИЕ**:

#### Опция A: Начать с чистой базы (ПРОСТОЙ СПОСОБ)
Просто задеплойте - система автоматически создаст карты. Пользователи заново зарегистрируются.

#### Опция Б: Сохранить существующих пользователей (СЛОЖНЫЙ СПОСОБ)

1. **Экспортируйте данные ПЕРЕД обновлением**:

Создайте API endpoint для экспорта (временный):
```javascript
// В src/backend/index-json.js - ТОЛЬКО ДЛЯ МИГРАЦИИ!
app.get('/admin/export-data', async (req, res) => {
  const users = await db.find('users');
  const readings = await db.find('readings');
  res.json({ users, readings });
});
```

Вызовите:
```bash
curl https://tarot-a2oi.onrender.com/admin/export-data > backup.json
```

2. **Задеплойте новую версию с persistent disk**

3. **Импортируйте данные обратно**:

Создайте API endpoint для импорта:
```javascript
// ТОЛЬКО ДЛЯ МИГРАЦИИ!
app.post('/admin/import-data', async (req, res) => {
  const { users, readings } = req.body;

  for (const user of users) {
    await db.insertOne('users', user);
  }

  for (const reading of readings) {
    await db.insertOne('readings', reading);
  }

  res.json({ success: true, imported: { users: users.length, readings: readings.length } });
});
```

Вызовите:
```bash
curl -X POST https://tarot-a2oi.onrender.com/admin/import-data \
  -H "Content-Type: application/json" \
  -d @backup.json
```

4. **УДАЛИТЕ эти endpoints после миграции!**

---

## 🧪 ПРОВЕРКА

После деплоя проверьте:

### 1. Persistent Disk подключен
```bash
curl https://tarot-a2oi.onrender.com/health
# Проверьте логи Render - должно быть:
# 📁 Storage: /data
```

### 2. Карты загружены
```bash
curl https://tarot-a2oi.onrender.com/api/cards | jq '.data.cards | length'
# Должно быть: 78
```

### 3. Регистрация работает
1. Зарегистрируйте тестового пользователя
2. Залогиньтесь
3. Вытяните карту дня
4. **Рестартните сервис в Render Dashboard**
5. Попробуйте снова залогиниться с теми же credentials
6. ✅ Если логин успешен - данные сохраняются!

---

## 📊 МОНИТОРИНГ ИСПОЛЬЗОВАНИЯ ДИСКА

Создайте endpoint для мониторинга (опционально):

```javascript
// src/backend/routes/admin.routes.js
router.get('/disk-usage', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const { promisify } = require('util');
  const exec = promisify(require('child_process').exec);

  try {
    const { stdout } = await exec(`du -sh ${process.env.DATA_DIR || './data'}`);
    res.json({
      success: true,
      usage: stdout.trim(),
      dataDir: process.env.DATA_DIR || './data'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🎯 РЕЗУЛЬТАТ

После применения фикса:
- ✅ Данные пользователей **сохраняются** при рестарте
- ✅ Карты **автоматически загружаются** при первом запуске
- ✅ Readings **не теряются**
- ✅ Persistent storage **до 1GB бесплатно** на Render

---

## 💡 АЛЬТЕРНАТИВА: Переход на MongoDB

Для production рекомендуется использовать полноценную БД:

### MongoDB Atlas (FREE TIER)
```bash
# render.yaml
envVars:
  - key: MONGODB_URI
    value: mongodb+srv://user:pass@cluster.mongodb.net/tarot
```

Код уже поддерживает MongoDB - просто раскомментируйте в `src/backend/index.js`

---

## 📝 CHECKLIST ПЕРЕД DEPLOYMENT

- [ ] Закоммичены все изменения
- [ ] Обновлен render.yaml с persistent disk
- [ ] DATA_DIR установлен в /data
- [ ] Протестировано локально с DATA_DIR=/tmp/test-data
- [ ] Сделан backup существующих пользователей (если нужно)
- [ ] Запушено в Git
- [ ] Дождались автодеплоя на Render
- [ ] Проверили /health endpoint
- [ ] Протестировали регистрацию
- [ ] Протестировали рестарт сервиса

---

## 🆘 TROUBLESHOOTING

### Диск не монтируется
Проверьте логи Render:
```
ERROR: Failed to mount disk
```
**Решение**: Убедитесь что free plan поддерживает persistent disks

### Данные все равно теряются
```bash
# Проверьте где сохраняются файлы
curl https://your-app.onrender.com/health

# В ответе должно быть:
# "storage": "/data"  (не /app/src/backend/db/data)
```

### Cards не загружаются
Проверьте логи при старте:
```
📦 Database is empty, seeding cards...
✅ Cards seeded successfully
```

Если ошибка - проверьте `src/backend/scripts/seed-cards.js`

---

**После применения фикса ваши пользователи больше не будут исчезать!** 🎉
