import { useState } from 'react';
import './GuidedInterpretation.css';

const GUIDED_STEPS = [
  {
    id: 'observe',
    title: '👁️ Наблюдайте',
    question: 'Что вы видите на карте?',
    hint: 'Обратите внимание на символы, цвета, персонажей. Что первым бросается в глаза?'
  },
  {
    id: 'feel',
    title: '💭 Чувствуйте',
    question: 'Какие эмоции вызывает карта?',
    hint: 'Спокойствие, тревогу, радость? Доверьтесь первому впечатлению.'
  },
  {
    id: 'keywords',
    title: '🔑 Ключевые слова',
    question: 'Посмотрите на ключевые слова карты',
    hint: 'Какое слово больше всего резонирует с вашей ситуацией?'
  },
  {
    id: 'situation',
    title: '🎯 Ваша ситуация',
    question: 'Как карта связана с вашим вопросом?',
    hint: 'Найдите параллели между значением карты и вашей ситуацией.'
  },
  {
    id: 'action',
    title: '⚡ Действие',
    question: 'Что карта советует сделать?',
    hint: 'Какой шаг вы можете предпринять прямо сейчас?'
  }
];

function GuidedInterpretation({ card, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const step = GUIDED_STEPS[currentStep];

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [step.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < GUIDED_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserAnswers({});
    setShowSummary(false);
  };

  if (showSummary) {
    return (
      <div className="guided-interpretation">
        <div className="guided-header">
          <h3>✨ Ваша интерпретация готова!</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="guided-summary">
          <div className="summary-card">
            <h4>{card.name}</h4>
            {card.keywords && (
              <p className="card-keywords">
                {card.keywords.upright?.join(', ')}
              </p>
            )}
          </div>

          <div className="user-insights">
            <h4>📝 Ваши инсайты:</h4>
            {GUIDED_STEPS.map(s => (
              userAnswers[s.id] && (
                <div key={s.id} className="insight-item">
                  <strong>{s.title}:</strong>
                  <p>{userAnswers[s.id]}</p>
                </div>
              )
            ))}
          </div>

          <div className="summary-actions">
            <button className="restart-guided-btn" onClick={handleRestart}>
              🔄 Пройти снова
            </button>
            <button className="close-guided-btn" onClick={onClose}>
              ✓ Завершить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guided-interpretation">
      <div className="guided-header">
        <h3>🧭 Руководство по интерпретации</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {/* Progress */}
      <div className="guided-progress">
        <div className="step-dots">
          {GUIDED_STEPS.map((s, index) => (
            <div
              key={s.id}
              className={`step-dot ${index === currentStep ? 'active' : ''} ${
                index < currentStep ? 'completed' : ''
              }`}
            />
          ))}
        </div>
        <p className="step-counter">
          Шаг {currentStep + 1} из {GUIDED_STEPS.length}
        </p>
      </div>

      {/* Current Step */}
      <div className="guided-step">
        <h4 className="step-title">{step.title}</h4>
        <p className="step-question">{step.question}</p>
        <p className="step-hint">💡 {step.hint}</p>

        {/* Show card info for keywords step */}
        {step.id === 'keywords' && card.keywords && (
          <div className="card-keywords-display">
            <div className="keywords-upright">
              <strong>Прямое положение:</strong>
              <div className="keywords-list">
                {card.keywords.upright?.map((kw, i) => (
                  <span key={i} className="keyword-tag">{kw}</span>
                ))}
              </div>
            </div>
            {card.keywords.reversed && (
              <div className="keywords-reversed">
                <strong>Перевёрнутое положение:</strong>
                <div className="keywords-list">
                  {card.keywords.reversed?.map((kw, i) => (
                    <span key={i} className="keyword-tag reversed">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <textarea
          className="step-input"
          value={userAnswers[step.id] || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          placeholder="Напишите ваши мысли..."
          rows="4"
        />
      </div>

      {/* Navigation */}
      <div className="guided-actions">
        <button
          className="prev-btn"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          ← Назад
        </button>

        <button
          className="skip-btn"
          onClick={onClose}
        >
          Пропустить руководство
        </button>

        <button
          className="next-btn"
          onClick={handleNext}
        >
          {currentStep === GUIDED_STEPS.length - 1 ? 'Завершить' : 'Далее →'}
        </button>
      </div>
    </div>
  );
}

export default GuidedInterpretation;
