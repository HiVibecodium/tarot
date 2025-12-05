/**
 * Скрипт валидации тестов личности
 * Проверяет структуру данных, наличие ошибок и несоответствий
 */

const fs = require('fs');
const path = require('path');

// Динамический импорт через eval (для CommonJS)
const testsPath = path.join(__dirname, 'src', 'frontend', 'src', 'data', 'personalityTests.js');
const testsContent = fs.readFileSync(testsPath, 'utf8');

// Извлекаем экспорты с помощью regex
const testPattern = /export const (\w+_TEST) = ({[\s\S]*?^});$/gm;
const tests = [];
let match;

while ((match = testPattern.exec(testsContent)) !== null) {
  const testName = match[1];
  const testCode = match[2];

  try {
    // Создаем функцию для eval с контекстом
    const testObj = eval('(' + testCode + ')');
    tests.push({ name: testName, data: testObj });
  } catch (e) {
    console.error(`❌ Ошибка парсинга ${testName}:`, e.message);
  }
}

console.log(`\n🔍 ВАЛИДАЦИЯ ${tests.length} ТЕСТОВ\n`);
console.log('='.repeat(80));

const errors = [];
const warnings = [];

tests.forEach(({ name, data }, index) => {
  console.log(`\n${index + 1}. Проверяю ${name}...`);

  // 1. Проверка обязательных полей
  const requiredFields = ['id', 'title', 'icon', 'description', 'duration', 'questions', 'results'];
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${name}: Отсутствует поле "${field}"`);
    }
  });

  if (!data.questions || !data.results) {
    console.log('  ⚠️  Пропущен (критические поля отсутствуют)');
    return;
  }

  // 2. Проверка вопросов
  const questionsCount = data.questions.length;
  console.log(`  ✓ Вопросов: ${questionsCount}`);

  if (questionsCount === 0) {
    errors.push(`${name}: Нет вопросов!`);
  }

  // 3. Проверка структуры вопросов
  const categoriesInQuestions = new Set();
  data.questions.forEach((q, qIdx) => {
    if (!q.id || !q.text) {
      errors.push(`${name}: Вопрос #${qIdx + 1} не имеет id или text`);
    }

    if (!q.options || q.options.length === 0) {
      errors.push(`${name}: Вопрос #${qIdx + 1} не имеет опций`);
      return;
    }

    // Проверка опций
    q.options.forEach((opt, optIdx) => {
      if (!opt.text) {
        errors.push(`${name}: Вопрос #${qIdx + 1}, опция #${optIdx + 1} не имеет text`);
      }

      if (opt.points === undefined) {
        errors.push(`${name}: Вопрос #${qIdx + 1}, опция #${optIdx + 1} не имеет points`);
      }

      // Найти ключ категории (element, archetype, level и т.д.)
      const categoryKey = Object.keys(opt).find(k => k !== 'text' && k !== 'points');
      if (categoryKey) {
        categoriesInQuestions.add(opt[categoryKey]);
      } else {
        // Проверить, есть ли категория на уровне вопроса
        const qCategoryKey = Object.keys(q).find(k =>
          k !== 'id' && k !== 'text' && k !== 'options'
        );
        if (qCategoryKey) {
          categoriesInQuestions.add(q[qCategoryKey]);
        } else {
          errors.push(`${name}: Вопрос #${qIdx + 1}, опция #${optIdx + 1} не имеет категории`);
        }
      }
    });
  });

  console.log(`  ✓ Категорий в вопросах: ${categoriesInQuestions.size}`);

  // 4. Проверка results
  const resultsCount = Object.keys(data.results).length;
  console.log(`  ✓ Результатов: ${resultsCount}`);

  if (resultsCount === 0) {
    errors.push(`${name}: Нет результатов!`);
  }

  // 5. Проверка соответствия категорий
  const categoriesInResults = new Set(Object.keys(data.results));

  // Проверяем, что все категории из вопросов есть в results
  categoriesInQuestions.forEach(cat => {
    if (!categoriesInResults.has(cat)) {
      errors.push(`${name}: Категория "${cat}" из вопросов отсутствует в results`);
    }
  });

  // Предупреждения о лишних результатах
  categoriesInResults.forEach(cat => {
    if (!categoriesInQuestions.has(cat)) {
      warnings.push(`${name}: Результат "${cat}" не используется в вопросах`);
    }
  });

  // 6. Проверка структуры результатов
  Object.entries(data.results).forEach(([key, result]) => {
    const requiredResultFields = ['title', 'emoji', 'description', 'advice'];
    requiredResultFields.forEach(field => {
      if (!result[field]) {
        warnings.push(`${name}: Результат "${key}" не имеет поля "${field}"`);
      }
    });
  });

  console.log(`  ✅ Базовая структура корректна`);
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОШЛИ ВАЛИДАЦИЮ!');
  console.log(`   Проверено: ${tests.length} тестов`);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ОШИБКИ (${errors.length}):\n`);
    errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err}`);
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ПРЕДУПРЕЖДЕНИЯ (${warnings.length}):\n`);
    warnings.forEach((warn, idx) => {
      console.log(`  ${idx + 1}. ${warn}`);
    });
  }
}

console.log('\n' + '='.repeat(80) + '\n');

// Возвращаем код ошибки для CI/CD
process.exit(errors.length > 0 ? 1 : 0);
