import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CompatibilityPage() {
  const navigate = useNavigate()
  const [yourSign, setYourSign] = useState('')
  const [partnerSign, setPartnerSign] = useState('')

  const zodiacSigns = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ]

  return (
    <div className="compatibility-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>💕 Совместимость</h1>
      </header>

      <main className="compatibility-content" style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <div className="coming-soon-banner" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>🚧 В Разработке</h2>
          <p style={{ fontSize: '16px', marginBottom: '24px' }}>
            Мы работаем над созданием комплексного анализа совместимости!
          </p>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '12px' }}>Что будет доступно:</h3>
            <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8 }}>
              <li>💑 Совместимость по знакам зодиака</li>
              <li>🎴 Синастрия через карты Таро</li>
              <li>🌟 Анализ натальных карт пары</li>
              <li>💕 Сильные стороны отношений</li>
              <li>⚡ Области для развития</li>
              <li>📊 Процент совместимости</li>
              <li>💡 Советы для гармонии</li>
            </ul>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '24px' }}>Предварительная Форма</h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Оставьте свои данные, и мы уведомим вас когда функция будет готова!
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              Ваш Знак Зодиака:
            </label>
            <select
              value={yourSign}
              onChange={(e) => setYourSign(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="">Выберите знак</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              Знак Партнёра:
            </label>
            <select
              value={partnerSign}
              onChange={(e) => setPartnerSign(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="">Выберите знак</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          <button
            disabled
            style={{
              width: '100%',
              padding: '14px',
              background: '#ccc',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'not-allowed'
            }}
          >
            Функция в разработке
          </button>

          <p style={{
            textAlign: 'center',
            color: '#999',
            fontSize: '13px',
            marginTop: '16px'
          }}>
            Ожидаемая дата запуска: Декабрь 2025
          </p>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <h4 style={{ color: '#333', marginBottom: '16px' }}>💡 Пока можете использовать:</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/natal-chart')}
              className="btn-secondary"
            >
              Натальная Карта
            </button>
            <button
              onClick={() => navigate('/decision')}
              className="btn-secondary"
            >
              Расклад на Решение
            </button>
            <button
              onClick={() => navigate('/cards')}
              className="btn-secondary"
            >
              Изучить Карты
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CompatibilityPage
