import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🔮 Таро Помощник</h3>
          <p>Принимайте лучшие решения с мудростью Таро</p>
        </div>

        <div className="footer-section">
          <h4>Навигация</h4>
          <Link to="/cards">Колода Таро</Link>
          <Link to="/numerology">Нумерология</Link>
          <Link to="/natal-chart">Натальная Карта</Link>
          <Link to="/learn">Обучение</Link>
          <Link to="/premium">Премиум</Link>
        </div>

        <div className="footer-section">
          <h4>Информация</h4>
          <Link to="/privacy">Конфиденциальность</Link>
          <Link to="/terms">Условия использования</Link>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <a href="mailto:support@tarot-assistant.com">support@tarot-assistant.com</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} AI Tarot Decision Assistant. Все права защищены.</p>
        <p className="footer-version">v1.0.0</p>
      </div>
    </footer>
  )
}

export default Footer
