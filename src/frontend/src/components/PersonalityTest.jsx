import { useState } from 'react';
import './PersonalityTest.css';

const PersonalityTest = ({ test, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (option) => {
    const question = test.questions[currentQuestion];

    // Создаем ответ, добавляя категорию из вопроса, если её нет в опции
    const answer = { ...option };

    // Если опция не содержит категорию, берем её из вопроса
    const categoryKey = Object.keys(option).find(k => k !== 'text' && k !== 'points');
    if (!categoryKey) {
      // Ищем ключ категории в вопросе (chakra, element и т.д.)
      const questionCategoryKey = Object.keys(question).find(k =>
        k !== 'id' && k !== 'text' && k !== 'options'
      );
      if (questionCategoryKey) {
        answer[questionCategoryKey] = question[questionCategoryKey];
      }
    }

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Тест завершён - рассчитываем результат
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    try {
      // Проверяем, является ли это многомерным тестом (например, MBTI)
      const isMultiDimensional = test.questions.some(q => q.dimension);

      if (isMultiDimensional) {
        // Специальная логика для многомерных тестов (MBTI)
        const dimensionScores = {};

        finalAnswers.forEach((answer, index) => {
          const question = test.questions[index];
          const dimension = question.dimension;

          if (!dimensionScores[dimension]) {
            dimensionScores[dimension] = {};
          }

          const type = answer.type;
          if (!dimensionScores[dimension][type]) {
            dimensionScores[dimension][type] = 0;
          }
          dimensionScores[dimension][type] += answer.points;
        });

        // Определяем доминирующую букву в каждом измерении
        let personalityType = '';
        Object.keys(dimensionScores).sort().forEach(dimension => {
          const types = dimensionScores[dimension];
          const maxScore = Math.max(...Object.values(types));
          const dominant = Object.keys(types).find(key => types[key] === maxScore);
          personalityType += dominant;
        });

        const resultDetails = test.results?.[personalityType];

        if (!resultDetails) {
          console.error('Result not found for:', personalityType, 'Available results:', Object.keys(test.results || {}));
          alert('Ошибка при расчёте результата. Попробуйте пройти тест снова.');
          return;
        }

        setResult({
          dominant: personalityType,
          scores: dimensionScores,
          percentage: 100,
          details: resultDetails
        });

        setShowResult(true);

        if (onComplete) {
          onComplete({
            testId: test.id,
            result: personalityType,
            scores: dimensionScores,
            percentage: 100,
            completedAt: new Date().toISOString()
          });
        }

        return;
      }

      // Стандартная логика для одномерных тестов
      const scores = {};

      finalAnswers.forEach(answer => {
        // Динамически находим ключ категории (исключая text и points)
        const categoryKey = Object.keys(answer).find(k => k !== 'text' && k !== 'points');
        const key = answer[categoryKey];

        if (!key) {
          console.error('No category key found in answer:', answer);
          return;
        }

        if (!scores[key]) {
          scores[key] = 0;
        }
        scores[key] += answer.points;
      });

      const maxScore = Math.max(...Object.values(scores));
      const dominant = Object.keys(scores).find(key => scores[key] === maxScore);

      // Вычисляем реальный максимум баллов для теста
      const totalMaxPoints = finalAnswers.reduce((sum, answer) => sum + answer.points, 0);
      const percentage = Math.round((maxScore / totalMaxPoints) * 100);

      // Проверяем что результат существует
      const resultDetails = test.results?.[dominant];

      if (!resultDetails) {
        console.error('Result not found for:', dominant, 'Available results:', Object.keys(test.results || {}));
        alert('Ошибка при расчёте результата. Попробуйте пройти тест снова.');
        return;
      }

      setResult({
        dominant,
        scores,
        percentage,
        details: resultDetails
      });

      setShowResult(true);

      if (onComplete) {
        onComplete({
          testId: test.id,
          result: dominant,
          scores,
          percentage,
          completedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Calculate result error:', error);
      alert('Произошла ошибка при обработке результатов: ' + error.message);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  if (showResult && result && result.details) {
    // Определяем класс для цвета хедера по элементу/типу
    const elementClass = result.dominant ? `element-${result.dominant.toLowerCase()}` : '';

    return (
      <div className={`test-result ${elementClass}`}>
        <div className={`result-header ${elementClass}`}>
          <div className="result-icon">{result.details.emoji || '✨'}</div>
          <h2 className="result-title">{result.details.title || 'Результат'}</h2>
          <div className="result-percentage">{result.percentage}% совпадение</div>
        </div>

        <div className="result-body">
        <p className="result-description">{result.details.description}</p>
        {result.details.meaning && (
          <p className="result-meaning">{result.details.meaning}</p>
        )}

        {result.details.strengths && result.details.strengths.length > 0 && (
          <div className="result-section">
            <h3>✨ Сильные Стороны:</h3>
            <ul className="result-list">
              {result.details.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {result.details.traits && result.details.traits.length > 0 && (
          <div className="result-section">
            <h3>🎯 Черты Характера:</h3>
            <ul className="result-list">
              {result.details.traits.map((trait, idx) => (
                <li key={idx}>{trait}</li>
              ))}
            </ul>
          </div>
        )}

        {result.details.challenges && result.details.challenges.length > 0 && (
          <div className="result-section">
            <h3>⚠️ Вызовы:</h3>
            <ul className="result-list challenges">
              {result.details.challenges.map((challenge, idx) => (
                <li key={idx}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="result-advice">
          <strong>💡 Совет:</strong>
          <p>{result.details.advice}</p>
        </div>

        {result.details.tarotCards && (
          <div className="result-cards">
            <strong>🎴 Связанные карты Таро:</strong>
            <p>{result.details.tarotCards.join(', ')}</p>
          </div>
        )}

        {result.details.zodiacSigns && (
          <div className="result-zodiac">
            <strong>⭐ Знаки вашей стихии:</strong>
            <p className="zodiac-hint">Эти знаки Зодиака разделяют вашу энергию:</p>
            <p className="zodiac-signs">{result.details.zodiacSigns.join(', ')}</p>
          </div>
        )}

        {result.details.compatibility && (
          <div className="result-section result-compatibility">
            <h3>💕 Совместимость с Элементами:</h3>
            <div className="compatibility-grid">
              <div className="compat-item best">
                <span className="compat-label">Лучшая:</span>
                <span className="compat-value">{result.details.compatibility.best}</span>
              </div>
              <div className="compat-item good">
                <span className="compat-label">Хорошая:</span>
                <span className="compat-value">{result.details.compatibility.good}</span>
              </div>
              <div className="compat-item challenging">
                <span className="compat-label">Сложная:</span>
                <span className="compat-value">{result.details.compatibility.challenging}</span>
              </div>
              <div className="compat-item growth">
                <span className="compat-label">Для роста:</span>
                <span className="compat-value">{result.details.compatibility.growth}</span>
              </div>
            </div>
          </div>
        )}

        {result.details.crystals && (
          <div className="result-crystals">
            <strong>💎 Ваши Камни:</strong>
            <p>{result.details.crystals.join(', ')}</p>
          </div>
        )}

        {result.details.colors && (
          <div className="result-colors">
            <strong>🎨 Ваши Цвета:</strong>
            <p>{result.details.colors.join(', ')}</p>
          </div>
        )}

        {(result.details.season || result.details.direction || result.details.bodyParts) && (
          <div className="result-nature">
            {result.details.season && (
              <div className="nature-item">
                <strong>🌿 Ваш сезон силы:</strong> {result.details.season}
              </div>
            )}
            {result.details.direction && (
              <div className="nature-item">
                <strong>🧭 Направление:</strong> {result.details.direction}
              </div>
            )}
            {result.details.bodyParts && (
              <div className="nature-item">
                <strong>🫀 Части тела:</strong> {result.details.bodyParts}
              </div>
            )}
          </div>
        )}

        {result.details.famousPeople && (
          <div className="result-famous">
            <strong>🌟 Знаменитости вашего типа:</strong>
            <p>{result.details.famousPeople.join(', ')}</p>
          </div>
        )}

        {result.details.practices && result.details.practices.length > 0 && (
          <div className="result-section result-practices">
            <h3>🧘 Практики для вашей стихии:</h3>
            <ul className="result-list practices-list">
              {result.details.practices.map((practice, idx) => (
                <li key={idx}>{practice}</li>
              ))}
            </ul>
          </div>
        )}

        {result.details.bestTime && (
          <div className="result-best-time">
            <strong>⏰ Лучшее время:</strong>
            <p>{result.details.bestTime}</p>
          </div>
        )}

        {result.details.affirmation && (
          <div className="result-affirmation">
            <strong>🔮 Ваша Аффирмация:</strong>
            <p className="affirmation-text">"{result.details.affirmation}"</p>
          </div>
        )}
        </div>

        <div className="result-actions">
          <button onClick={restartTest} className="btn-restart">
            Пройти ещё раз
          </button>
        </div>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  return (
    <div className="personality-test">
      <div className="test-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">
          Вопрос {currentQuestion + 1} из {test.questions.length}
        </span>
      </div>

      <div className="question-card">
        <h3 className="question-text">{question.text}</h3>

        <div className="options-list">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="option-button"
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {currentQuestion > 0 && (
        <button
          onClick={() => {
            setCurrentQuestion(currentQuestion - 1);
            setAnswers(answers.slice(0, -1));
          }}
          className="btn-back-question"
        >
          ← Назад
        </button>
      )}
    </div>
  );
};

export default PersonalityTest;
