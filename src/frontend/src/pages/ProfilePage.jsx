import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import AchievementBadge, { checkAchievements, ACHIEVEMENTS } from '../components/AchievementBadge'
import { ProfileStatsSkeleton } from '../components/skeletons/LoadingSkeletons'
import ErrorDisplay from '../components/ErrorDisplay'
import { ProfileSEO } from '../components/SEO'
import './ProfilePage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function ProfilePage() {
  const { token, user: authUser } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const toast = useToast()

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [readings, setReadings] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])

  useEffect(() => {
    loadProfile()
    loadStats()
    loadReadings()
  }, [])

  useEffect(() => {
    if (profile && readings.length > 0) {
      const achievements = checkAchievements(profile, readings)
      setUnlockedAchievements(achievements)
    }
  }, [profile, readings])

  const loadProfile = async () => {
    try {
      setError(null)
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile(response.data.data.user)
      setDisplayName(response.data.data.user.displayName || '')
    } catch (err) {
      console.error('Load profile error:', err)
      setError(err)
    }
  }

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data.data.stats)
    } catch (err) {
      console.error('Load stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadReadings = async () => {
    try {
      const response = await axios.get(`${API_URL}/readings/history?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReadings(response.data.data.readings || [])

      // Check achievements
      const unlocked = checkAchievements(response.data.data.readings || [], stats)
      setUnlockedAchievements(unlocked)
    } catch (err) {
      console.error('Load readings error:', err)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      await axios.put(
        `${API_URL}/users/profile`,
        { displayName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await loadProfile()
      setEditing(false)
      toast.success('Профиль успешно обновлён!')
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Не удалось обновить профиль. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `tarot-data-${Date.now()}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success('Данные успешно экспортированы!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Не удалось экспортировать данные. Попробуйте снова.')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `${API_URL}/users/account`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { confirmation: 'DELETE MY ACCOUNT' }
        }
      )

      toast.success('Аккаунт успешно удалён')
      setTimeout(() => {
        localStorage.clear()
        navigate('/register')
      }, 1500)
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error(error.response?.data?.error?.message || 'Не удалось удалить аккаунт')
    }
  }

  if (!profile) return <div className="loading">Loading...</div>

  return (
    <div className="profile-page">
      <ProfileSEO />
      {/* Toast notifications */}
      {toast.toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          duration={t.duration}
          onClose={() => toast.hideToast(t.id)}
        />
      ))}

      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>👤 Профиль и Настройки</h1>
      </header>

      <main className="profile-content">
        {loading && <ProfileStatsSkeleton />}

        {error && <ErrorDisplay error={error} onRetry={loadProfile} context={{ page: 'profile' }} />}

        {!loading && !error && profile && (
          <>
            {/* Profile Section */}
            <div className="profile-card">
              <h2>Информация Профиля</h2>

              <div className="profile-field">
                <label>Электронная почта</label>
                <div className="field-value">{profile.email}</div>
              </div>

          <div className="profile-field">
            <label>Отображаемое Имя</label>
            {editing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ваше имя"
              />
            ) : (
              <div className="field-value">{profile.displayName || 'Не указано'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Подписка</label>
            <div className="field-value">
              <span className={`tier-badge ${profile.subscriptionTier}`}>
                {profile.subscriptionTier === 'premium' ? 'Премиум' : 'Бесплатно'}
              </span>
            </div>
          </div>

          {editing ? (
            <div className="button-group">
              <button onClick={handleSaveProfile} className="btn-primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">
                Отмена
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary">
              Редактировать Профиль
            </button>
          )}
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="profile-card">
            <h2>Ваша Статистика</h2>

            <div className="stats-grid-detailed">
              <div className="stat-box">
                <span className="stat-icon">📊</span>
                <span className="stat-number">{stats.readings.total}</span>
                <span className="stat-label">Всего Раскладов</span>
              </div>

              <div className="stat-box">
                <span className="stat-icon">🔥</span>
                <span className="stat-number">{stats.streaks.current}</span>
                <span className="stat-label">Текущая Серия</span>
              </div>

              <div className="stat-box">
                <span className="stat-icon">🏆</span>
                <span className="stat-number">{stats.streaks.longest}</span>
                <span className="stat-label">Лучшая Серия</span>
              </div>

              <div className="stat-box">
                <span className="stat-icon">🎯</span>
                <span className="stat-number">{stats.readings.decisions}</span>
                <span className="stat-label">Решений Принято</span>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <div className="profile-card">
          <h2>🏆 Достижения</h2>
          <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
            Получено: {unlockedAchievements.length} из {Object.keys(ACHIEVEMENTS).length}
          </p>

          <div className="achievements-grid">
            {Object.keys(ACHIEVEMENTS).map(achId => (
              <AchievementBadge
                key={achId}
                achievementId={achId}
                unlocked={unlockedAchievements.includes(achId)}
                size="medium"
              />
            ))}
          </div>
        </div>

        {/* GDPR Section */}
        <div className="profile-card gdpr-section">
          <h2>Приватность и Данные</h2>

          <div className="gdpr-actions">
            <div className="gdpr-item">
              <div>
                <strong>Экспорт Ваших Данных</strong>
                <p>Скачать все ваши расклады и данные профиля (GDPR)</p>
              </div>
              <button onClick={handleExportData} className="btn-secondary">
                📥 Экспортировать Данные
              </button>
            </div>

            <div className="gdpr-item danger-zone">
              <div>
                <strong>Удалить Аккаунт</strong>
                <p>Навсегда удалить ваш аккаунт и все данные</p>
              </div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger"
                >
                  Удалить Аккаунт
                </button>
              ) : (
                <div className="delete-confirm">
                  <p className="warning-text">⚠️ Это действие нельзя отменить!</p>
                  <div className="button-group">
                    <button onClick={handleDeleteAccount} className="btn-danger">
                      Да, Удалить
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default ProfilePage
