import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import { PremiumSEO } from '../components/SEO'
import './PremiumPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function PremiumPage() {
  const { token, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)

  useEffect(() => {
    loadSubscriptionStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSubscriptionStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/stripe/subscription-status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubscriptionStatus(response.data.data)
    } catch (error) {
      console.error('Load subscription status error:', error)
    }
  }

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/stripe/create-checkout-session`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Redirect to Stripe Checkout
      window.location.href = response.data.data.url

    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error(error.response?.data?.error?.message || 'Не удалось начать оформление подписки')
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить подписку?')) {
      return
    }

    try {
      const response = await axios.post(
        `${API_URL}/stripe/cancel-subscription`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      toast.success(response.data.data.message)
      await loadSubscriptionStatus()

    } catch (error) {
      console.error('Cancel subscription error:', error)
      toast.error(error.response?.data?.error?.message || 'Не удалось отменить подписку')
    }
  }

  const isPremium = user?.subscriptionTier === 'premium'

  return (
    <div className="premium-page">
      <PremiumSEO />

      {/* Toast notifications */}
      {toast.toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          duration={t.duration}
          onClose={() => toast.hideToast(t.id)}
        />
      ))}

      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>✨ Премиум Подписка</h1>
      </header>

      <main className="premium-content">
        {isPremium ? (
          <div className="premium-active">
            <div className="success-badge">
              <span className="badge-icon">👑</span>
              <h2>У вас Премиум!</h2>
              <p>Спасибо за поддержку проекта</p>
            </div>

            {subscriptionStatus && (
              <div className="subscription-info">
                <h3>Информация о подписке</h3>
                <div className="info-row">
                  <span>Статус:</span>
                  <span className="status-active">Активна</span>
                </div>
                {subscriptionStatus.currentPeriodEnd && (
                  <div className="info-row">
                    <span>Следующее списание:</span>
                    <span>{new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('ru-RU')}</span>
                  </div>
                )}
                <button
                  onClick={handleCancelSubscription}
                  className="btn-danger"
                  style={{ marginTop: '16px' }}
                >
                  Отменить подписку
                </button>
              </div>
            )}

            <div className="premium-features">
              <h3>Ваши преимущества:</h3>
              <ul>
                <li>✅ Неограниченные расклады каждый день</li>
                <li>✅ Эксклюзивные интерпретации карт</li>
                <li>✅ Детальная история всех раскладов</li>
                <li>✅ Приоритетная поддержка</li>
                <li>✅ Ранний доступ к новым функциям</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="premium-offer">
            <div className="pricing-card">
              <div className="card-header">
                <h2>Премиум</h2>
                <div className="price">
                  <span className="amount">₽499</span>
                  <span className="period">/месяц</span>
                </div>
              </div>

              <div className="features-list">
                <h3>Что входит:</h3>
                <ul>
                  <li>
                    <span className="icon">✨</span>
                    <span>Неограниченные расклады</span>
                  </li>
                  <li>
                    <span className="icon">🔮</span>
                    <span>Все 78 карт Таро</span>
                  </li>
                  <li>
                    <span className="icon">📊</span>
                    <span>Детальная аналитика</span>
                  </li>
                  <li>
                    <span className="icon">📖</span>
                    <span>Полная история раскладов</span>
                  </li>
                  <li>
                    <span className="icon">🎯</span>
                    <span>Эксклюзивные интерпретации</span>
                  </li>
                  <li>
                    <span className="icon">💬</span>
                    <span>Приоритетная поддержка</span>
                  </li>
                  <li>
                    <span className="icon">🚀</span>
                    <span>Ранний доступ к новинкам</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-premium"
              >
                {loading ? 'Загрузка...' : '👑 Оформить Премиум'}
              </button>

              <div className="guarantee">
                <p>🔒 Безопасные платежи через Stripe</p>
                <p>❌ Отмена в любое время</p>
              </div>
            </div>

            <div className="comparison">
              <h3>Бесплатный vs Премиум</h3>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Функция</th>
                    <th>Бесплатно</th>
                    <th>Премиум</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Расклад дня</td>
                    <td>1 в день</td>
                    <td>✅ Неограниченно</td>
                  </tr>
                  <tr>
                    <td>Анализ решений</td>
                    <td>Базовый</td>
                    <td>✅ Расширенный</td>
                  </tr>
                  <tr>
                    <td>История</td>
                    <td>30 дней</td>
                    <td>✅ Без ограничений</td>
                  </tr>
                  <tr>
                    <td>Карты Таро</td>
                    <td>22 карты</td>
                    <td>✅ Все 78 карт</td>
                  </tr>
                  <tr>
                    <td>Поддержка</td>
                    <td>Email</td>
                    <td>✅ Приоритетная</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PremiumPage
