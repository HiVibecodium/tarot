import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, clearError } from '../store/authSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())

    const result = await dispatch(login(formData))

    if (login.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>🔮 Таро Помощник Решений</h1>
        <h2>Вход</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ваш@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="error-message">
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {error.code === 'USER_NOT_FOUND' ? '❌ Пользователь не найден' :
                 error.code === 'WRONG_PASSWORD' ? '❌ Неверный пароль' :
                 error.code === 'ACCOUNT_DISABLED' ? '❌ Аккаунт отключен' :
                 error.code === 'MISSING_CREDENTIALS' ? '❌ Заполните все поля' :
                 error.code === 'NETWORK_ERROR' ? '❌ Ошибка сети' :
                 '❌ Ошибка входа'}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {error.message || 'Неизвестная ошибка'}
              </div>
              {error.details && (
                <div style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.8 }}>
                  {error.details}
                </div>
              )}
              {error.code === 'NETWORK_ERROR' && (
                <div style={{ fontSize: '0.85rem', marginTop: '8px', color: '#ff6b6b' }}>
                  💡 Совет: Проверьте в консоли браузера (F12) детали ошибки
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
