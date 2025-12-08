import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalityTest from '../components/PersonalityTest';
import {
  ELEMENT_TEST,
  TAROT_ARCHETYPE_TEST,
  INTUITION_TEST,
  CHAKRA_TEST,
  MBTI_TEST,
  ENERGY_TYPE_TEST,
  SOUL_GIFT_TEST,
  TOTEM_ANIMAL_TEST,
  LIFE_PURPOSE_TEST,
  CRYSTAL_GUARDIAN_TEST,
  LUNAR_NODES_TEST,
  VOCATION_TEST,
  SPIRITUAL_LEVEL_TEST,
  KARMIC_LESSONS_TEST,
  YIN_YANG_TEST
} from '../data/personalityTests';
import './PersonalityTestsPage.css';

// Категории тестов
const CATEGORIES = {
  all: { label: 'Все тесты', icon: '🎯' },
  personality: { label: 'Личность', icon: '🧠' },
  spiritual: { label: 'Духовность', icon: '✨' },
  mystical: { label: 'Мистика', icon: '🔮' },
  energy: { label: 'Энергия', icon: '⚡' }
};

function PersonalityTestsPage() {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const availableTests = [
    {
      data: ELEMENT_TEST,
      available: true,
      category: 'mystical',
      popular: true
    },
    {
      data: TAROT_ARCHETYPE_TEST,
      available: true,
      category: 'mystical',
      popular: true
    },
    {
      data: MBTI_TEST,
      available: true,
      category: 'personality',
      popular: true
    },
    {
      data: CHAKRA_TEST,
      available: true,
      category: 'energy'
    },
    {
      data: INTUITION_TEST,
      available: true,
      category: 'spiritual'
    },
    {
      data: ENERGY_TYPE_TEST,
      available: true,
      category: 'energy'
    },
    {
      data: SOUL_GIFT_TEST,
      available: true,
      category: 'spiritual'
    },
    {
      data: TOTEM_ANIMAL_TEST,
      available: true,
      category: 'mystical'
    },
    {
      data: LIFE_PURPOSE_TEST,
      available: true,
      category: 'spiritual'
    },
    {
      data: CRYSTAL_GUARDIAN_TEST,
      available: true,
      category: 'mystical'
    },
    {
      data: LUNAR_NODES_TEST,
      available: true,
      category: 'spiritual'
    },
    {
      data: VOCATION_TEST,
      available: true,
      category: 'personality'
    },
    {
      data: SPIRITUAL_LEVEL_TEST,
      available: true,
      category: 'spiritual'
    },
    {
      data: KARMIC_LESSONS_TEST,
      available: true,
      category: 'spiritual'
    },
    {
      data: YIN_YANG_TEST,
      available: true,
      category: 'energy'
    }
  ];

  // Фильтрация по категории
  const filteredTests = useMemo(() => {
    if (activeCategory === 'all') return availableTests;
    return availableTests.filter(test => test.category === activeCategory);
  }, [activeCategory]);

  // Подсчет тестов по категориям
  const categoryCounts = useMemo(() => {
    const counts = { all: availableTests.length };
    availableTests.forEach(test => {
      counts[test.category] = (counts[test.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Общее количество вопросов
  const totalQuestions = useMemo(() => {
    return availableTests.reduce((sum, test) => {
      const questions = test.data.questions?.length || 0;
      return sum + questions;
    }, 0);
  }, []);

  const handleTestComplete = (result) => {
    setCompletedTests([...completedTests, result]);
    console.log('Test completed:', result);
  };

  const handleBackToList = () => {
    setSelectedTest(null);
  };

  if (selectedTest) {
    return (
      <div className="tests-page">
        <header className="tests-header">
          <button onClick={handleBackToList} className="btn-back">
            ← К списку тестов
          </button>
          <h1>{selectedTest.title}</h1>
        </header>

        <main className="tests-content">
          <PersonalityTest
            test={selectedTest}
            onComplete={handleTestComplete}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="tests-page">
      <header className="tests-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🧪 Тесты Личности</h1>
      </header>

      <main className="tests-content">
        {/* Hero Section */}
        <div className="tests-intro">
          <h2>Узнайте Себя Лучше</h2>
          <p>Пройдите психологические тесты и получите глубокие инсайты о своей личности, энергии и предназначении</p>

          <div className="tests-stats">
            <div className="stat-item">
              <span className="stat-number">{availableTests.length}</span>
              <span className="stat-label">Тестов</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalQuestions}</span>
              <span className="stat-label">Вопросов</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{completedTests.length}</span>
              <span className="stat-label">Пройдено</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {Object.entries(CATEGORIES).map(([key, { label, icon }]) => (
            <button
              key={key}
              className={`filter-btn ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className="count">{categoryCounts[key] || 0}</span>
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="tests-grid">
          {filteredTests.map((test, idx) => {
            const testData = test.data || test;
            const isAvailable = test.available;
            const isCompleted = completedTests.find(ct => ct.testId === testData.id);

            return (
              <div
                key={idx}
                className={`test-card ${!isAvailable ? 'unavailable' : ''}`}
              >
                {test.popular && <div className="popular-badge">Популярный</div>}
                {!isAvailable && <div className="coming-soon-badge">Скоро</div>}
                <span className={`category-badge ${test.category}`}>
                  {CATEGORIES[test.category]?.label || test.category}
                </span>

                <div className="test-card-header">
                  <div className="test-icon-wrapper">
                    <span className="test-icon">{testData.icon}</span>
                  </div>
                </div>

                <div className="test-card-body">
                  <h3 className="test-title">{testData.title}</h3>
                  <p className="test-description">{testData.description}</p>

                  <div className="test-meta">
                    <span className="meta-pill">
                      <span>⏱️</span> {testData.duration}
                    </span>
                    <span className="meta-pill">
                      <span>❓</span> {testData.questions?.length || 0} вопросов
                    </span>
                  </div>

                  <button
                    onClick={() => isAvailable && setSelectedTest(testData)}
                    disabled={!isAvailable}
                    className="test-start-btn"
                  >
                    {isAvailable ? '🚀 Начать Тест' : 'В разработке'}
                  </button>

                  {isCompleted && (
                    <div className="completed-indicator">
                      ✅ Пройден
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternative Tests Section */}
        <div className="alternative-tests">
          <h3>💡 Также Доступно</h3>
          <div className="alt-tests-grid">
            <div className="alt-test-card">
              <strong>🌟 Натальная Карта</strong>
              <p>Полный астрологический анализ вашей личности по дате рождения</p>
              <button onClick={() => navigate('/natal-chart')} className="btn-primary">
                Открыть
              </button>
            </div>

            <div className="alt-test-card">
              <strong>🔢 Нумерология</strong>
              <p>Узнайте свои числа судьбы, жизненного пути и совместимости</p>
              <button onClick={() => navigate('/numerology')} className="btn-primary">
                Рассчитать
              </button>
            </div>

            <div className="alt-test-card">
              <strong>🎓 Обучение Таро</strong>
              <p>Квиз по Старшим Арканам - проверьте свои знания карт</p>
              <button onClick={() => navigate('/learn')} className="btn-primary">
                Пройти
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonalityTestsPage;
