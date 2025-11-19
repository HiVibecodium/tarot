import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NumerologyPage.css';

const NumerologyPage = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    birthDate: '',
    fullName: ''
  });
  const [activeTab, setActiveTab] = useState('calculator');
  const [compatibilityForm, setCompatibilityForm] = useState({
    partnerBirthDate: '',
    partnerName: ''
  });
  const [compatibilityResult, setCompatibilityResult] = useState(null);

  useEffect(() => {
    loadSavedProfile();
  }, []);

  const loadSavedProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/numerology/profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setAnalysis(response.data.data);
        setFormData({
          birthDate: response.data.data.birthDate,
          fullName: response.data.data.fullName
        });
      }
    } catch (error) {
      // Profile не найден - это нормально для первого раза
    }
  };

  // Форматирование даты с автоматической подстановкой точек
  const formatDate = (value) => {
    // Убираем всё кроме цифр
    const numbers = value.replace(/\D/g, '');

    // Форматируем по маске ДД.ММ.ГГГГ
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (e, field) => {
    const formatted = formatDate(e.target.value);
    if (field === 'birthDate') {
      setFormData({ ...formData, birthDate: formatted });
    } else if (field === 'partnerBirthDate') {
      setCompatibilityForm({ ...compatibilityForm, partnerBirthDate: formatted });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/numerology/calculate`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setAnalysis(response.data.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при расчёте');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibility = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/numerology/compatibility`,
        compatibilityForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCompatibilityResult(response.data.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при расчёте совместимости');
    } finally {
      setLoading(false);
    }
  };

  const NumberCard = ({ title, data, icon }) => {
    if (!data) return null;

    const interpretation = data.interpretation;

    return (
      <div className="number-card" style={{ borderColor: interpretation.color }}>
        <div className="number-card-header">
          <span className="number-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <div className="number-value" style={{ color: interpretation.color }}>
          <span className="number-symbol">{interpretation.symbol}</span>
          <span className="number-digit">{data.value}</span>
        </div>
        <h4 className="number-title">{interpretation.title}</h4>
        <p className="number-description">{interpretation.description}</p>

        <div className="number-traits">
          <div className="traits-section">
            <h5>✨ Сильные стороны:</h5>
            <ul>
              {interpretation.traits.map((trait, idx) => (
                <li key={idx}>{trait}</li>
              ))}
            </ul>
          </div>
          <div className="traits-section">
            <h5>⚠️ Вызовы:</h5>
            <ul>
              {interpretation.challenges.map((challenge, idx) => (
                <li key={idx}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="number-details">
          <div className="detail-item">
            <strong>Карьера:</strong>
            <p>{interpretation.careers.join(', ')}</p>
          </div>
          <div className="detail-item">
            <strong>Совместимость:</strong>
            <p>{interpretation.compatibility}</p>
          </div>
        </div>

        {interpretation.affirmation && (
          <div className="affirmation-box">
            <h5>💫 Аффирмация:</h5>
            <p className="affirmation-text">"{interpretation.affirmation}"</p>
          </div>
        )}

        {(interpretation.luckyDays || interpretation.colors || interpretation.stones) && (
          <div className="mystical-info">
            <h5>🌟 Мистическая Информация</h5>
            <div className="mystical-grid">
              {interpretation.luckyDays && (
                <div className="mystical-item">
                  <strong>📅 Благоприятные дни:</strong>
                  <p>{interpretation.luckyDays.join(', ')}</p>
                </div>
              )}
              {interpretation.luckyNumbers && (
                <div className="mystical-item">
                  <strong>🎲 Счастливые числа:</strong>
                  <p>{interpretation.luckyNumbers.join(', ')}</p>
                </div>
              )}
              {interpretation.colors && (
                <div className="mystical-item">
                  <strong>🎨 Цвета силы:</strong>
                  <p>{interpretation.colors.join(', ')}</p>
                </div>
              )}
              {interpretation.stones && (
                <div className="mystical-item">
                  <strong>💎 Камни-талисманы:</strong>
                  <p>{interpretation.stones.join(', ')}</p>
                </div>
              )}
              {interpretation.element && (
                <div className="mystical-item">
                  <strong>🌊 Элемент:</strong>
                  <p>{interpretation.element}</p>
                </div>
              )}
              {interpretation.planet && (
                <div className="mystical-item">
                  <strong>🪐 Планета:</strong>
                  <p>{interpretation.planet}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const RecommendationsSection = ({ recommendations }) => {
    if (!recommendations) return null;

    return (
      <div className="recommendations-section">
        <h2>📋 Персональные Рекомендации</h2>

        {recommendations.thisYear && recommendations.thisYear.length > 0 && (
          <div className="recommendation-block year-block">
            <h3>🗓️ Энергия Этого Года</h3>
            {recommendations.thisYear.map((rec, idx) => (
              <p key={idx} className="recommendation-item">{rec}</p>
            ))}
          </div>
        )}

        {recommendations.general && recommendations.general.length > 0 && (
          <div className="recommendation-block">
            <h3>💡 Общие Рекомендации</h3>
            {recommendations.general.map((rec, idx) => (
              <p key={idx} className="recommendation-item">{rec}</p>
            ))}
          </div>
        )}

        {recommendations.career && recommendations.career.length > 0 && (
          <div className="recommendation-block">
            <h3>💼 Карьера</h3>
            {recommendations.career.map((rec, idx) => (
              <p key={idx} className="recommendation-item">{rec}</p>
            ))}
          </div>
        )}

        {recommendations.relationships && recommendations.relationships.length > 0 && (
          <div className="recommendation-block">
            <h3>💕 Отношения</h3>
            {recommendations.relationships.map((rec, idx) => (
              <p key={idx} className="recommendation-item">{rec}</p>
            ))}
          </div>
        )}

        {recommendations.spiritual && recommendations.spiritual.length > 0 && (
          <div className="recommendation-block">
            <h3>🔮 Духовный Рост</h3>
            {recommendations.spiritual.map((rec, idx) => (
              <p key={idx} className="recommendation-item">{rec}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="numerology-page">
      <div className="numerology-header">
        <h1>🔢 Нумерология</h1>
        <p>Раскройте свои числа судьбы и узнайте, что они говорят о вас</p>
      </div>

      <div className="numerology-tabs">
        <button
          className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          Калькулятор
        </button>
        <button
          className={`tab-button ${activeTab === 'compatibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('compatibility')}
        >
          Совместимость
        </button>
      </div>

      {activeTab === 'calculator' && (
        <>
          <div className="numerology-form-container">
            <form onSubmit={handleSubmit} className="numerology-form">
              <div className="form-group">
                <label>Дата рождения (ДД.ММ.ГГГГ):</label>
                <input
                  type="text"
                  placeholder="01011990"
                  value={formData.birthDate}
                  onChange={(e) => handleDateChange(e, 'birthDate')}
                  required
                  pattern="\d{2}\.\d{2}\.\d{4}"
                  maxLength="10"
                />
                <small>Просто введите 8 цифр, точки подставятся автоматически</small>
              </div>

              <div className="form-group">
                <label>Полное имя:</label>
                <input
                  type="text"
                  placeholder="Иван Иванович Иванов"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <small>Используйте имя, которое вам дали при рождении</small>
              </div>

              <button type="submit" disabled={loading} className="calculate-button">
                {loading ? 'Расчёт...' : 'Рассчитать'}
              </button>
            </form>
          </div>

          {analysis && (
            <div className="numerology-results">
              <div className="numbers-grid">
                <NumberCard
                  title="Число Жизненного Пути"
                  data={analysis.numbers.lifePath}
                  icon="🎯"
                />
                <NumberCard
                  title="Число Судьбы"
                  data={analysis.numbers.destiny}
                  icon="⭐"
                />
                <NumberCard
                  title="Число Души"
                  data={analysis.numbers.soulUrge}
                  icon="💫"
                />
                <NumberCard
                  title="Число Личности"
                  data={analysis.numbers.personality}
                  icon="👤"
                />
                <NumberCard
                  title="Число Зрелости"
                  data={analysis.numbers.maturity}
                  icon="🌱"
                />
                <NumberCard
                  title="Персональный Год"
                  data={analysis.numbers.personalYear}
                  icon="📅"
                />
              </div>

              <RecommendationsSection recommendations={analysis.recommendations} />
            </div>
          )}
        </>
      )}

      {activeTab === 'compatibility' && (
        <div className="compatibility-container">
          <div className="compatibility-info">
            <h2>💕 Совместимость по Числам</h2>
            <p>Узнайте, насколько гармоничны ваши отношения на основе чисел жизненного пути</p>
            {analysis && (
              <div className="your-number-info">
                <p>✨ Ваше число жизненного пути: <strong>{analysis.numbers.lifePath.value}</strong></p>
                <p className="hint-text">Введите данные партнёра для расчёта совместимости</p>
              </div>
            )}
          </div>

          {!analysis ? (
            <div className="compatibility-warning">
              <p>⚠️ Сначала рассчитайте свою нумерологию во вкладке "Калькулятор"</p>
              <button className="btn-primary" onClick={() => setActiveTab('calculator')}>
                Перейти к Калькулятору
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={calculateCompatibility} className="compatibility-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Дата рождения партнёра (ДД.ММ.ГГГГ):</label>
                    <input
                      type="text"
                      placeholder="01011990"
                      value={compatibilityForm.partnerBirthDate}
                      onChange={(e) => handleDateChange(e, 'partnerBirthDate')}
                      required
                      pattern="\d{2}\.\d{2}\.\d{4}"
                      maxLength="10"
                    />
                    <small>Просто введите 8 цифр, точки подставятся автоматически</small>
                  </div>

                  <div className="form-group">
                    <label>Имя партнёра (опционально):</label>
                    <input
                      type="text"
                      placeholder="Иван"
                      value={compatibilityForm.partnerName}
                      onChange={(e) => setCompatibilityForm({ ...compatibilityForm, partnerName: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="calculate-button">
                  {loading ? 'Расчёт...' : 'Проверить Совместимость'}
                </button>
              </form>

              {compatibilityResult && (
                <div className="compatibility-result-detailed">
                  <div className="compatibility-header">
                    <div className="couple-info">
                      <div className="person-card you">
                        <h4>{compatibilityResult.you.name}</h4>
                        <div className="number-badge">{compatibilityResult.you.lifePath}</div>
                        <p>{compatibilityResult.you.interpretation.title}</p>
                      </div>
                      <div className="heart-icon">💕</div>
                      <div className="person-card partner">
                        <h4>{compatibilityResult.partner.name}</h4>
                        <div className="number-badge">{compatibilityResult.partner.lifePath}</div>
                        <p>{compatibilityResult.partner.interpretation.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="compatibility-score-section">
                    <div className="score-circle">
                      <span className="score-value">{compatibilityResult.score}</span>
                      <span className="score-max">/10</span>
                    </div>
                    <h3 className="compatibility-level">{compatibilityResult.level}</h3>
                    <p className="compatibility-description">{compatibilityResult.description}</p>
                  </div>

                  <div className="compatibility-areas">
                    <h4>📊 Совместимость по сферам:</h4>
                    <div className="areas-grid">
                      <div className="area-item">
                        <span className="area-icon">❤️</span>
                        <span className="area-name">Эмоциональная</span>
                        <div className="area-bar">
                          <div className="area-fill" style={{ width: `${compatibilityResult.areas.emotional * 10}%` }}></div>
                        </div>
                        <span className="area-score">{compatibilityResult.areas.emotional}/10</span>
                      </div>
                      <div className="area-item">
                        <span className="area-icon">🧠</span>
                        <span className="area-name">Интеллектуальная</span>
                        <div className="area-bar">
                          <div className="area-fill" style={{ width: `${compatibilityResult.areas.intellectual * 10}%` }}></div>
                        </div>
                        <span className="area-score">{compatibilityResult.areas.intellectual}/10</span>
                      </div>
                      <div className="area-item">
                        <span className="area-icon">💪</span>
                        <span className="area-name">Физическая</span>
                        <div className="area-bar">
                          <div className="area-fill" style={{ width: `${compatibilityResult.areas.physical * 10}%` }}></div>
                        </div>
                        <span className="area-score">{compatibilityResult.areas.physical}/10</span>
                      </div>
                      <div className="area-item">
                        <span className="area-icon">✨</span>
                        <span className="area-name">Духовная</span>
                        <div className="area-bar">
                          <div className="area-fill" style={{ width: `${compatibilityResult.areas.spiritual * 10}%` }}></div>
                        </div>
                        <span className="area-score">{compatibilityResult.areas.spiritual}/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="compatibility-details">
                    <div className="detail-section strengths">
                      <h4>✨ Сильные стороны:</h4>
                      <ul>
                        {compatibilityResult.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="detail-section challenges">
                      <h4>⚠️ Вызовы:</h4>
                      <ul>
                        {compatibilityResult.challenges.map((challenge, idx) => (
                          <li key={idx}>{challenge}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="detail-section advice">
                      <h4>💡 Рекомендации:</h4>
                      <ul>
                        {compatibilityResult.advice.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {compatibilityResult.communication && (
                      <div className="detail-section communication">
                        <h4>💬 Советы по Коммуникации:</h4>
                        <ul>
                          {compatibilityResult.communication.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {compatibilityResult.growth && (
                      <div className="detail-section growth">
                        <h4>🌱 Возможности для Роста:</h4>
                        <ul>
                          {compatibilityResult.growth.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {compatibilityResult.warning && (
                      <div className="detail-section warning">
                        <h4>🚨 На Что Обратить Внимание:</h4>
                        <ul>
                          {compatibilityResult.warning.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="natal-chart-banner">
                    <div className="banner-content">
                      <div className="banner-icon">🌟</div>
                      <div className="banner-text">
                        <h3>Хотите узнать больше о вашей совместимости?</h3>
                        <p>Получите полный астрологический анализ с учётом всех планет, домов и аспектов в вашей натальной карте!</p>
                        <ul className="banner-features">
                          <li>✓ Анализ 16 астрологических точек</li>
                          <li>✓ Синастрия (совместимость карт)</li>
                          <li>✓ Детальные рекомендации</li>
                          <li>✓ Прогноз развития отношений</li>
                        </ul>
                      </div>
                      <button
                        className="banner-btn"
                        onClick={() => navigate('/compatibility')}
                      >
                        Проверить по Натальной Карте →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NumerologyPage;
