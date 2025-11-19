import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AchievementBadge, { checkAchievements, ACHIEVEMENTS } from '../components/AchievementBadge'
import axios from 'axios'
import './AchievementsPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function AchievementsPage() {
  const { token, user: authUser } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [readings, setReadings] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileRes, readingsRes] = await Promise.all([
        axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/readings/history?limit=200`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setProfile(profileRes.data.data.user)
      setReadings(readingsRes.data.data.readings || [])

      const unlocked = checkAchievements(profileRes.data.data.user, readingsRes.data.data.readings || [])
      setUnlockedAchievements(unlocked)
    } catch (error) {
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const allAchievements = Object.values(ACHIEVEMENTS)
  const unlockedCount = unlockedAchievements.length
  const totalCount = allAchievements.length
  const progressPercent = Math.round((unlockedCount / totalCount) * 100)

  const categories = {
    '🎴 Расклады': ['first_reading', 'ten_readings', 'fifty_readings', 'hundred_readings', 'spread_master'],
    '🎯 Решения': ['first_decision', 'ten_decisions', 'question_master'],
    '🔥 Активность': ['week_streak', 'month_streak', 'weekend_warrior', 'early_bird', 'night_owl'],
    '🌟 Специальные': ['love_seeker', 'wealth_builder', 'year_planner', 'birthday_celebrator', 'quick_thinker'],
    '🧙 Экспертность': ['astrology_explorer', 'numerology_student', 'journal_keeper', 'moon_watcher'],
    '🏆 Коллекции': ['all_major_arcana', 'card_collector', 'full_deck', 'major_arcana_fan', 'cups_lover'],
    '👑 Премиум': ['premium_user']
  }

  return (
    <div className="achievements-page">
      <div className="achievements-hero">
        <button onClick={() => navigate('/dashboard')} className="btn-back-ach">
          ← Назад
        </button>
        <h1>🏆 Достижения</h1>
        <p className="hero-subtitle">Ваша коллекция наград и успехов</p>
      </div>

      <div className="achievements-content">
        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-stats">
            <div className="progress-circle">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" strokeWidth="8"/>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercent / 100)}`}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="progress-text">
                <span className="progress-percent">{progressPercent}%</span>
              </div>
            </div>
            <div className="progress-info">
              <h2>Прогресс Достижений</h2>
              <p className="progress-count">
                <span className="count-unlocked">{unlockedCount}</span> из {totalCount} разблокировано
              </p>
              <p className="progress-message">
                {progressPercent === 100 && '🎉 Вы разблокировали все достижения!'}
                {progressPercent >= 75 && progressPercent < 100 && '🌟 Почти у цели! Осталось совсем немного!'}
                {progressPercent >= 50 && progressPercent < 75 && '✨ Отличный прогресс! Продолжайте в том же духе!'}
                {progressPercent >= 25 && progressPercent < 50 && '🚀 Хорошее начало! Много интересного впереди!'}
                {progressPercent < 25 && '🌱 Начало пути! Исследуйте и открывайте новое!'}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements by Category */}
        {Object.entries(categories).map(([category, achievementIds]) => (
          <div key={category} className="achievement-category">
            <h3 className="category-title">{category}</h3>
            <div className="achievements-grid">
              {achievementIds.map(id => {
                const isUnlocked = unlockedAchievements.includes(id)
                return (
                  <div key={id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="achievement-icon">{ACHIEVEMENTS[id]?.icon}</div>
                    <div className="achievement-details">
                      <h4>{ACHIEVEMENTS[id]?.name}</h4>
                      <p>{ACHIEVEMENTS[id]?.description}</p>
                      {!isUnlocked && (
                        <div className="achievement-lock">
                          <span className="lock-icon">🔒</span>
                          <span className="lock-text">Заблокировано</span>
                        </div>
                      )}
                      {isUnlocked && (
                        <div className="achievement-unlocked-badge">
                          ✓ Разблокировано
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Next Achievement Hint */}
        <div className="next-achievement-hint">
          <h3>💡 Подсказка</h3>
          <p>
            {unlockedCount === 0 && 'Сделайте свой первый расклад, чтобы разблокировать достижение "Первый Расклад"!'}
            {unlockedCount > 0 && unlockedCount < 5 && 'Продолжайте делать расклады каждый день, чтобы увеличить серию!'}
            {unlockedCount >= 5 && unlockedCount < 10 && 'Попробуйте разные типы раскладов, чтобы разблокировать специальные достижения!'}
            {unlockedCount >= 10 && unlockedCount < totalCount && 'Вы на правильном пути! Исследуйте все возможности приложения!'}
            {unlockedCount === totalCount && 'Поздравляем! Вы истинный мастер! 🎉'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AchievementsPage
