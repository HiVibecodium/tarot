import { Component } from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }

    // Here you could send error to analytics/monitoring service
    // analytics.trackError(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">🔮</div>
            <h1>Что-то пошло не так</h1>
            <p className="error-message">
              Произошла непредвиденная ошибка. Не волнуйтесь, ваши данные в безопасности.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Подробности ошибки (dev mode)</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <div className="error-actions">
              <button
                className="error-btn error-btn-primary"
                onClick={this.handleRetry}
              >
                Попробовать снова
              </button>
              <button
                className="error-btn error-btn-secondary"
                onClick={this.handleGoHome}
              >
                На главную
              </button>
              <button
                className="error-btn error-btn-tertiary"
                onClick={this.handleReload}
              >
                Перезагрузить страницу
              </button>
            </div>

            <p className="error-hint">
              Если проблема повторяется, попробуйте очистить кэш браузера или обратитесь в поддержку.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
