import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { useTheme } from '../hooks/useTheme'
import Onboarding from '../components/Onboarding'
import MoonPhase from '../components/MoonPhase'
import PersonalizedInsights from '../components/PersonalizedInsights'
import '../styles/dashboard.css'
import '../styles/hero-section.css'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [expandedSections, setExpandedSections] = useState({
    tarot: true,
    astrology: true,
    tools: true
  })

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="dashboard">
      <Onboarding />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-stars"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-icon">🔮</span>
              Добро пожаловать, {user?.displayName || 'Путник'}
            </h1>
            <p className="hero-subtitle">
              Ваш персональный гид в мире Таро, Астрологии и Мистики
            </p>
          </div>
          <div className="hero-actions">
            <button onClick={toggleTheme} className="hero-btn theme-toggle-hero" title="Сменить тему">
              {theme === 'light' ? '🌙 Темная тема' : '☀️ Светлая тема'}
            </button>
            {user?.subscriptionTier !== 'premium' && (
              <button onClick={() => navigate('/premium')} className="hero-btn premium-btn">
                👑 Премиум
              </button>
            )}
            <button onClick={() => navigate('/journal')} className="hero-btn journal-btn">
              📔 Дневник
            </button>
            <button onClick={() => navigate('/profile')} className="hero-btn">
              ⚙️ Профиль
            </button>
            <button onClick={handleLogout} className="hero-btn secondary">
              Выход
            </button>
          </div>
        </div>
        <div className="hero-widgets">
          <MoonPhase size="medium" />
        </div>
      </div>

      <PersonalizedInsights />

      <main className="dashboard-content-new">
        {/* Quick Actions - Всегда видимые */}
        <div className="quick-actions-section">
          <h2 className="section-title-main">Быстрый Старт</h2>

          <div className="quick-grid">
            <div className="dashboard-card highlight featured">
              <div className="card-badge">Быстро!</div>
              <h2>❓ Да или Нет?</h2>
              <p>Мгновенный ответ на вопрос</p>
              <button className="btn-primary" onClick={() => navigate('/reading/yes-no')}>
                Спросить
              </button>
            </div>

            <div className="dashboard-card highlight">
              <h2>🔮 Карта Дня</h2>
              <p>Ваш ежедневный расклад</p>
              <button className="btn-primary" onClick={() => navigate('/reading/daily')}>
                Вытянуть Карту
              </button>
            </div>

            <div className="dashboard-card highlight special">
              <div className="card-badge">Скоро</div>
              <h2>🔮 Консультация Медиума</h2>
              <p>Персональная консультация</p>
              <button className="btn-primary" onClick={() => navigate('/medium-consultation')}>
                Узнать Подробнее
              </button>
            </div>
          </div>
        </div>

        {/* Astrology Section - ПЕРВАЯ (поменяли местами) */}
        <div className="category-section">
          <button
            className="category-header"
            onClick={() => toggleSection('astrology')}
          >
            <span className="category-title">⭐ Астрология & Мистика</span>
            <span className="category-toggle">{expandedSections.astrology ? '▼' : '▶'}</span>
          </button>

          {expandedSections.astrology && (
            <div className="category-content">
              <div className="dashboard-grid">
                <div className="dashboard-card featured">
                  <h3>🌟 Натальная Карта</h3>
                  <p>Полный астрологический анализ (16 точек)</p>
                  <button className="btn-primary" onClick={() => navigate('/natal-chart')}>
                    Открыть
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <div className="card-badge">Новое!</div>
                  <h3>🔢 Нумерология</h3>
                  <p>5 расчётов + совместимость</p>
                  <button className="btn-primary" onClick={() => navigate('/numerology')}>
                    Рассчитать
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>🌙 Лунный Календарь</h3>
                  <p>Фазы Луны и рекомендации</p>
                  <button className="btn-primary" onClick={() => navigate('/moon-calendar')}>
                    Смотреть
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>💕 Совместимость</h3>
                  <p>Таро + Астро + Числа</p>
                  <button className="btn-primary" onClick={() => navigate('/compatibility')}>
                    Проверить
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>🧪 Тесты Личности</h3>
                  <p>2 работающих теста</p>
                  <button className="btn-primary" onClick={() => navigate('/tests')}>
                    Пройти
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tarot Section - ВТОРАЯ (поменяли местами) */}
        <div className="category-section">
          <button
            className="category-header"
            onClick={() => toggleSection('tarot')}
          >
            <span className="category-title">🎴 Расклады Таро</span>
            <span className="category-toggle">{expandedSections.tarot ? '▼' : '▶'}</span>
          </button>

          {expandedSections.tarot && (
            <div className="category-content">
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="card-badge">Популярный</div>
                  <h3>🔮 Кельтский Крест</h3>
                  <p>Глубокий анализ ситуации (10 карт)</p>
                  <div className="card-meta">⏱️ 20 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/celtic-cross')}>
                    Начать
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>💕 Отношения</h3>
                  <p>Динамика ваших отношений (7 карт)</p>
                  <div className="card-meta">⏱️ 15 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/relationship')}>
                    Открыть
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>💼 Карьера</h3>
                  <p>Таланты и возможности (6 карт)</p>
                  <div className="card-meta">⏱️ 12 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/career-path')}>
                    Пройти
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>🎆 Год Вперёд</h3>
                  <p>Энергия 12 месяцев (13 карт)</p>
                  <div className="card-meta">⏱️ 25 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/year-ahead')}>
                    Узнать
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <div className="card-badge">Новое!</div>
                  <h3>🗓️ Расклад на Месяцы</h3>
                  <p>Прогноз на каждый месяц года (12 карт)</p>
                  <div className="card-meta">⏱️ 15 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/year-spread')}>
                    Начать
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <div className="card-badge">Новое!</div>
                  <h3>💕 Любовь и Отношения</h3>
                  <p>Глубокий анализ чувств (7 карт)</p>
                  <div className="card-meta">⏱️ 18 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/love')}>
                    Начать
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <div className="card-badge">Новое!</div>
                  <h3>💰 Финансы и Изобилие</h3>
                  <p>Денежная ситуация и советы (6 карт)</p>
                  <div className="card-meta">⏱️ 15 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/finance')}>
                    Начать
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <div className="card-badge">Новое!</div>
                  <h3>🎂 День Рождения</h3>
                  <p>Прогноз на ваш личный год (5 карт)</p>
                  <div className="card-meta">⏱️ 12 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/birthday')}>
                    Начать
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>⏳ Прошлое-Настоящее-Будущее</h3>
                  <p>Линия времени (3 карты)</p>
                  <div className="card-meta">⏱️ 8 мин</div>
                  <button className="btn-primary" onClick={() => navigate('/reading/past-present-future')}>
                    Начать
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>📚 Колода Таро</h3>
                  <p>Все 78 карт и значения</p>
                  <button className="btn-primary" onClick={() => navigate('/cards')}>
                    Смотреть
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>🎓 Обучение</h3>
                  <p>Квиз по Старшим Арканам</p>
                  <button className="btn-primary" onClick={() => navigate('/learn')}>
                    Учиться
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tools Section - Collapsible */}
        <div className="category-section">
          <button
            className="category-header"
            onClick={() => toggleSection('tools')}
          >
            <span className="category-title">🛠️ Инструменты & История</span>
            <span className="category-toggle">{expandedSections.tools ? '▼' : '▶'}</span>
          </button>

          {expandedSections.tools && (
            <div className="category-content">
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>📖 История</h3>
                  <p>Все ваши расклады</p>
                  <button className="btn-primary" onClick={() => navigate('/history')}>
                    Смотреть
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>📊 Аналитика</h3>
                  <p>Статистика и графики</p>
                  <button className="btn-primary" onClick={() => navigate('/analytics')}>
                    Открыть
                  </button>
                </div>

                <div className="dashboard-card">
                  <h3>👑 Premium</h3>
                  <p>Все функции без ограничений</p>
                  <button className="btn-primary" onClick={() => navigate('/premium')}>
                    Узнать
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <div className="card-badge">Новое!</div>
                  <h3>🏆 Достижения</h3>
                  <p>Ваша коллекция наград и успехов</p>
                  <button className="btn-primary" onClick={() => navigate('/achievements')}>
                    Смотреть
                  </button>
                </div>

                <div className="dashboard-card featured">
                  <h3>ℹ️ О Проекте</h3>
                  <p>Возможности, статистика, технологии</p>
                  <button className="btn-primary" onClick={() => navigate('/about')}>
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card - Always Visible */}
        <div className="stats-card-main">
          <h2>📊 Ваша Статистика</h2>
          <div className="stats-grid-main">
            <div className="stat-item">
              <span className="stat-label">Всего Раскладов</span>
              <span className="stat-value">{user?.stats?.totalReadings || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Текущая Серия</span>
              <span className="stat-value">{user?.stats?.currentStreak || 0} дн.</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Подписка</span>
              <span className="stat-value">{user?.subscriptionTier === 'premium' ? '👑 Премиум' : '🆓 Бесплатно'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
