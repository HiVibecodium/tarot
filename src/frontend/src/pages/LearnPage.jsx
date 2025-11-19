import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LearnPage.css'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Какая карта символизирует новые начинания и спонтанность?',
    options: ['Шут', 'Маг', 'Императрица', 'Колесница'],
    correct: 0,
    explanation: 'Шут (0) - карта новых начинаний, свободы и спонтанности'
  },
  {
    id: 2,
    question: 'Какая карта связана с интуицией и внутренним голосом?',
    options: ['Императрица', 'Верховная Жрица', 'Луна', 'Звезда'],
    correct: 1,
    explanation: 'Верховная Жрица (II) - карта интуиции и подсознания'
  },
  {
    id: 3,
    question: 'Какая карта символизирует трансформацию и перемены?',
    options: ['Башня', 'Смерть', 'Колесо Фортуны', 'Повешенный'],
    correct: 1,
    explanation: 'Смерть (XIII) - карта трансформации и завершения циклов'
  },
  // Add more questions...
]

function LearnPage() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = QUIZ_QUESTIONS[currentQuestion]

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === question.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizComplete(false)
  }

  if (quizComplete) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)

    return (
      <div className="learn-page">
        <header className="reading-header">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Назад
          </button>
          <h1>📚 Обучение Таро</h1>
        </header>

        <main className="learn-content">
          <div className="quiz-result">
            <div className="result-icon">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📖'}
            </div>
            <h2>Квиз завершён!</h2>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="score-percentage">{percentage}%</div>

            <div className="result-message">
              {percentage >= 80 && <p>🏆 Отличный результат! Вы настоящий эксперт Таро!</p>}
              {percentage >= 60 && percentage < 80 && <p>👏 Хороший результат! Продолжайте изучать!</p>}
              {percentage < 60 && <p>📚 Попробуйте ещё раз, чтобы узнать больше о картах!</p>}
            </div>

            <div className="result-actions">
              <button onClick={handleRestart} className="btn-primary">
                🔄 Пройти Снова
              </button>
              <button onClick={() => navigate('/cards')} className="btn-secondary">
                📖 Изучить Карты
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="learn-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>📚 Обучение Таро - Квиз</h1>
      </header>

      <main className="learn-content">
        <div className="quiz-progress">
          <div className="progress-text">
            Вопрос {currentQuestion + 1} из {QUIZ_QUESTIONS.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiz-question">
          <h2>{question.question}</h2>

          <div className="quiz-options">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`quiz-option ${selectedAnswer === idx ? (idx === question.correct ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleAnswer(idx)}
                disabled={showExplanation}
              >
                {option}
                {showExplanation && idx === question.correct && <span className="check-mark">✅</span>}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation">
              <p className="explanation-text">{question.explanation}</p>
              <button onClick={handleNext} className="btn-primary">
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Следующий Вопрос →' : 'Посмотреть Результаты'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LearnPage
