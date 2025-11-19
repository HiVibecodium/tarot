import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register, clearError } from '../store/authSlice'

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
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

    const result = await dispatch(register(formData))

    if (register.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>🔮 Таро Помощник Решений</h1>
        <h2>Создать Аккаунт</h2>

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
            <label htmlFor="displayName">Имя (Опционально)</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Ваше Имя"
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
                {error.code === 'USER_EXISTS' ? '❌ Email уже используется' :
                 error.code === 'WEAK_PASSWORD' ? '❌ Слабый пароль' :
                 error.code === 'MISSING_FIELDS' ? '❌ Заполните все поля' :
                 '❌ Ошибка регистрации'}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {error.code === 'USER_EXISTS' ? 'Пользователь с таким email уже зарегистрирован. Попробуйте войти.' :
                 error.code === 'WEAK_PASSWORD' ? 'Пароль должен быть минимум 6 символов' :
                 error.message}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-link">
          Уже есть аккаунт? <Link to="/login">Вход</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
