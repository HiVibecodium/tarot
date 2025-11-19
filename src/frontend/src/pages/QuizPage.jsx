import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load questions
      const questionsRes = await axios.get(`${API_URL}/quiz/questions`);
      const allQuestions = questionsRes.data.data.questions;

      // Load user progress
      const token = localStorage.getItem('token');
      const progressRes = await axios.get(`${API_URL}/quiz/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userProgress = progressRes.data.data.progress;

      setQuestions(allQuestions);
      setProgress(userProgress);

      // Find first uncompleted question
      const uncompletedIndex = allQuestions.findIndex(
        q => !userProgress.completed.includes(q.id)
      );
      setCurrentQuestionIndex(uncompletedIndex >= 0 ? uncompletedIndex : 0);

    } catch (err) {
      console.error('Load quiz error:', err);
      setError('Не удалось загрузить квиз');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) {
      alert('Пожалуйста, выберите ответ');
      return;
    }

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const token = localStorage.getItem('token');

      const res = await axios.post(`${API_URL}/quiz/submit`, {
        questionId: currentQuestion.id,
        answerIndex: selectedAnswer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAnswerResult(res.data.data);
      setShowExplanation(true);
      setProgress(prev => ({
        ...prev,
        ...res.data.data.progress
      }));

    } catch (err) {
      console.error('Submit answer error:', err);
      alert('Ошибка при отправке ответа');
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswerResult(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      alert('🎉 Квиз завершён! Ваш счёт: ' + progress.score + '%');
    }
  };

  const handleRestart = async () => {
    if (confirm('Вы уверены, что хотите начать заново? Прогресс будет сброшен.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/quiz/reset`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadQuiz();
      } catch (err) {
        console.error('Reset error:', err);
        alert('Ошибка при сбросе прогресса');
      }
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="loading">Загрузка квиза...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="error">{error}</div>
        <button onClick={loadQuiz} className="retry-btn">Попробовать снова</button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="quiz-page">
        <div className="error">Вопросы не найдены</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = progress ? Math.round((progress.completed / questions.length) * 100) : 0;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1 className="quiz-title">🎓 Обучающий Квиз: Старшие Арканы</h1>
        <p className="quiz-subtitle">Проверьте свои знания карт Таро</p>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress">
        <div className="progress-info">
          <span>Прогресс: {progress?.completed || 0}/{questions.length}</span>
          <span>Счёт: {progress?.score || 0}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
          <span className={`question-difficulty ${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty === 'easy' ? '⭐ Лёгкий' :
             currentQuestion.difficulty === 'medium' ? '⭐⭐ Средний' :
             '⭐⭐⭐ Сложный'}
          </span>
        </div>

        <h2 className="question-card-name">
          {currentQuestion.cardNumber !== undefined ? `${currentQuestion.cardNumber}. ` : ''}
          {currentQuestion.card}
        </h2>

        <p className="question-text">{currentQuestion.question}</p>

        {/* Answer Options */}
        <div className="answer-options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = answerResult?.correctAnswer === index;
            const isWrong = showExplanation && isSelected && !answerResult?.isCorrect;

            return (
              <button
                key={index}
                className={`answer-option ${isSelected ? 'selected' : ''} ${
                  showExplanation ? (isCorrect ? 'correct' : isWrong ? 'wrong' : '') : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showExplanation && isCorrect && <span className="checkmark">✓</span>}
                {showExplanation && isWrong && <span className="crossmark">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && answerResult && (
          <div className={`explanation ${answerResult.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="explanation-header">
              {answerResult.isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
            </div>
            <p className="explanation-text">{answerResult.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="quiz-actions">
          {!showExplanation ? (
            <button
              className="submit-answer-btn"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Проверить ответ
            </button>
          ) : (
            <button className="next-question-btn" onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить квиз'}
            </button>
          )}
        </div>
      </div>

      {/* Completion Status */}
      {progress?.isCompleted && (
        <div className="completion-banner">
          <h3>🎉 Квиз завершён!</h3>
          <p>Ваш итоговый счёт: <strong>{progress.score}%</strong></p>
          <p>Правильных ответов: {progress.correct?.length} из {questions.length}</p>
          {progress.score === 100 && (
            <p className="perfect-score">🏆 Идеальный результат! Вы получили достижение "Таро Учёный"!</p>
          )}
          <button onClick={handleRestart} className="restart-btn">
            🔄 Пройти заново
          </button>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="quiz-footer">
        <button onClick={() => navigate('/learn')} className="back-btn">
          ← Вернуться к обучению
        </button>
        {!progress?.isCompleted && (
          <button onClick={handleRestart} className="restart-small-btn">
            🔄 Начать заново
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
