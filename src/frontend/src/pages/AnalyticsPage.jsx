import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SimpleChart from '../components/SimpleChart'
import { AnalyticsSkeleton } from '../components/skeletons/LoadingSkeletons'
import { AnalyticsSEO } from '../components/SEO'
import './AnalyticsPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function AnalyticsPage() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReadings()
  }, [])

  const loadReadings = async () => {
    try {
      const response = await axios.get(`${API_URL}/readings/history?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReadings(response.data.data.readings || [])
    } catch (error) {
      console.error('Load readings error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Card frequency analysis
  const getCardFrequency = () => {
    const frequency = {}
    readings.forEach(reading => {
      reading.cards?.forEach(card => {
        const cardName = card.cardName || card.name
        frequency[cardName] = (frequency[cardName] || 0) + 1
      })
    })

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, value]) => ({ label, value }))
  }

  // Reading types distribution
  const getReadingTypes = () => {
    const types = {
      daily: 0,
      decision: 0,
      purchase: 0
    }

    readings.forEach(r => {
      types[r.type] = (types[r.type] || 0) + 1
    })

    return [
      { label: 'Расклад дня', value: types.daily, color: '#667eea' },
      { label: 'Анализ решений', value: types.decision, color: '#764ba2' },
      { label: 'Покупки', value: types.purchase, color: '#f093fb' },
      { label: '🎴 Расклады Таро', value: types.spread, color: '#27ae60' }
    ].filter(t => t.value > 0)
  }

  // Spread types statistics
  const getSpreadTypesStats = () => {
    const spreadTypes = {}
    readings.filter(r => r.type === 'spread').forEach(r => {
      const type = r.spreadType || 'unknown'
      spreadTypes[type] = (spreadTypes[type] || 0) + 1
    })

    const labels = {
      'celtic-cross': '🔮 Кельтский Крест',
      'relationship': '💕 Отношения',
      'career-path': '💼 Карьера',
      'year-ahead': '🎆 Год Вперёд'
    }

    return Object.entries(spreadTypes).map(([type, value]) => ({
      label: labels[type] || type,
      value,
      color: type === 'celtic-cross' ? '#667eea' :
             type === 'relationship' ? '#ff6b9d' :
             type === 'career-path' ? '#4facfe' :
             type === 'year-ahead' ? '#fa709a' : '#999'
    }))
  }

  // Monthly activity
  const getMonthlyActivity = () => {
    const months = {}
    readings.forEach(r => {
      const month = new Date(r.createdAt).toLocaleDateString('ru-RU', { month: 'short' })
      months[month] = (months[month] || 0) + 1
    })

    return Object.entries(months)
      .map(([label, value]) => ({ label, value }))
  }

  return (
    <div className="analytics-page">
      <AnalyticsSEO />
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>📊 Аналитика и Статистика</h1>
      </header>

      <main className="analytics-content">
        {loading && <AnalyticsSkeleton />}

        {!loading && readings.length === 0 && (
          <div className="empty-state">
            <p>Пока нет данных для аналитики</p>
            <p>Создайте несколько раскладов!</p>
          </div>
        )}

        {!loading && readings.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="analytics-summary">
              <div className="summary-card">
                <span className="summary-number">{readings.length}</span>
                <span className="summary-label">Всего раскладов</span>
              </div>
              <div className="summary-card">
                <span className="summary-number">
                  {new Set(readings.flatMap(r => r.cards?.map(c => c.cardId))).size}
                </span>
                <span className="summary-label">Уникальных карт</span>
              </div>
              <div className="summary-card">
                <span className="summary-number">
                  {readings.filter(r => r.type === 'decision').length}
                </span>
                <span className="summary-label">Решений принято</span>
              </div>
              <div className="summary-card highlight">
                <span className="summary-number">
                  {readings.filter(r => r.type === 'spread').length}
                </span>
                <span className="summary-label">🎴 Раскладов Таро</span>
              </div>
            </div>

            {/* Spread Types Chart */}
            {readings.filter(r => r.type === 'spread').length > 0 && (
              <div className="chart-container">
                <h2>Типы Раскладов Таро</h2>
                <div className="bar-chart">
                  {getSpreadTypesStats().map((item, idx) => (
                    <div key={idx} className="bar-item">
                      <div className="bar-label">{item.label}</div>
                      <div className="bar-wrapper">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(item.value / Math.max(...getSpreadTypesStats().map(s => s.value))) * 100}%`,
                            background: item.color
                          }}
                        />
                        <span className="bar-value">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="charts-grid">
              <SimpleChart
                data={getCardFrequency()}
                title="📈 Топ-10 Самых Частых Карт"
                type="bar"
              />

              <SimpleChart
                data={getReadingTypes()}
                title="🎯 Типы Раскладов"
                type="pie"
              />

              {getMonthlyActivity().length > 1 && (
                <SimpleChart
                  data={getMonthlyActivity()}
                  title="📅 Активность по Месяцам"
                  type="bar"
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default AnalyticsPage
