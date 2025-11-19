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
        <div className="empty-state">
          <span className="empty-icon">🔮</span>
          <h3>Персонализированные Инсайты</h3>
          <p>Заполните профиль для получения персональных рекомендаций</p>
          <div className="empty-actions">
            <a href="/natal-chart" className="setup-link">Натальная карта</a>
            <a href="/numerology" className="setup-link">Нумерология</a>
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
