import { useState } from 'react';
import './PersonalityTest.css';

const PersonalityTest = ({ test, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
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
      const scores = {};

      finalAnswers.forEach(answer => {
        const key = answer.element || answer.archetype;
        if (!scores[key]) {
          scores[key] = 0;
        }
        scores[key] += answer.points;
      });

      const maxScore = Math.max(...Object.values(scores));
      const dominant = Object.keys(scores).find(key => scores[key] === maxScore);
      const percentage = Math.round((maxScore / (test.questions.length * 3)) * 100);

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
    return (
      <div className="test-result">
        <div className="result-header">
          <div className="result-icon">{result.details.emoji || '✨'}</div>
          <h2 className="result-title">{result.details.title || 'Результат'}</h2>
          <div className="result-percentage">{result.percentage}% совпадение</div>
        </div>

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
            <strong>⭐ Знаки Зодиака:</strong>
            <p>{result.details.zodiacSigns.join(', ')}</p>
          </div>
        )}

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
