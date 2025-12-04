import { useState } from 'react';
import analytics from '../utils/analytics';
import axios from '../utils/axios';
import './FeedbackButton.css';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    type: 'suggestion',
    message: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send feedback to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/feedback`, {
        type: feedback.type,
        message: feedback.message,
        email: feedback.email || null,
        url: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      // Track feedback submission
      analytics.trackEvent('Feedback', 'submit', feedback.type);

      setSubmitted(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFeedback({ type: 'suggestion', message: '', email: '' });
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Не удалось отправить отзыв. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="feedback-button"
        onClick={() => setIsOpen(true)}
        title="Оставить отзыв"
        aria-label="Оставить отзыв"
      >
        💬
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="feedback-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="feedback-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>

            {!submitted ? (
              <>
                <h3 className="feedback-title">Обратная связь</h3>
                <p className="feedback-subtitle">
                  Помогите нам стать лучше! Ваше мнение очень важно.
                </p>

                <form onSubmit={handleSubmit} className="feedback-form">
                  {/* Feedback Type */}
                  <div className="feedback-type-selector">
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="bug"
                        checked={feedback.type === 'bug'}
                        onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
                      />
                      <span className="feedback-type-option">
                        🐛 Ошибка
                      </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="suggestion"
                        checked={feedback.type === 'suggestion'}
                        onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
                      />
                      <span className="feedback-type-option">
                        💡 Предложение
                      </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="compliment"
                        checked={feedback.type === 'compliment'}
                        onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
                      />
                      <span className="feedback-type-option">
                        ❤️ Благодарность
                      </span>
                    </label>
                  </div>

                  {/* Message */}
                  <div className="feedback-field">
                    <label htmlFor="feedback-message">
                      Сообщение <span className="required">*</span>
                    </label>
                    <textarea
                      id="feedback-message"
                      value={feedback.message}
                      onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                      placeholder={
                        feedback.type === 'bug'
                          ? 'Опишите ошибку: что произошло, когда и на какой странице...'
                          : feedback.type === 'suggestion'
                          ? 'Что бы вы хотели улучшить или добавить?'
                          : 'Что вам понравилось?'
                      }
                      rows={4}
                      required
                      maxLength={1000}
                    />
                    <div className="feedback-char-count">
                      {feedback.message.length}/1000
                    </div>
                  </div>

                  {/* Email (optional) */}
                  <div className="feedback-field">
                    <label htmlFor="feedback-email">
                      Email (необязательно)
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                    <small className="feedback-help">
                      Укажите email, если хотите получить ответ
                    </small>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="feedback-submit"
                    disabled={isSubmitting || !feedback.message.trim()}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                  </button>
                </form>
              </>
            ) : (
              <div className="feedback-success">
                <div className="feedback-success-icon">✅</div>
                <h3>Спасибо!</h3>
                <p>Ваш отзыв отправлен. Мы обязательно его рассмотрим.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
