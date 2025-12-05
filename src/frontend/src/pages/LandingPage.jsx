import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎴',
      title: 'Таро',
      description: '78 карт, 6 профессиональных раскладов',
      details: 'От карты дня до Кельтского креста'
    },
    {
      icon: '⭐',
      title: 'Астрология',
      description: 'Полная натальная карта',
      details: '16 точек интерпретации'
    },
    {
      icon: '🔢',
      title: 'Нумерология',
      description: '5 типов расчётов',
      details: 'Числа судьбы, души, личности'
    },
    {
      icon: '🌙',
      title: 'Фазы Луны',
      description: '8 фаз с рекомендациями',
      details: 'Лучшее время для раскладов'
    },
    {
      icon: '📔',
      title: 'Дневник',
      description: 'Отслеживайте инсайты',
      details: 'Рефлексия и рост'
    },
    {
      icon: '🤖',
      title: 'AI Интерпретация',
      description: 'Умные персональные толкования',
      details: 'На основе ваших данных'
    }
  ];

  const pricing = [
    {
      name: 'Бесплатно',
      price: '0₽',
      period: 'навсегда',
      features: [
        '3 расклада в день',
        'Базовые расклады',
        'Карта дня',
        'Базовая статистика',
        'История раскладов'
      ],
      cta: 'Начать',
      primary: false
    },
    {
      name: 'Premium',
      price: '399₽',
      period: 'в месяц',
      features: [
        'Unlimited расклады',
        'Все профессиональные расклады',
        'Полная натальная карта',
        'Нумерология',
        'Фазы Луны',
        'Дневник с экспортом',
        'Персональные инсайты',
        'Приоритетная поддержка',
        'Без рекламы'
      ],
      cta: 'Попробовать Premium',
      primary: true
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Таро + Астрология + Нумерология</span>
            <br />
            В одном приложении
          </h1>
          <p className="hero-subtitle">
            Единственное приложение 3-в-1 для глубокого самопознания и принятия решений
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate('/register')}
              className="btn-hero primary"
            >
              Начать Бесплатно
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-hero secondary"
            >
              Войти
            </button>
          </div>
          <p className="hero-note">
            ✨ Без кредитной карты • 3 расклада в день бесплатно
          </p>
        </div>

        <div className="hero-image">
          <div className="floating-card">🔮</div>
        </div>
      </section>

      {/* Try Without Registration */}
      <section className="try-section">
        <h2 className="section-title">Попробуйте Прямо Сейчас</h2>
        <p className="section-subtitle">Без регистрации - просто нажмите и пользуйтесь</p>

        <div className="try-grid">
          <button onClick={() => navigate('/reading/yes-no')} className="try-card">
            <span className="try-icon">❓</span>
            <span className="try-title">Да или Нет?</span>
            <span className="try-desc">Быстрый ответ на вопрос</span>
          </button>

          <button onClick={() => navigate('/numerology')} className="try-card">
            <span className="try-icon">🔢</span>
            <span className="try-title">Нумерология</span>
            <span className="try-desc">5 расчётов по дате рождения</span>
          </button>

          <button onClick={() => navigate('/natal-chart')} className="try-card">
            <span className="try-icon">⭐</span>
            <span className="try-title">Натальная Карта</span>
            <span className="try-desc">16 точек интерпретации</span>
          </button>

          <button onClick={() => navigate('/moon-calendar')} className="try-card">
            <span className="try-icon">🌙</span>
            <span className="try-title">Лунный Календарь</span>
            <span className="try-desc">Фазы и рекомендации</span>
          </button>

          <button onClick={() => navigate('/cards')} className="try-card">
            <span className="try-icon">🎴</span>
            <span className="try-title">Колода Таро</span>
            <span className="try-desc">78 карт и значения</span>
          </button>

          <button onClick={() => navigate('/compatibility')} className="try-card">
            <span className="try-icon">💕</span>
            <span className="try-title">Совместимость</span>
            <span className="try-desc">Таро + Астро + Числа</span>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Всё для Самопознания</h2>
        <p className="section-subtitle">
          Зачем 3-4 приложения, когда есть одно?
        </p>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <p className="feature-details">{feature.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Unique Value */}
      <section className="unique-section">
        <h2 className="section-title">Наше Уникальное Преимущество</h2>

        <div className="unique-grid">
          <div className="unique-item">
            <div className="unique-number">1</div>
            <h3>Интеллектуальная Интеграция</h3>
            <p>
              Мы не просто собрали 3 инструмента в одно приложение.
              Мы объединили их данные для <strong>глубоких персональных инсайтов</strong>.
            </p>
            <div className="example">
              Пример: "Как Лев с числом жизненного пути 1, в полнолуние ваша энергия на пике!"
            </div>
          </div>

          <div className="unique-item">
            <div className="unique-number">2</div>
            <h3>Рефлексия "Месяц Назад"</h3>
            <p>
              Уникальная функция дневника показывает ваши записи месячной давности.
              <strong>Отслеживайте рост</strong> и видьте, как сбываются предсказания.
            </p>
          </div>

          <div className="unique-item">
            <div className="unique-number">3</div>
            <h3>Самое Быстрое</h3>
            <p>
              Загружается <strong>в 2.5 раза быстрее</strong> конкурентов.
              Работает даже на слабых устройствах и 3G.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="comparison-section">
        <h2 className="section-title">Сравнение с Конкурентами</h2>

        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Функция</th>
                <th>Другие приложения</th>
                <th className="our-column">Таро Помощник</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Таро карты</td>
                <td>78 карт</td>
                <td className="our-column">✅ 78 карт</td>
              </tr>
              <tr>
                <td>Расклады</td>
                <td>4-8</td>
                <td className="our-column">✅ 6 раскладов</td>
              </tr>
              <tr>
                <td>Астрология</td>
                <td>❌ Нет</td>
                <td className="our-column">✅ 16 точек</td>
              </tr>
              <tr>
                <td>Нумерология</td>
                <td>❌ Нет</td>
                <td className="our-column">✅ 5 расчётов</td>
              </tr>
              <tr>
                <td>Фазы Луны</td>
                <td>❌ Нет</td>
                <td className="our-column">✅ 8 фаз</td>
              </tr>
              <tr>
                <td>Дневник</td>
                <td>⚠️ Базовый</td>
                <td className="our-column">✅ + Рефлексия</td>
              </tr>
              <tr>
                <td>Цена</td>
                <td>$6.99-14.99</td>
                <td className="our-column">✅ 399₽ ($4.99)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section">
        <h2 className="section-title">Простые и Честные Цены</h2>
        <p className="section-subtitle">
          Начните бесплатно, обновитесь когда готовы
        </p>

        <div className="pricing-grid">
          {pricing.map((plan, idx) => (
            <div key={idx} className={`pricing-card ${plan.primary ? 'primary' : ''}`}>
              {plan.primary && <div className="popular-badge">Популярный</div>}

              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>✅ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/register')}
                className={`plan-cta ${plan.primary ? 'primary' : 'secondary'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Готовы Начать Путь Самопознания?</h2>
        <p>Присоединяйтесь к тысячам пользователей уже сегодня</p>
        <button
          onClick={() => navigate('/register')}
          className="btn-cta"
        >
          Начать Бесплатно 🚀
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 Таро Помощник Решений. Все права защищены.</p>
        <div className="footer-links">
          <a href="/privacy">Конфиденциальность</a>
          <a href="/terms">Условия</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
