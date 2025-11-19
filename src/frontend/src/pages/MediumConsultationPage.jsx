import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MediumConsultationPage() {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = useState(null)

  const mediumServices = [
    {
      id: 'tarot-reading',
      title: 'Личный Расклад Таро',
      icon: '🎴',
      description: 'Профессиональный медиум проведёт детальный расклад на ваш вопрос с глубокой интерпретацией',
      duration: '30-45 мин',
      price: 'от 2,000₽',
      platforms: ['Zoom', 'WhatsApp видео', 'Телефон'],
      features: ['Запись сессии', 'PDF отчёт', 'Фото расклада', 'Email поддержка']
    },
    {
      id: 'astrology-reading',
      title: 'Астрологическая Консультация',
      icon: '⭐',
      description: 'Детальный разбор натальной карты с астрологом - транзиты, прогнозы, рекомендации',
      duration: '60 мин',
      price: 'от 3,500₽',
      platforms: ['Zoom', 'Google Meet'],
      features: ['Запись', 'PDF карта', 'Прогноз на год', '2 недели поддержки']
    },
    {
      id: 'combined',
      title: 'Комплексная Консультация',
      icon: '🌟',
      description: 'Таро + Астрология + Нумерология - полное погружение в вашу ситуацию',
      duration: '90 мин',
      price: 'от 5,000₽',
      platforms: ['Zoom'],
      features: ['Запись', 'Полный отчёт', '1 месяц поддержки', 'Повторная сессия -50%']
    },
    {
      id: 'quick-question',
      title: 'Быстрый Вопрос',
      icon: '❓',
      description: 'Один конкретный вопрос - быстрый ответ от медиума через Таро',
      duration: '15 мин',
      price: 'от 1,000₽',
      platforms: ['WhatsApp', 'Telegram', 'Текст'],
      features: ['Фото расклада', 'Текстовая интерпретация']
    }
  ]

  const mediumPlatforms = [
    {
      name: 'Ясно',
      url: 'https://yasno.live',
      description: 'Крупнейшая платформа эзотерических услуг в России',
      rating: 4.8,
      mediums: 1500
    },
    {
      name: 'Astro7',
      url: 'https://astro7.ru',
      description: 'Профессиональные астрологи и тарологи онлайн 24/7',
      rating: 4.7,
      mediums: 800
    },
    {
      name: 'Magistika',
      url: 'https://magistika.com',
      description: 'Персональные консультации с проверенными специалистами',
      rating: 4.6,
      mediums: 500
    }
  ]

  return (
    <div className="medium-consultation-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🔮 Консультация Медиума</h1>
      </header>

      <main style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div className="coming-soon-banner" style={{
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>🔮 Прямая Связь с Профессионалами</h2>
          <p style={{ fontSize: '16px', maxWidth: 600, margin: '0 auto' }}>
            Интеграция с ведущими платформами эзотерических услуг для получения личной консультации
          </p>
        </div>

        {/* Planned Services */}
        <section style={{ marginBottom: '48px' }}>
          <h3 style={{ color: '#667eea', fontSize: '24px', marginBottom: '24px' }}>
            Типы Консультаций:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {mediumServices.map((service) => (
              <div
                key={service.id}
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: selectedService === service.id ? '2px solid #667eea' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setSelectedService(service.id)}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{service.icon}</div>
                <h4 style={{ color: '#333', marginBottom: '8px', fontSize: '18px' }}>
                  {service.title}
                </h4>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', minHeight: 60 }}>
                  {service.description}
                </p>

                <div style={{
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#999' }}>⏱️ {service.duration}</span>
                    <span style={{ fontSize: '16px', color: '#667eea', fontWeight: 700 }}>
                      {service.price}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    📱 {service.platforms.join(', ')}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#667eea', fontWeight: 600, marginBottom: '6px' }}>
                    Включено:
                  </div>
                  {service.features.map((feature, idx) => (
                    <div key={idx} style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                      ✓ {feature}
                    </div>
                  ))}
                </div>

                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#e0e0e0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#999',
                    cursor: 'not-allowed',
                    fontWeight: 600
                  }}
                >
                  Скоро доступно
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Platforms */}
        <section style={{ marginBottom: '48px' }}>
          <h3 style={{ color: '#667eea', fontSize: '24px', marginBottom: '16px' }}>
            Партнёрские Платформы:
          </h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
            Мы интегрируемся с ведущими сервисами, чтобы вы могли сразу связаться с проверенными специалистами
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {mediumPlatforms.map((platform) => (
              <div
                key={platform.name}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px'
                }}>
                  <h4 style={{ color: '#333', fontSize: '18px', margin: 0 }}>
                    {platform.name}
                  </h4>
                  <div style={{
                    background: '#ffd700',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    ⭐ {platform.rating}
                  </div>
                </div>

                <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.5, marginBottom: '12px' }}>
                  {platform.description}
                </p>

                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '12px'
                }}>
                  👥 {platform.mediums}+ специалистов
                </div>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px',
                    background: '#667eea',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Перейти на платформу →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Features Coming */}
        <section style={{
          background: 'linear-gradient(135deg, #fff9f0 0%, #ffffff 100%)',
          padding: '32px',
          borderRadius: '12px',
          border: '2px solid #ff9800'
        }}>
          <h3 style={{ color: '#ff9800', fontSize: '20px', marginBottom: '16px' }}>
            🚀 Что мы планируем добавить:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                📅 Запись на Сессию
              </h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                Бронирование времени прямо в приложении
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                💳 Оплата Онлайн
              </h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                Безопасная оплата через Stripe
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                ⭐ Рейтинг Медиумов
              </h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                Отзывы и рейтинги от реальных клиентов
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                📝 История Консультаций
              </h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                Сохранение записей и заметок
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                🎁 Специальные Предложения
              </h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                Скидки для постоянных клиентов
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                💬 Чат с Медиумом
              </h4>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                Текстовые консультации в реальном времени
              </p>
            </div>
          </div>
        </section>

        {/* Temporary Alternative */}
        <div style={{
          marginTop: '40px',
          padding: '24px',
          background: '#f8f9fa',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#333', marginBottom: '12px' }}>
            💡 Пока функция в разработке
          </h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Используйте автоматические расклады или перейдите на партнёрские платформы выше
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/reading/daily')} className="btn-primary">
              Расклад Дня
            </button>
            <button onClick={() => navigate('/decision')} className="btn-primary">
              Анализ Решения
            </button>
            <button onClick={() => navigate('/natal-chart')} className="btn-secondary">
              Натальная Карта
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MediumConsultationPage
