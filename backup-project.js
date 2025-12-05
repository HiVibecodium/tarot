/**
 * Скрипт создания резервной копии проекта
 * Сохраняет все изменённые файлы и важные данные
 */

const fs = require('fs');
const path = require('path');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = path.join(__dirname, 'backups', `backup_${timestamp}`);

console.log('🔄 Создание резервной копии проекта...\n');
console.log(`📁 Директория: ${backupDir}\n`);

// Создаём директории
const dirs = [
  backupDir,
  path.join(backupDir, 'src/frontend/src/data'),
  path.join(backupDir, 'src/frontend/src/components'),
  path.join(backupDir, 'src/frontend/src/pages'),
  path.join(backupDir, 'scripts')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Список файлов для бэкапа
const filesToBackup = [
  // Изменённые данные тестов
  {
    src: 'src/frontend/src/data/personalityTests.js',
    desc: 'Данные всех 15 тестов личности (3,269 строк)'
  },

  // Изменённые компоненты
  {
    src: 'src/frontend/src/components/PersonalityTest.jsx',
    desc: 'Компонент теста с поддержкой многомерных тестов'
  },
  {
    src: 'src/frontend/src/components/SpreadEngine.jsx',
    desc: 'Движок раскладов Таро с SVG градиентами и анимациями'
  },
  {
    src: 'src/frontend/src/components/SpreadEngine.css',
    desc: 'Стили расклада с магическим полем, звёздами и эффектами'
  },

  // Изменённые страницы
  {
    src: 'src/frontend/src/pages/PersonalityTestsPage.jsx',
    desc: 'Страница списка тестов'
  },
  {
    src: 'src/frontend/src/pages/CompatibilityPage.jsx',
    desc: 'Страница совместимости (исправлен заголовок нумерологии)'
  },
  {
    src: 'src/frontend/src/pages/CompatibilityPage.css',
    desc: 'Стили страницы совместимости'
  },
  {
    src: 'src/frontend/src/pages/CelticCrossPage.css',
    desc: 'Стили страницы Кельтский Крест с улучшенными градиентами'
  },

  // Валидатор
  {
    src: 'validate-tests.js',
    desc: 'Скрипт валидации тестов'
  },

  // Конфигурации
  {
    src: 'package.json',
    desc: 'Конфигурация проекта'
  }
];

let successCount = 0;
let failCount = 0;

console.log('📦 Копирование файлов:\n');

filesToBackup.forEach(({ src, desc }) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(backupDir, src);

  try {
    if (fs.existsSync(srcPath)) {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ ${src}`);
      console.log(`   ${desc}`);
      successCount++;
    } else {
      console.log(`⚠️  ${src} - файл не найден`);
      failCount++;
    }
  } catch (error) {
    console.log(`❌ ${src} - ошибка: ${error.message}`);
    failCount++;
  }
  console.log('');
});

// Создаём файл с информацией о бэкапе
const backupInfo = {
  timestamp: new Date().toISOString(),
  description: 'Резервная копия после полной переработки дизайна расклада Кельтский Крест',
  changes: [
    'Полностью переработан дизайн SpreadEngine с магическим тёмным полем',
    'Добавлено звёздное небо с анимацией мерцания (7 звёзд)',
    'Добавлены магические вращающиеся круги с пульсацией',
    'Создана эпичная анимация рисования карт (720° вращение)',
    'Добавлен 3D переворот карт с perspective эффектом',
    'Реализованы SVG градиенты с SMIL анимацией',
    'Улучшены стили CelticCrossPage с градиентами и тенями',
    'Добавлены multi-layer drop-shadows и glow эффекты',
    'Исправлена проблема с обрезкой текста в списке позиций',
    'Оптимизирован layout для отображения всех 10 карт'
  ],
  statistics: {
    totalFiles: filesToBackup.length,
    filesBackedUp: successCount,
    filesFailed: failCount,
    features: [
      'Звёздное небо',
      'Магические круги',
      '3D анимации',
      'SVG градиенты',
      'Glow эффекты'
    ]
  }
};

fs.writeFileSync(
  path.join(backupDir, 'BACKUP_INFO.json'),
  JSON.stringify(backupInfo, null, 2)
);

// Создаём README для бэкапа
const readmeContent = `# Резервная копия проекта AI Tarot Decision Assistant

**Дата создания**: ${new Date().toLocaleString('ru-RU')}

## 📝 Описание

Резервная копия после полной проверки и исправления всех тестов личности.

## 🔧 Изменения

${backupInfo.changes.map(c => `- ${c}`).join('\n')}

## 📊 Статистика

- **Всего тестов**: ${backupInfo.statistics.totalTests}
- **Строк кода**: ${backupInfo.statistics.linesOfCode}
- **Файлов в бэкапе**: ${backupInfo.statistics.filesBackedUp}

## 📂 Состав бэкапа

${filesToBackup.map(f => `- \`${f.src}\` - ${f.desc}`).join('\n')}

## 🔄 Восстановление

Для восстановления скопируйте файлы из этой директории обратно в проект:

\`\`\`bash
# Восстановить все файлы
cp -r backup_${timestamp}/* ../
\`\`\`

Или восстановите отдельные файлы по необходимости.
`;

fs.writeFileSync(
  path.join(backupDir, 'README.md'),
  readmeContent
);

console.log('='.repeat(70));
console.log('\n✅ Резервная копия создана успешно!\n');
console.log(`📁 Локация: ${backupDir}\n`);
console.log(`📊 Статистика:`);
console.log(`   - Успешно скопировано: ${successCount} файлов`);
if (failCount > 0) {
  console.log(`   - Ошибки: ${failCount} файлов`);
}
console.log(`\n💾 Создано:`);
console.log(`   - BACKUP_INFO.json`);
console.log(`   - README.md`);
console.log('\n' + '='.repeat(70) + '\n');
