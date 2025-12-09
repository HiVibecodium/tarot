import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './BottomNav.css'

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Don't show on landing, login, register pages
  const hiddenPaths = ['/', '/landing', '/login', '/register']
  if (hiddenPaths.includes(location.pathname)) {
    return null
  }

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Главная' },
    { path: '/reading/daily', icon: '🔮', label: 'Расклад' },
    { path: '/cards', icon: '🃏', label: 'Карты' },
    { path: '/history', icon: '📜', label: 'История', requiresAuth: true },
    { path: '/profile', icon: '👤', label: 'Профиль', requiresAuth: true }
  ]

  const handleNavClick = (item) => {
    if (item.requiresAuth && !isAuthenticated) {
      navigate('/login')
    } else {
      navigate(item.path)
    }
  }

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true
    if (path === '/reading/daily' && location.pathname.startsWith('/reading')) return true
    if (path === '/cards' && location.pathname === '/cards') return true
    if (path === '/history' && location.pathname === '/history') return true
    if (path === '/profile' && location.pathname === '/profile') return true
    return false
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => handleNavClick(item)}
          aria-label={item.label}
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
