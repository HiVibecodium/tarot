import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { HistoryListSkeleton } from '../components/skeletons/LoadingSkeletons'
import ErrorDisplay from '../components/ErrorDisplay'
import SpreadModal from '../components/SpreadModal'
import './HistoryPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function HistoryPage() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [readings, setReadings] = useState([])
  const [filteredReadings, setFilteredReadings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [selectedReading, setSelectedReading] = useState(null)

  const handleExportPDF = async (readingId) => {
    try {
      const response = await axios.get(`${API_URL}/readings/${readingId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `tarot-reading-${readingId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Не удалось экспортировать PDF')
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    // Filter readings based on selected filter
    if (filter === 'all') {
      setFilteredReadings(readings)
    } else {
      setFilteredReadings(readings.filter(r =>
        r.type === filter || r.spreadType === filter
      ))
    }
  }, [readings, filter])

  const loadHistory = async () => {
    try {
      setError(null)
      const response = await axios.get(`${API_URL}/readings/history?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReadings(response.data.data.readings || [])
    } catch (err) {
      console.error('Load history error:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type, reading) => {
    switch(type) {
      case 'daily': return '📅 Расклад Дня'
      case 'decision': return '🎯 Анализ Решения'
      case 'purchase': return '🛒 Покупка'
      case 'spread':
        // For universal spreads, use spreadName
        if (reading.spreadName) return reading.spreadName
        if (reading.spreadType === 'celtic-cross') return '🔮 Кельтский Крест'
        if (reading.spreadType === 'relationship') return '💕 Расклад Отношений'
        if (reading.spreadType === 'career-path') return '💼 Карьерный Путь'
        if (reading.spreadType === 'year-ahead') return '🎆 Путь Года'
        return '🎴 Расклад'
      default: return type
    }
  }

  return (
    <div className="history-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>📖 История Раскладов</h1>
      </header>

      <main className="history-content">
        {!loading && !error && readings.length > 0 && (
          <div className="filter-bar">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все ({readings.length})
            </button>
            <button
              className={`filter-btn ${filter === 'daily' ? 'active' : ''}`}
              onClick={() => setFilter('daily')}
            >
              📅 Дневные ({readings.filter(r => r.type === 'daily').length})
            </button>
            <button
              className={`filter-btn ${filter === 'spread' ? 'active' : ''}`}
              onClick={() => setFilter('spread')}
            >
              🎴 Расклады ({readings.filter(r => r.type === 'spread').length})
            </button>
            <button
              className={`filter-btn ${filter === 'decision' ? 'active' : ''}`}
              onClick={() => setFilter('decision')}
            >
              🎯 Решения ({readings.filter(r => r.type === 'decision').length})
            </button>
          </div>
        )}

        {loading && <HistoryListSkeleton count={5} />}

        {error && <ErrorDisplay error={error} onRetry={loadHistory} context={{ page: 'history' }} />}

        {!loading && !error && readings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔮</div>
            <h2>Пока нет раскладов</h2>
            <p>Ваши расклады будут отображаться здесь</p>
            <button onClick={() => navigate('/reading/daily')} className="btn-primary">
              Вытянуть Первую Карту
            </button>
          </div>
        )}

        <div className="history-list">
          {filteredReadings.map((reading) => (
            <div key={reading._id} className="history-item">
              <div className="history-header">
                <span className="type-badge">{getTypeLabel(reading.type, reading)}</span>
                <span className="date">
                  {new Date(reading.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="history-body">
                {(reading.question || reading.context?.question) && (
                  <div className="question-text">
                    <strong>Вопрос:</strong> {reading.question || reading.context?.question}
                  </div>
                )}

                {reading.type === 'spread' && reading.context?.partner && (
                  <div className="context-info">
                    <strong>Партнёр:</strong> {reading.context.partner}
                  </div>
                )}

                {reading.type === 'spread' && reading.context?.careerGoal && (
                  <div className="context-info">
                    <strong>Цель:</strong> {reading.context.careerGoal}
                  </div>
                )}

                {reading.type === 'spread' && reading.context?.yearGoal && (
                  <div className="context-info">
                    <strong>Цель на год:</strong> {reading.context.yearGoal}
                  </div>
                )}

                <div className="cards-summary">
                  {reading.cards.map((card, idx) => (
                    <div key={idx} className="card-mini">
                      <span className="card-name">
                        {card.cardName || card.name}
                        {card.reversed && ' (↓)'}
                      </span>
                      {reading.type === 'decision' && card.positionName && (
                        <span className="position-mini">{card.positionName}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="interpretation-preview">
                  {reading.interpretation?.summary?.substring(0, 150) || reading.interpretation?.text?.substring(0, 150)}
                  {(reading.interpretation?.summary || reading.interpretation?.text) && '...'}
                </div>

                {reading.type === 'spread' && (
                  <div className="spread-meta">
                    <span className="card-count">{reading.cards.length} карт</span>
                  </div>
                )}
              </div>

              <div className="history-footer">
                <span className="time">
                  🕐 {new Date(reading.createdAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <div className="footer-actions">
                  <button
                    onClick={() => setSelectedReading(reading)}
                    className="btn-view"
                    title="Просмотреть полностью"
                  >
                    👁️ Просмотр
                  </button>
                  <button
                    onClick={() => handleExportPDF(reading._id)}
                    className="btn-pdf-export"
                    title="Экспорт в PDF"
                  >
                    📄 PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for viewing reading details */}
      {selectedReading && (
        <SpreadModal
          reading={selectedReading}
          onClose={() => setSelectedReading(null)}
        />
      )}
    </div>
  )
}

export default HistoryPage
