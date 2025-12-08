import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './PersonalizedInsights.css';

const PersonalizedInsights = () => {
  const { token } = useSelector((state) => state.auth);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/insights/unified`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setInsights(response.data.data);
      }
    } catch (error) {
      // Если нет данных - это нормально
      console.log('No insights yet - user needs to fill profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="personalized-insights loading">
        <div className="insights-skeleton"></div>
      </div>
    );
  }

  if (!insights || !insights.integration) {
    return (
      <div className="personalized-insights empty">
        <div className="empty-state-enhanced">
          <div className="empty-header">
            <span className="empty-icon-large">🔮</span>
            <div className="empty-title-block">
              <h3>Ваши Персональные Инсайты</h3>
              <p className="empty-subtitle">Заполните данные для персональных рекомендаций</p>
            </div>
          </div>

          <div className="setup-checklist">
            <a href="/natal-chart" className="setup-item">
              <div className="setup-item-icon">🌟</div>
              <div className="setup-item-content">
                <h4>Натальная карта</h4>
                <p>Укажите дату, время и место рождения для астрологического анализа</p>
              </div>
              <div className="setup-item-arrow">→</div>
            </a>

            <a href="/numerology" className="setup-item">
              <div className="setup-item-icon">🔢</div>
              <div className="setup-item-content">
                <h4>Нумерология</h4>
                <p>Рассчитайте числа судьбы по имени и дате рождения</p>
              </div>
              <div className="setup-item-arrow">→</div>
            </a>

            <a href="/profile" className="setup-item">
              <div className="setup-item-icon">👤</div>
              <div className="setup-item-content">
                <h4>Профиль</h4>
                <p>Добавьте знак зодиака и предпочтения</p>
              </div>
              <div className="setup-item-arrow">→</div>
            </a>
          </div>

          <div className="empty-footer">
            <span className="footer-icon">✨</span>
            <span>После заполнения здесь появятся персональные прогнозы и советы</span>
          </div>
        </div>
      </div>
    );
  }

  const { integration, moonPhase } = insights;

  return (
    <div className="personalized-insights">
      <div className="insights-header">
        <div className="header-content">
          <h3>✨ Персональная Магия Момента</h3>
          <span className="insights-badge">💫 Создано для вас</span>
        </div>
        <p className="insights-subtitle">Энергии и возможности вашего пути прямо сейчас</p>
      </div>

      <div className="insights-grid">
        {integration.bestReadingTime && (
          <div className="insight-card moon-card">
            <div className="card-header">
              <div className="card-icon">{moonPhase.emoji}</div>
              <h4>Энергия Луны</h4>
            </div>
            <div className="card-content">
              <div className="timing-info">
                <span className="timing-label">Идеальный момент для практики:</span>
                <p className="timing-value">{integration.bestReadingTime}</p>
              </div>
            </div>
          </div>
        )}

        {integration.opportunities && integration.opportunities.length > 0 && (
          <div className="insight-card opportunities-card">
            <div className="card-header">
              <div className="card-icon">🌟</div>
              <h4>Сейчас Открыто</h4>
            </div>
            <div className="card-content">
              <ul className="opportunities-list">
                {integration.opportunities.map((opp, idx) => (
                  <li key={idx} className="opportunity-item">
                    <span className="opportunity-bullet">✦</span>
                    <span className="opportunity-text">{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {integration.personalizedReading && (
        <div className="main-insight">
          <div className="insight-icon">🔮</div>
          <p className="insight-message">{integration.personalizedReading}</p>
        </div>
      )}

      {integration.focusAreas && integration.focusAreas.length > 0 && (
        <div className="focus-areas">
          <div className="focus-label">💎 Сферы внимания:</div>
          <div className="focus-chips-container">
            {integration.focusAreas.map((area, idx) => (
              <div key={idx} className="focus-chip">
                <span className="focus-icon">{area.icon}</span>
                <span className="focus-text">{area.area}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedInsights;
