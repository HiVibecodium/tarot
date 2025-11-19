import { useState, useEffect } from 'react'
import './Onboarding.css'

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const steps = [
    {
      title: '🔮 Добро пожаловать!',
      content: 'Таро Помощник Решений поможет вам принимать лучшие решения через мудрость карт Таро.',
      image: '🎴'
    },
    {
      title: '🌅 Расклад Дня',
      content: 'Каждое утро вытягивайте карту дня для получения guidance и вдохновения. Один расклад в день!',
      image: '☀️'
    },
    {
      title: '🎯 Анализ Решений',
      content: 'Столкнулись с выбором? Получите расклад на 3 карты (Прошлое→Настоящее→Будущее) для глубокого анализа.',
      image: '🤔'
    },
    {
      title: '📖 История & Статистика',
      content: 'Все расклады сохраняются. Отслеживайте серии, статистику и смотрите свой прогресс!',
      image: '📊'
    },
    {
      title: '👑 Премиум Подписка',
      content: 'Хотите больше? Премиум даёт неограниченные расклады, все 78 карт и эксклюзивные интерпретации!',
      image: '✨'
    },
    {
      title: '🚀 Готовы начать?',
      content: 'Нажмите "Начать" и вытяните свою первую карту!',
      image: '🎉'
    }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  if (!isVisible) return null

  const currentStep = steps[step]

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-progress">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`progress-dot ${idx === step ? 'active' : ''} ${idx < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-content">
          <div className="onboarding-image">{currentStep.image}</div>
          <h2>{currentStep.title}</h2>
          <p>{currentStep.content}</p>
        </div>

        <div className="onboarding-actions">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary">
              ← Назад
            </button>
          )}

          {step < steps.length - 1 ? (
            <>
              <button onClick={handleSkip} className="btn-skip">
                Пропустить
              </button>
              <button onClick={handleNext} className="btn-primary">
                Далее →
              </button>
            </>
          ) : (
            <button onClick={handleComplete} className="btn-primary btn-complete">
              🚀 Начать использовать!
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding
