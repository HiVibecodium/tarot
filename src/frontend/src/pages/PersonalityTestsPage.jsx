import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalityTest from '../components/PersonalityTest';
import { ELEMENT_TEST, TAROT_ARCHETYPE_TEST } from '../data/personalityTests';
import './PersonalityTestsPage.css';

function PersonalityTestsPage() {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);

  const availableTests = [
    {
      data: ELEMENT_TEST,
      available: true
    },
    {
      data: TAROT_ARCHETYPE_TEST,
      available: true
    },
    {
      id: 'intuition-level',
      title: 'Уровень Интуиции',
      icon: '🔮',
      description: 'Насколько развита ваша интуиция? Проверьте свои экстрасенсорные способности',
      duration: '10 мин',
      questions: 30,
      available: false
    },
    {
      id: 'chakra-balance',
      title: 'Баланс Чакр',
      icon: '🌈',
      description: 'Узнайте какие чакры у вас активны, а какие нуждаются в гармонизации',
      duration: '8 мин',
      questions: 21,
      available: false
    }
  ];

  const handleTestComplete = (result) => {
    setCompletedTests([...completedTests, result]);
    // Можно сохранить на сервер
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
        <div className="tests-intro">
          <h2>Узнайте Себя Лучше</h2>
          <p>Пройдите тесты и получите глубокие инсайты о своей личности</p>
        </div>

        <div className="tests-grid">
          {availableTests.map((test, idx) => {
            const testData = test.data || test;
            const isAvailable = test.available;

            return (
              <div
                key={idx}
                className={`test-card ${!isAvailable ? 'unavailable' : ''}`}
              >
                {!isAvailable && (
                  <div className="coming-soon-badge">Скоро</div>
                )}

                <div className="test-icon">{testData.icon}</div>
                <h3 className="test-title">{testData.title}</h3>
                <p className="test-description">{testData.description}</p>

                <div className="test-meta">
                  <span>⏱️ {testData.duration}</span>
                  <span>•</span>
                  <span>❓ {testData.questions?.length || testData.questions} вопросов</span>
                </div>

                <button
                  onClick={() => isAvailable && setSelectedTest(testData)}
                  disabled={!isAvailable}
                  className="test-start-btn"
                >
                  {isAvailable ? 'Начать Тест' : 'В разработке'}
                </button>

                {completedTests.find(ct => ct.testId === testData.id) && (
                  <div className="completed-indicator">
                    ✅ Пройден
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="alternative-tests">
          <h3>💡 Также Доступно:</h3>
          <div className="alt-tests-grid">
            <div className="alt-test-card">
              <strong>🌟 Натальная Карта</strong>
              <p>Полный астрологический анализ личности</p>
              <button onClick={() => navigate('/natal-chart')} className="btn-primary">
                Открыть
              </button>
            </div>

            <div className="alt-test-card">
              <strong>🔢 Нумерология</strong>
              <p>Узнайте свои числа судьбы</p>
              <button onClick={() => navigate('/numerology')} className="btn-primary">
                Рассчитать
              </button>
            </div>

            <div className="alt-test-card">
              <strong>🎓 Обучение Таро</strong>
              <p>Квиз по Старшим Арканам</p>
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
