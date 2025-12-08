import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { TableSkeleton, ContentSkeleton } from '../components/skeletons/LoadingSkeletons'
import ErrorDisplay from '../components/ErrorDisplay'
import './AdminPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function AdminPage() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAdminData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load system stats
      const statsResponse = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(statsResponse.data.data.stats)

      // Load users
      const usersResponse = await axios.get(`${API_URL}/admin/users?limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(usersResponse.data.data.users || [])

    } catch (error) {
      console.error('Load admin data error:', error)
      if (error.response?.status === 403) {
        setError('У вас нет прав администратора')
      } else {
        setError('Не удалось загрузить данные администратора')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <header className="reading-header">
          <button onClick={() => navigate('/dashboard')} className="btn-back">← Назад</button>
          <h1>👨‍💼 Админ Панель</h1>
        </header>
        <main className="admin-content">
          <ContentSkeleton lines={10} />
          <TableSkeleton rows={5} cols={4} />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-page">
        <header className="reading-header">
          <button onClick={() => navigate('/dashboard')} className="btn-back">← Назад</button>
          <h1>👨‍💼 Админ Панель</h1>
        </header>
        <main className="admin-content">
          <ErrorDisplay
            error={{ response: { status: 403, data: { error: { message: error }}}}}
            onRetry={loadAdminData}
            context={{ page: 'admin' }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>👨‍💼 Админ Панель</h1>
      </header>

      <main className="admin-content">
        {/* System Stats */}
        {stats && (
          <div className="admin-section">
            <h2>📊 Системная Статистика</h2>

            <div className="stats-overview">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.users.total}</div>
                  <div className="stat-label">Всего пользователей</div>
                  <div className="stat-detail">
                    👑 Premium: {stats.users.premium}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🃏</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.cards.total}</div>
                  <div className="stat-label">Карт в колоде</div>
                  <div className="stat-detail">
                    Major: {stats.cards.major} | Minor: {stats.cards.minor}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔮</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.readings.total}</div>
                  <div className="stat-label">Всего раскладов</div>
                  <div className="stat-detail">
                    Сегодня: {stats.readings.today}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="admin-section">
          <h2>👥 Пользователи (последние 20)</h2>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Имя</th>
                  <th>Подписка</th>
                  <th>Расклады</th>
                  <th>Серия</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.displayName || '-'}</td>
                    <td>
                      <span className={`tier-badge ${u.subscriptionTier}`}>
                        {u.subscriptionTier === 'premium' ? '👑 Premium' : 'Free'}
                      </span>
                    </td>
                    <td>{u.totalReadings}</td>
                    <td>{u.currentStreak} дн.</td>
                    <td>{new Date(u.createdAt).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPage
