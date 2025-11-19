import { useNavigate } from 'react-router-dom'
import './AboutPage.css'

function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-stars-bg"></div>
        <button onClick={() => navigate('/dashboard')} className="btn-back-about">
          ← На Главную
        </button>
        <div className="about-hero-content">
          <h1>🔮 AI Tarot Decision Assistant</h1>
          <p className="tagline">Ваш персональный гид в мире мистики, решений и самопознания</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="about-section">
        <h2 className="section-title">✨ Что Мы Предлагаем</h2>

        <div className="features-grid">
          <div className="feature-card tarot">
            <div className="feature-icon">🎴</div>
            <h3>Расклады Таро</h3>
            <div className="feature-list">
              <span className="feature-badge">9 раскладов</span>
              <ul>
                <li>Кельтский Крест (10 карт)</li>
                <li>Любовь и Отношения (7 карт)</li>
                <li>Финансы (6 карт)</li>
                <li>День Рождения (5 карт)</li>
                <li>Да/Нет (1 карта)</li>
                <li>И многое другое...</li>
              </ul>
            </div>
          </div>

          <div className="feature-card astrology">
            <div className="feature-icon">⭐</div>
            <h3>Астрология</h3>
            <div className="feature-list">
              <span className="feature-badge">Полная система</span>
              <ul>
                <li>10 планет с интерпретациями</li>
                <li>12 домов гороскопа</li>
                <li>Аспекты между планетами</li>
                <li>Натальная карта онлайн</li>
                <li>Лунный календарь</li>
              </ul>
            </div>
          </div>

          <div className="feature-card numerology">
            <div className="feature-icon">🔢</div>
            <h3>Нумерология</h3>
            <div className="feature-list">
              <span className="feature-badge">5 расчётов</span>
              <ul>
                <li>Число Жизненного Пути</li>
                <li>Число Судьбы</li>
                <li>Число Души</li>
                <li>Число Личности</li>
                <li>Совместимость</li>
              </ul>
            </div>
          </div>

          <div className="feature-card tools">
            <div className="feature-icon">🛠️</div>
            <h3>Инструменты</h3>
            <div className="feature-list">
              <span className="feature-badge">Premium</span>
              <ul>
                <li>Дневник с трекингом</li>
                <li>Аналитика раскладов</li>
                <li>История с поиском</li>
                <li>Тесты личности</li>
                <li>Экспорт данных</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-section stats-section">
        <h2 className="section-title">📊 Наши Достижения</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">120+</div>
            <div className="stat-label">Функций</div>
            <p>Полностью реализованных возможностей</p>
          </div>

          <div className="stat-card">
            <div className="stat-number">78</div>
            <div className="stat-label">Карт Таро</div>
            <p>Полная колода с интерпретациями</p>
          </div>

          <div className="stat-card">
            <div className="stat-number">10</div>
            <div className="stat-label">Планет</div>
            <p>Полная астрологическая система</p>
          </div>

          <div className="stat-card">
            <div className="stat-number">9</div>
            <div className="stat-label">Раскладов</div>
            <p>От быстрых до глубоких анализов</p>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="about-section tech-section">
        <h2 className="section-title">⚡ Технологии</h2>

        <div className="tech-grid">
          <div className="tech-card">
            <h4>Frontend</h4>
            <div className="tech-tags">
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">Redux Toolkit</span>
              <span className="tech-tag">Vite</span>
              <span className="tech-tag">CSS3</span>
            </div>
          </div>

          <div className="tech-card">
            <h4>Backend</h4>
            <div className="tech-tags">
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">JWT Auth</span>
              <span className="tech-tag">JSON DB</span>
            </div>
          </div>

          <div className="tech-card">
            <h4>Features</h4>
            <div className="tech-tags">
              <span className="tech-tag">PWA Ready</span>
              <span className="tech-tag">Responsive</span>
              <span className="tech-tag">Dark Mode</span>
              <span className="tech-tag">SEO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-section mission-section">
        <h2 className="section-title">🎯 Наша Миссия</h2>

        <div className="mission-content">
          <p className="mission-text">
            Мы создаём инструменты для самопознания и принятия решений,
            объединяя древнюю мудрость Таро, Астрологии и Нумерологии
            с современными технологиями.
          </p>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h4>Точность</h4>
              <p>Профессиональные интерпретации на основе классических систем</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h4>Приватность</h4>
              <p>Ваши данные защищены. GDPR compliance.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">💎</div>
              <h4>Качество</h4>
              <p>Красивый дизайн и удобный интерфейс</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h4>Инновации</h4>
              <p>Постоянное развитие и новые функции</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta">
        <h2>Готовы начать своё путешествие?</h2>
        <p>Присоединяйтесь к тысячам пользователей, которые уже открыли новые горизонты</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/dashboard')} className="btn-cta-primary">
            Начать Сейчас
          </button>
          <button onClick={() => navigate('/premium')} className="btn-cta-secondary">
            Узнать о Premium
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">
        <p>Сделано с ❤️ используя Theory of Constraints методологию</p>
        <p>© 2025 AI Tarot Decision Assistant</p>
      </div>
    </div>
  )
}

export default AboutPage
